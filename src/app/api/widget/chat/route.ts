import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { answerFromKnowledge, WidgetChatError } from '@/lib/widget/gemini'
import { requestAddress, takeRateLimit } from '@/lib/widget/rate-limit'
import { readJson, RequestBodyError } from '@/lib/widget/request'
import { chatRequestSchema } from '@/lib/widget/validation'

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store', ...headers },
  })
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const parsed = chatRequestSchema.safeParse(body)
    if (!parsed.success) return json({ error: 'Проверьте текст сообщения.' }, 400)

    const { companyId, message, history } = parsed.data
    const rate = takeRateLimit(
      `chat:${requestAddress(request)}:${companyId}`,
      25,
      60_000,
    )
    if (!rate.allowed) {
      return json(
        { error: 'Слишком много сообщений. Попробуйте через минуту.' },
        429,
        { 'Retry-After': String(rate.retryAfterSeconds) },
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('content')
      .eq('company_id', companyId)
      .not('content', 'is', null)
      .limit(10)

    if (error) {
      const reference = crypto.randomUUID()
      console.error('widget_knowledge_load_failed', {
        reference,
        code: error.code,
        message: error.message,
      })
      return json({ error: `Консультант временно недоступен. Номер обращения: ${reference}.` }, 500)
    }

    const knowledge = (data ?? [])
      .map(row => typeof row.content === 'string' ? row.content.trim() : '')
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 45_000)

    if (!knowledge) {
      return json({ error: 'Владелец сайта ещё не настроил консультанта.' }, 404)
    }

    const reply = await answerFromKnowledge({ knowledge, question: message, history })
    const suggestLead = /(?:запис|заказ|куп|связ|консультац|менеджер|остав|контакт|телефон|цена|стоим)/i.test(message)
      || reply.includes('Оставьте контакт')

    return json({ reply, suggestLead })
  } catch (error) {
    if (error instanceof RequestBodyError) return json({ error: error.message }, error.status)
    if (error instanceof WidgetChatError) return json({ error: error.message }, error.status)

    const reference = crypto.randomUUID()
    console.error('widget_chat_unhandled', { reference, error })
    return json({ error: `Консультант временно недоступен. Номер обращения: ${reference}.` }, 500)
  }
}
