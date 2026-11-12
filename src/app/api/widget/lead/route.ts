import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requestAddress, takeRateLimit } from '@/lib/widget/rate-limit'
import { readJson, RequestBodyError } from '@/lib/widget/request'
import { leadRequestSchema, splitContact } from '@/lib/widget/validation'

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store', ...headers },
  })
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const parsed = leadRequestSchema.safeParse(body)
    if (!parsed.success) return json({ error: 'Проверьте имя и контакт.' }, 400)

    const { companyId, name, contact, message, sourcePage } = parsed.data
    const rate = takeRateLimit(
      `lead:${requestAddress(request)}:${companyId}`,
      5,
      10 * 60_000,
    )
    if (!rate.allowed) {
      return json(
        { error: 'Слишком много заявок. Попробуйте позже.' },
        429,
        { 'Retry-After': String(rate.retryAfterSeconds) },
      )
    }

    const supabase = createAdminClient()
    const contactFields = splitContact(contact)
    const summary = message || 'Посетитель оставил контакт через виджет.'

    // Production may still use the original extended lead schema. Try it first,
    // then fall back to the compact dashboard schema used by newer projects.
    let { error } = await supabase.from('leads').insert({
      company_id: companyId,
      client_name: name || null,
      ...contactFields,
      summary,
      source_page: sourcePage || null,
      status: 'new',
    })

    if (error?.code === 'PGRST204') {
      const fallback = await supabase.from('leads').insert({
        company_id: companyId,
        name: name || null,
        contact,
        message: summary,
        status: 'new',
      })
      error = fallback.error
    }

    if (error) {
      const reference = crypto.randomUUID()
      console.error('widget_lead_save_failed', {
        reference,
        code: error.code,
        message: error.message,
      })
      return json({ error: `Не удалось отправить заявку. Номер обращения: ${reference}.` }, 500)
    }

    return json({ success: true }, 201)
  } catch (error) {
    if (error instanceof RequestBodyError) return json({ error: error.message }, error.status)

    const reference = crypto.randomUUID()
    console.error('widget_lead_unhandled', { reference, error })
    return json({ error: `Не удалось отправить заявку. Номер обращения: ${reference}.` }, 500)
  }
}
