'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bot, LogOut, MessageSquare, Settings, Sparkles, Users } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

const dashboardItems = [
  {
    title: 'Настроить ИИ-консультанта',
    description: 'Добавьте информацию о компании, услугах и частых вопросах.',
    icon: Bot,
  },
  {
    title: 'Подключить виджет',
    description: 'Получите код установки для вашего сайта.',
    icon: MessageSquare,
  },
  {
    title: 'Собранные лиды',
    description: 'Здесь появятся контакты заинтересованных посетителей.',
    icon: Users,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setUser(data.user)
      setLoading(false)
    }

    void loadUser()
  }, [router])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Загружаем личный кабинет…
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm">
              S
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Slotly<span className="text-blue-600">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? 'Выходим…' : 'Выйти'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-10 sm:py-10">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1 text-xs font-bold text-blue-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Личный кабинет
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Добро пожаловать в Slotly
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Ваш аккаунт активен. Начните настройку ИИ-консультанта, чтобы принимать вопросы и заявки с сайта круглосуточно.
              </p>
            </div>
            <p className="rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300">
              Аккаунт: <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="getting-started-title">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Первые шаги</p>
              <h2 id="getting-started-title" className="mt-1 text-2xl font-extrabold tracking-tight">
                Подготовьте виджет к работе
              </h2>
            </div>
            <span className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:inline-flex">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Настройка аккаунта
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardItems.map((item, index) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  <span className="mt-5 inline-block text-xs font-bold text-blue-600">Скоро доступно</span>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
