'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createImplicitClient } from '@/utils/supabase/implicit-client'

export default function UpdatePasswordPage() {
  const [supabase] = useState(() => createImplicitClient())
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [checking, setChecking] = useState(true)
  const [validSession, setValidSession] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function checkRecoverySession() {
      const { data, error: userError } = await supabase.auth.getUser()
      if (!active) return

      setValidSession(Boolean(data.user) && !userError)
      setChecking(false)
    }

    void checkRecoverySession()
    return () => {
      active = false
    }
  }, [supabase])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.')
      return
    }

    if (password !== confirmation) {
      setError('Пароли не совпадают.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError('Не удалось изменить пароль. Запросите новую ссылку восстановления.')
        return
      }

      await supabase.auth.signOut()
      setSuccess(true)
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
          Новый пароль
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Придумайте новый пароль для аккаунта Slotly.
        </p>

        {checking ? (
          <p role="status" className="text-sm text-slate-600">Проверяем ссылку…</p>
        ) : success ? (
          <div className="space-y-5">
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Пароль изменён. Теперь войдите с новым паролем.
            </div>
            <Link href="/login" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors">
              Перейти ко входу
            </Link>
          </div>
        ) : !validSession ? (
          <div className="space-y-5">
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Ссылка недействительна или уже истекла. Запросите новое письмо восстановления.
            </div>
            <Link href="/forgot-password" className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Запросить новую ссылку
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Новый пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmation" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Повторите пароль
              </label>
              <input
                id="confirmation"
                name="confirmation"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97] shadow-md shadow-blue-500/20"
            >
              {loading ? 'Сохраняем…' : 'Сохранить новый пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
