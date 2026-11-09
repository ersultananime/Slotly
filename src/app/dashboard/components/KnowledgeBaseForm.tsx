'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Globe, LoaderCircle, Sparkles } from 'lucide-react'

type Analysis = { content: string; sources: { url: string; title: string }[]; skipped: number }

export default function KnowledgeBaseForm({ initialContent }: { initialContent: string }) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [url, setUrl] = useState('')
  const [isLoading, startTransition] = useTransition()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzing = useRef(false)
  const [showEditor, setShowEditor] = useState(Boolean(initialContent))
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [notice, setNotice] = useState<{ error?: string; success?: boolean }>({})
  const busy = isLoading || isAnalyzing

  async function analyzeSite(event: React.FormEvent) {
    event.preventDefault()
    if (analyzing.current || isLoading) return
    analyzing.current = true
    setIsAnalyzing(true)
    setAnalysisError('')
    setNotice({})
    try {
      const response = await fetch('/dashboard/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }), signal: AbortSignal.timeout(85000),
      })
      // Proxy redirects expired sessions before the route is reached.
      if (response.status === 401 || response.redirected) {
        router.replace('/login')
        return
      }
      const data = await response.json()
      if (!response.ok) { setAnalysisError(data.error || 'Не удалось проанализировать сайт. Попробуйте позже.'); return }
      if (typeof data.content !== 'string' || !Array.isArray(data.sources)) throw new Error('Invalid response')
      setAnalysis(data)
    } catch {
      setAnalysisError('Не удалось завершить анализ. Проверьте соединение или заполните информацию вручную.')
    } finally {
      analyzing.current = false
      setIsAnalyzing(false)
    }
  }

  return <div className="mt-5 space-y-6">
    <form onSubmit={analyzeSite} aria-busy={isAnalyzing} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-white p-2.5 text-blue-600"><Globe size={22} aria-hidden="true" /></span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Вставьте ссылку — мы подготовим консультанта</h3>
          <p id="website-hint" className="mt-1 text-sm leading-6 text-slate-600">Соберём информацию об услугах, ценах и контактах. Вам останется проверить текст и сохранить его.</p>
        </div>
      </div>
      <label htmlFor="company-website" className="mt-5 block text-sm font-semibold text-slate-700">Сайт вашей компании</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="company-website" name="website" type="text" inputMode="url" autoComplete="url" required maxLength={2048}
          value={url} onChange={event => setUrl(event.target.value)} disabled={busy}
          aria-describedby="website-hint" placeholder="https://ваша-компания.kz"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base disabled:opacity-60" />
        <button type="submit" disabled={busy || !url.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isAnalyzing ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}
          {isAnalyzing ? 'Анализируем сайт…' : 'Подготовить базу знаний'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-600">{isAnalyzing ? 'Читаем страницы и составляем описание. Обычно это занимает до минуты.' : 'Прочитаем до 5 страниц. Результат появится здесь для проверки.'}</p>
      {analysisError && <p role="alert" className="mt-3 text-sm text-red-700">{analysisError}</p>}
    </form>

    {analysis && <section aria-label="Результат анализа сайта" className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <h3 className="text-lg font-bold">Описание готово</h3>
      <p className="mt-1 text-sm text-slate-600">Проверьте факты, особенно цены и контакты. Информация ещё не сохранена.</p>
      {analysis.skipped > 0 && <p className="mt-2 text-sm text-amber-800">Некоторые страницы прочитать не удалось. Проверьте, достаточно ли информации в описании.</p>}
      <div className="mt-4 max-h-80 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7">{analysis.content}</div>
      <details className="mt-3 text-sm text-slate-600"><summary className="cursor-pointer font-semibold">Просмотренные страницы ({analysis.sources.length})</summary>
        <ul className="mt-2 space-y-2">{analysis.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="break-all text-blue-700 underline">{source.title || source.url}</a></li>)}</ul>
      </details>
      <button type="button" disabled={busy} onClick={() => {
        setContent(analysis.content)
        setShowEditor(true)
        setAnalysis(null)
        setNotice({})
      }} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{content.trim() ? 'Заменить текст в редакторе' : 'Использовать это описание'}</button>
      <button type="button" disabled={busy} onClick={() => setAnalysis(null)} className="ml-3 mt-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600">Отменить</button>
    </section>}

    {!showEditor && <button type="button" disabled={busy} onClick={() => setShowEditor(true)} className="text-sm font-semibold text-blue-700 underline underline-offset-4 disabled:opacity-60">Нет сайта? Заполнить вручную</button>}

    {showEditor && <form onSubmit={event => {
      event.preventDefault()
      setNotice({})
      startTransition(async () => {
        try {
          const response = await fetch('/dashboard/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
            signal: AbortSignal.timeout(30000),
          })
          if (response.status === 401 || response.redirected) {
            router.replace('/login')
            return
          }
          const result = await response.json().catch(() => null)
          if (!response.ok || !result?.success) {
            setNotice({ error: result?.error || 'Не удалось сохранить данные. Попробуйте ещё раз.' })
            return
          }
          setNotice({ success: true })
          if (result.success) {
            window.location.hash = 'widget-code'
            document.getElementById('widget-code')?.focus({ preventScroll: true })
          }
        } catch {
          setNotice({ error: 'Не удалось сохранить данные. Проверьте соединение и повторите попытку.' })
        }
      })
    }} className="space-y-4" aria-busy={isLoading}>
      <label htmlFor="knowledge-content" className="block text-sm font-semibold text-slate-700">Информация для консультанта</label>
      <p id="knowledge-hint" className="text-sm text-slate-500">Уточните услуги, цены и ответы на частые вопросы. Консультант будет использовать сохранённый текст.</p>
      <textarea id="knowledge-content" name="content" rows={12} required maxLength={50000}
        aria-describedby="knowledge-hint" value={content} disabled={busy}
        onChange={event => { setContent(event.target.value); setNotice({}) }}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60" />
      <button type="submit" disabled={busy || !content.trim()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? 'Сохраняем…' : 'Сохранить и получить код виджета'}<ArrowRight size={18} aria-hidden="true" />
      </button>
      <div aria-live="polite" role="status" className="text-sm">
        {notice.error && <p className="text-red-700">{notice.error}</p>}
        {notice.success && <p className="text-emerald-700">База знаний сохранена. Скопируйте код виджета ниже.</p>}
      </div>
    </form>}
  </div>
}
