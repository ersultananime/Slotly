'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createImplicitClient } from '@/utils/supabase/implicit-client'

export default function ForgotPasswordPage() {
  const [supabase] = useState(() => createImplicitClient())
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/update-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      )

      if (resetError) {
        if (resetError.message.toLowerCase().includes('rate limit')) {
          setError('Слишком много запросов. Подождите немного и попробуйте снова.')
        } else {
          setError('Не удалось отправить письмо. Попробуйте ещё раз.')
        }
        return
      }

      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <Image src="/logo.jpeg" alt="" width={32} height={32} priority className="h-8 w-8 rounded-lg object-contain shadow-sm motion-safe:group-hover:scale-105 motion-safe:transition-transform" />
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Slotly<span className="text-blue-600">.</span>
        </span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Восстановление пароля
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Отправим ссылку для создания нового пароля.
        </p>

        {sent ? (
          <div className="space-y-5">
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Если аккаунт с таким email существует, письмо уже отправлено. Проверьте также папку «Спам».
            </div>
            <Link href="/login" className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Вернуться ко входу
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97] shadow-md shadow-blue-500/20"
            >
              {loading ? 'Отправляем…' : 'Получить ссылку'}
            </button>

            <Link href="/login" className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Вернуться ко входу
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
