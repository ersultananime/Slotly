import assert from 'node:assert/strict'
import { test } from 'node:test'
import { downloadPage, extractPage, publicAddress, websiteUrl } from './source'
import { summarizeWebsite } from './summarize'

test('accept public websites, normalize bare domains, reject internal or unsafe URLs', () => {
  assert.equal(websiteUrl('example.com/services#prices').href, 'https://example.com/services')
  assert.equal(websiteUrl('https://пример.kz').protocol, 'https:')
  for (const input of ['', 'file:///etc/passwd', 'ftp://example.com', 'http://localhost',
    'http://127.1', 'http://2130706433', 'http://0x7f000001', 'http://169.254.169.254',
    'http://10.0.0.1', 'http://[::1]', 'http://[::ffff:127.0.0.1]', 'https://site.local',
    'https://user:pass@example.com', 'https://example.com:8080']) {
    assert.throws(() => websiteUrl(input), Error, input)
  }
})

test('blocks private, loopback, link-local, reserved and mapped IP ranges', () => {
  for (const address of ['127.0.0.1', '0.0.0.0', '10.1.2.3', '172.16.0.1', '192.168.0.1',
    '169.254.169.254', '100.64.0.1', '224.0.0.1', '255.255.255.255', '::1', 'fe80::1',
    'fc00::1', '::ffff:192.168.0.1', '2001:db8::1']) {
    assert.equal(publicAddress(address), false, address)
  }
  assert.equal(publicAddress('8.8.8.8'), true)
  assert.equal(publicAddress('2606:4700:4700::1111'), true)
})

test('rejects internal URLs before opening a socket', async () => {
  await assert.rejects(downloadPage(new URL('http://169.254.169.254/latest/meta-data'), AbortSignal.timeout(1000)))
  await assert.rejects(downloadPage(new URL('https://other.example/services'), AbortSignal.timeout(1000), 'https://example.com'))
})

test('extracts readable facts and only relevant same-origin links', () => {
  const html = Buffer.from(`<html><head><title>Компания</title><meta name="description" content="Услуги ремонта"></head>
    <body><h1>Ремонт</h1><p>Цена: 5 000 ₸ &amp; доставка</p><p>Телефон: +7 777 123 45 67</p>
    <script>secret script text</script><style>secret CSS</style><div hidden>hidden data</div>
    <a href="/services">Услуги</a><a href="/prices#one">Цены</a><a href="/prices#two">Цены</a>
    <a href="https://external.com/contact">Контакты</a><a href="javascript:alert(1)">FAQ</a>
    <a href="/prices.pdf">Прайс</a><a href="/news">Новости</a></body></html>`)
  const result = extractPage(html, new URL('https://example.com/'))
  assert.match(result.page.text, /5 000 ₸ & доставка/)
  assert.match(result.page.text, /Телефон/)
  assert.doesNotMatch(result.page.text, /secret|hidden data/)
  assert.deepEqual(result.links, ['https://example.com/services', 'https://example.com/prices'])
})

test('caps page text and discovered links', () => {
  const html = Buffer.from(`<body>${'текст '.repeat(20000)}${Array.from({length: 20}, (_, i) => `<a href="/service-${i}">Услуга</a>`).join('')}</body>`)
  const result = extractPage(html, new URL('https://example.com/'))
  assert.equal(result.page.text.length, 14000)
  assert.equal(result.links.length, 4)
})

test('AI request sends bounded source data and rejects failed or incomplete responses', async t => {
  const previous = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'test-key-not-real'
  t.after(() => { if (previous === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previous })
  let result: unknown = { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'О компании: ремонт.' }] } }] }
  const mocked = t.mock.method(globalThis, 'fetch', async (url: unknown, init: RequestInit) => {
    assert.match(String(url), /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-2\.5-flash:generateContent/)
    assert.equal(new Headers(init.headers).get('x-goog-api-key'), 'test-key-not-real')
    const request = JSON.parse(init.body as string)
    assert.ok(request.generationConfig.maxOutputTokens <= 3500)
    assert.match(request.systemInstruction.parts[0].text, /недоверенные данные/)
    assert.equal(JSON.parse(request.contents[0].parts[0].text).pages[0].url, 'https://example.com/')
    return Response.json(result)
  })
  const pages = [{ url: 'https://example.com/', title: 'Компания', text: 'Услуги ремонта' }]
  assert.equal(await summarizeWebsite(pages), 'О компании: ремонт.')
  result = { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: 'обрезано' }] } }] }
  await assert.rejects(summarizeWebsite(pages), /не завершён/)
  result = { candidates: [{ finishReason: 'STOP', content: { parts: [] } }] }
  await assert.rejects(summarizeWebsite(pages), /полное описание/)
  result = { promptFeedback: { blockReason: 'SAFETY' } }
  await assert.rejects(summarizeWebsite(pages), /не смог обработать/)
  mocked.mock.mockImplementation(async () => Response.json({ error: { code: 429, status: 'RESOURCE_EXHAUSTED' } }, { status: 429 }))
  await assert.rejects(summarizeWebsite(pages), /бесплатный лимит Gemini.*RESOURCE_EXHAUSTED/)
  mocked.mock.mockImplementation(async () => Response.json({ error: { code: 400, status: 'API_KEY_INVALID' } }, { status: 400 }))
  await assert.rejects(summarizeWebsite(pages), /Ключ Gemini недействителен.*API_KEY_INVALID/)
  mocked.mock.mockImplementation(async () => Response.json({ error: { code: 404, status: 'NOT_FOUND' } }, { status: 404 }))
  await assert.rejects(summarizeWebsite(pages), /Модель Gemini недоступна.*NOT_FOUND/)
})
