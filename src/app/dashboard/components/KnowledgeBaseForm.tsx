'use client'

import { useState, useTransition } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { saveKnowledge } from '../actions'

export default function KnowledgeBaseForm({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent)
  const [isLoading, startTransition] = useTransition()
  const [notice, setNotice] = useState<{ error?: string; success?: boolean }>({})
  return (
    <form onSubmit={event => {
      event.preventDefault()
      setNotice({})
      startTransition(async () => {
        try { setNotice(await saveKnowledge(content)) }
        catch (error) {
          unstable_rethrow(error)
          setNotice({ error: 'Не удалось сохранить данные. Проверьте соединение и повторите попытку.' })
        }
      })
    }} className="mt-5 space-y-4" aria-busy={isLoading}>
      <label htmlFor="knowledge-content" className="block text-sm font-semibold text-slate-700">Информация о компании</label>
      <p id="knowledge-hint" className="text-sm text-slate-500">Расскажите об услугах, ценах и ответах на частые вопросы.</p>
      <textarea id="knowledge-content" name="content" rows={10} required maxLength={50000}
        aria-describedby="knowledge-hint" value={content} disabled={isLoading}
        onChange={event => { setContent(event.target.value); setNotice({}) }}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60" />
      <button type="submit" disabled={isLoading || !content.trim()} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? 'Сохраняем…' : 'Сохранить'}
      </button>
      <div aria-live="polite" role="status" className="text-sm">
        {notice.error && <p className="text-red-700">{notice.error}</p>}
        {notice.success && <p className="text-emerald-700">База знаний сохранена.</p>}
      </div>
    </form>
  )
}
