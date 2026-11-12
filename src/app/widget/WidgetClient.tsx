'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Bot, CheckCircle2, MessageCircle, Send, UserRound, X } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const welcome: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Здравствуйте! Задайте вопрос об услугах, ценах или условиях компании.',
}

export default function WidgetClient({
  companyId,
  sourcePage,
}: {
  companyId: string
  sourcePage: string
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.background = 'transparent'
    window.parent.postMessage({ type: 'slotly:resize', open }, '*')
    if (open) setTimeout(() => inputRef.current?.focus(), 180)
  }, [open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, showLeadForm, open])

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || loading || !companyId) return

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const previousMessages = messages
    setMessages(current => [...current, userMessage])
    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          message: text,
          history: previousMessages
            .filter(message => message.id !== 'welcome')
            .slice(-10)
            .map(message => ({ role: message.role, content: message.content })),
        }),
      })
      const body: unknown = await response.json().catch(() => null)
      const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}
      if (!response.ok || typeof payload.reply !== 'string') {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Не удалось получить ответ.')
      }

      setMessages(current => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: payload.reply as string,
      }])
      if (payload.suggestLead === true) setShowLeadForm(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось получить ответ.')
    } finally {
      setLoading(false)
    }
  }

  async function submitLead(event: FormEvent) {
    event.preventDefault()
    if (!contact.trim() || leadLoading || !companyId) return

    setLeadLoading(true)
    setError('')
    try {
      const conversation = messages
        .filter(message => message.role === 'user')
        .map(message => message.content)
        .join(' · ')
        .slice(0, 2000)
      const response = await fetch('/api/widget/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          name,
          contact,
          message: conversation,
          sourcePage,
        }),
      })
      const body: unknown = await response.json().catch(() => null)
      const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}
      if (!response.ok) {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Не удалось отправить заявку.')
      }
      setLeadSent(true)
      setShowLeadForm(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось отправить заявку.')
    } finally {
      setLeadLoading(false)
    }
  }

  if (!open) {
    return <main data-slotly-widget-root className="grid h-screen w-screen place-items-end bg-transparent p-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Открыть консультанта"
        className="grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-900/25 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </button>
    </main>
  }

  return <main data-slotly-widget-root className="h-screen w-screen bg-transparent p-1">
    <section aria-label="Консультант компании" className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
      <header className="flex items-center gap-3 bg-blue-600 px-4 py-3 text-white">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold">Консультант</h1>
          <p className="text-xs text-blue-100">Отвечает по информации компании</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть чат" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/15">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4" aria-live="polite">
        {!companyId && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Виджет настроен неправильно. Проверьте код установки.</p>}
        {messages.map(message => <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.role === 'assistant' && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700"><Bot className="h-4 w-4" aria-hidden="true" /></span>}
          <p className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}>{message.content}</p>
        </div>)}
        {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-700"><Bot className="h-4 w-4" aria-hidden="true" /></span>Готовлю ответ…</div>}

        {leadSent && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Заявка отправлена</p>
          <p className="mt-1">Представитель компании сможет связаться с вами.</p>
        </div>}

        {showLeadForm && !leadSent && <form onSubmit={submitLead} className="rounded-xl border border-blue-200 bg-white p-3 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><UserRound className="h-4 w-4 text-blue-600" aria-hidden="true" />Оставить заявку</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Укажите контакт только если согласны, чтобы представитель компании связался с вами.</p>
          <label className="mt-3 block text-xs font-semibold text-slate-700">Имя <span className="font-normal text-slate-400">(необязательно)</span>
            <input value={name} onChange={event => setName(event.target.value)} maxLength={120} autoComplete="name" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </label>
          <label className="mt-2 block text-xs font-semibold text-slate-700">Телефон, email или Telegram
            <input required value={contact} onChange={event => setContact(event.target.value)} maxLength={200} autoComplete="email" placeholder="+7… или @username" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </label>
          <button disabled={leadLoading} className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{leadLoading ? 'Отправляем…' : 'Отправить заявку'}</button>
        </form>}

        {!showLeadForm && !leadSent && messages.length > 1 && <button type="button" onClick={() => setShowLeadForm(true)} className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">Оставить контакт</button>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
        <label className="sr-only" htmlFor="slotly-message">Ваш вопрос</label>
        <input
          ref={inputRef}
          id="slotly-message"
          value={input}
          onChange={event => setInput(event.target.value)}
          maxLength={1200}
          disabled={!companyId || loading}
          placeholder="Напишите вопрос…"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 disabled:bg-slate-100"
        />
        <button type="submit" disabled={!input.trim() || loading || !companyId} aria-label="Отправить сообщение" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
      <p className="bg-white pb-2 text-center text-[10px] text-slate-400">Работает на Slotly</p>
    </section>
  </main>
}
