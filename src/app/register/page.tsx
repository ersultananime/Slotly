'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Пароли не совпадают.')
      return
    }
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.')
      return
    }

    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) {
        setError(mapAuthError(signUpError.message))
        return
      }

      // Supabase может требовать подтверждение email (зависит от настроек проекта)
      setSuccess(true)
      // Если email confirmation выключена — сразу редирект
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">📧</div>
          <h1 className="text-xl font-bold text-slate-900">Проверьте почту</h1>
          <p className="text-sm text-slate-600">
            Мы отправили письмо на <strong>{email}</strong>. Перейдите по ссылке в письме, чтобы активировать аккаунт.
          </p>
          <Link href="/login" className="text-sm text-blue-600 hover:underline font-medium">
            Вернуться к входу →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <span className="text-white font-extrabold text-sm">S</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Slotly<span className="text-blue-600">.</span>
        </span>
      </Link>

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Создать аккаунт
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            14 дней бесплатно — без карты
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirm" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Повторите пароль
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Повторите пароль"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97] shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Создаём аккаунт…
              </>
            ) : (
              'Создать аккаунт →'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>

      {/* Trust note */}
      <p className="mt-6 text-xs text-slate-400 text-center">
        Нажимая «Создать аккаунт», вы соглашаетесь с условиями использования
      </p>
    </div>
  )
}

// Переводим технические ошибки Supabase в понятные сообщения
function mapAuthError(message: string): string {
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'Этот email уже зарегистрирован. Попробуйте войти.'
  }
  if (message.includes('invalid email')) {
    return 'Некорректный формат email.'
  }
  if (message.includes('password')) {
    return 'Пароль слишком слабый. Используйте буквы и цифры.'
  }
  if (message.includes('rate limit')) {
    return 'Слишком много попыток. Подождите немного и попробуйте снова.'
  }
  return 'Произошла ошибка. Попробуйте ещё раз.'
}
