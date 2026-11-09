import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { collectWebsite, websiteUrl, WebsiteError } from '@/lib/website/source'
import { summarizeWebsite } from '@/lib/website/summarize'

export const maxDuration = 90

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: Request) {
  // Cookie-authenticated, same-origin endpoint. Never forward user cookies to websites.
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return json({ error: 'Запрос отклонён. Обновите страницу и попробуйте снова.' }, 403)
  }
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Войдите в аккаунт ещё раз.' }, 401)
  const { data: company, error: companyError } = await supabase.from('companies').select('id').eq('user_id', user.id).maybeSingle()
  if (companyError || !company) return json({ error: 'Не удалось найти компанию. Обратитесь в поддержку.' }, 403)
  if (!process.env.GEMINI_API_KEY) return json({ error: 'Анализ сайта временно недоступен. Вы можете заполнить информацию вручную.' }, 503)

  try {
    // Bound the body even when Content-Length is absent or forged.
    const reader = request.body?.getReader()
    if (!reader) return json({ error: 'Введите ссылку на сайт.' }, 400)
    let bytes = 0
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 8192) { await reader.cancel(); return json({ error: 'Ссылка слишком длинная.' }, 413) }
      chunks.push(value)
    }
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!body || typeof body !== 'object' || !('url' in body) || typeof body.url !== 'string') {
      return json({ error: 'Введите ссылку на сайт.' }, 400)
    }
    const url = websiteUrl(body.url)
    // Atomic quota stored in Supabase, shared by all server instances.
    // Send an explicit JSON object. In production, an omitted body was resolved by
    // PostgREST as a different function signature and returned PGRST202.
    const { data: permitted, error: quotaError, status: quotaStatus } = await supabase.rpc(
      'claim_website_analysis',
      {},
    )
    if (quotaError) {
      const reference = crypto.randomUUID()
      // Only a validated error code and opaque reference are exposed to the browser.
      // The server log identifies the failing database without recording keys or tokens.
      const code = /^[A-Z0-9]{5,16}$/.test(quotaError.code) ? quotaError.code : 'QUOTA_UNAVAILABLE'
      console.error('website_analysis_quota_failed', {
        reference,
        code,
        status: quotaStatus,
        message: quotaError.message,
        project: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname,
      })
      return json({
        error: `Не удалось проверить доступ к анализу. Код: ${code}. Номер обращения: ${reference}.`,
      }, 503)
    }
    if (!permitted) return json({ error: 'Подождите минуту перед следующим анализом. Доступно до 10 попыток в час.' }, 429)
    const { pages, skipped } = await collectWebsite(url.href)
    const content = await summarizeWebsite(pages)
    return json({ content, sources: pages.map(page => ({ url: page.url, title: page.title })), skipped })
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'Не удалось прочитать ссылку. Попробуйте ещё раз.' }, 400)
    if (error instanceof WebsiteError) return json({ error: error.message }, 422)
    return json({ error: 'Не удалось завершить анализ. Сайт может быть недоступен. Попробуйте позже или заполните информацию вручную.' }, 502)
  }
}
