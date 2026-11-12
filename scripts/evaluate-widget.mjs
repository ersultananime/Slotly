import { readFile } from 'node:fs/promises'

const [baseUrlInput, companyId, suitePath, caseIdsInput] = process.argv.slice(2)

if (!baseUrlInput || !companyId || !suitePath) {
  console.error('Usage: node scripts/evaluate-widget.mjs <base-url> <company-id> <suite.json> [case-id,case-id]')
  process.exit(2)
}

const baseUrl = new URL(baseUrlInput)
if (!['http:', 'https:'].includes(baseUrl.protocol)) {
  throw new Error('The base URL must use HTTP or HTTPS')
}
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(companyId)) {
  throw new Error('Invalid company UUID')
}

const suite = JSON.parse(await readFile(suitePath, 'utf8'))
if (!Array.isArray(suite.cases) || suite.cases.length === 0 || suite.cases.length > 25) {
  throw new Error('The suite must contain from 1 to 25 cases')
}

const requestedIds = new Set((caseIdsInput ?? '').split(',').filter(Boolean))
const cases = requestedIds.size > 0
  ? suite.cases.filter(testCase => requestedIds.has(testCase.id))
  : suite.cases
if (cases.length === 0) throw new Error('None of the requested case IDs exist in the suite')

function normalized(value) {
  return value.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е')
}

function evaluate(answer, testCase) {
  const text = normalized(answer)
  const missingGroups = (testCase.mustContain ?? []).filter(group =>
    !group.some(value => text.includes(normalized(value))),
  )
  const forbidden = (testCase.mustNotContain ?? []).filter(value =>
    text.includes(normalized(value)),
  )
  return {
    pass: missingGroups.length === 0 && forbidden.length === 0,
    missingGroups,
    forbidden,
  }
}

const results = []
for (const [index, testCase] of cases.entries()) {
  const startedAt = performance.now()
  try {
    const response = await fetch(new URL('/api/widget/chat', baseUrl), {
      method: 'POST',
      signal: AbortSignal.timeout(35_000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId,
        message: testCase.question,
        history: [],
      }),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body || typeof body.reply !== 'string') {
      throw new Error(body?.error || `HTTP ${response.status}`)
    }

    const checks = evaluate(body.reply, testCase)
    results.push({
      id: testCase.id,
      category: testCase.category,
      question: testCase.question,
      answer: body.reply,
      durationMs: Math.round(performance.now() - startedAt),
      ...checks,
    })
  } catch (error) {
    results.push({
      id: testCase.id,
      category: testCase.category,
      question: testCase.question,
      answer: '',
      durationMs: Math.round(performance.now() - startedAt),
      pass: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  const result = results.at(-1)
  console.error(`[${index + 1}/${cases.length}] ${result.pass ? 'PASS' : 'FAIL'} ${testCase.id}`)
}

const passed = results.filter(result => result.pass).length
const durations = results.map(result => result.durationMs).sort((a, b) => a - b)
const summary = {
  suite: suite.name,
  total: results.length,
  passed,
  failed: results.length - passed,
  passRate: Math.round((passed / results.length) * 1000) / 10,
  averageDurationMs: Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length),
  p95DurationMs: durations[Math.max(0, Math.ceil(durations.length * 0.95) - 1)],
}

console.log(JSON.stringify({ summary, results }, null, 2))
if (summary.failed > 0) process.exitCode = 1
