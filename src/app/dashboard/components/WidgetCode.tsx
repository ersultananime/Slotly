'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function WidgetCode({ companyId }: { companyId: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  const code = `<script src="https://slotly-inky.vercel.app/widget.js" data-company-id="${companyId}"></script>`
  const previewUrl = `/widget?companyId=${encodeURIComponent(companyId)}&page=${encodeURIComponent('https://preview.slotly.local/')}`
  async function copyCode() {
    setError('')
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setError('Не удалось скопировать код. Выделите его и скопируйте вручную.')
    }
  }
  return <div className="mt-5 space-y-4">
    <p className="text-sm text-slate-500">Добавьте код перед закрывающим тегом &lt;/body&gt; на вашем сайте.</p>
    <pre tabIndex={0} aria-label="Код установки виджета" className="overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-7 text-emerald-300"><code>{code}</code></pre>
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={copyCode} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold hover:bg-slate-50">
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {copied ? 'Скопировано' : 'Скопировать код'}
      </button>
      <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
        Проверить виджет
      </a>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-bold">Перед установкой на рабочий сайт</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 sm:text-sm">
        <li>Задайте вопросы о цене, услугах и контактах.</li>
        <li>Спросите о том, чего нет в базе, и убедитесь, что ИИ не придумывает ответ.</li>
        <li>Оставьте тестовый контакт и проверьте его в разделе «Собранные лиды».</li>
      </ol>
    </div>
    <p role="status" aria-live="polite" className="text-sm text-slate-700">{error || (copied ? 'Код скопирован в буфер обмена.' : '')}</p>
  </div>
}
