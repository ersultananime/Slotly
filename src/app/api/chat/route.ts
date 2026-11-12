import { NextResponse } from 'next/server'
import { z } from 'zod'
import { answerFromKnowledge, WidgetChatError } from '@/lib/widget/gemini'
import { requestAddress, takeRateLimit } from '@/lib/widget/rate-limit'
import { readJson, RequestBodyError } from '@/lib/widget/request'

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
  history: z.array(z.object({
    sender: z.enum(['bot', 'user']),
    text: z.string().trim().min(1).max(1200),
  })).max(10).default([]),
})

const slotlyKnowledge = `Slotly находится в открытом бета-тестировании.
Slotly анализирует до пяти публичных страниц сайта компании и подготавливает черновик базы знаний. Владелец проверяет и редактирует текст перед сохранением.
После настройки владелец получает HTML-скрипт с идентификатором компании для установки виджета.
Виджет отвечает на вопросы только по сохранённой базе знаний конкретной компании. Если информации нет, он должен честно сообщить об этом.
Посетитель может добровольно открыть форму заявки и оставить имя, телефон, email или Telegram. Заявка сохраняется в разделе «Собранные лиды» личного кабинета владельца.
Для установки используется обычный внешний JavaScript-файл. Проверка совместимости с конструкторами сайтов и фреймворками проводится поэтапно во время бета-теста.
Текущая коммерческая цена и условия оплаты ещё не утверждены. Во время бета-тестирования регистрация бесплатна.
Интеграции с внешними CRM, уведомления в Telegram и перевод диалога живому оператору пока не реализованы.`

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store', ...headers },
  })
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) return json({ error: 'Введите вопрос длиной до 1200 символов.' }, 400)

    const rate = takeRateLimit(`demo:${requestAddress(request)}`, 20, 60_000)
    if (!rate.allowed) {
      return json(
        { error: 'Слишком много сообщений. Попробуйте через минуту.' },
        429,
        { 'Retry-After': String(rate.retryAfterSeconds) },
      )
    }

    const reply = await answerFromKnowledge({
      knowledge: slotlyKnowledge,
      question: parsed.data.message,
      history: parsed.data.history.map(item => ({
        role: item.sender === 'bot' ? 'assistant' as const : 'user' as const,
        content: item.text,
      })),
    })
    return json({ reply })
  } catch (error) {
    if (error instanceof RequestBodyError) return json({ error: error.message }, error.status)
    if (error instanceof WidgetChatError) return json({ error: error.message }, error.status)

    const reference = crypto.randomUUID()
    console.error('demo_chat_unhandled', { reference, error })
    return json({ error: `Демо временно недоступно. Номер обращения: ${reference}.` }, 500)
  }
}
