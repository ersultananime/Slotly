'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bot, CheckCircle2, CircleUserRound, LayoutDashboard, LogOut, MessageSquare, Rocket, Sparkles, Users } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

const dashboardItems = [
  {
    title: 'Настроить ИИ-консультанта',
    description: 'Добавьте информацию о компании, услугах и частых вопросах.',
    icon: Bot,
    status: 'Начните здесь',
  },
  {
    title: 'Подключить виджет',
    description: 'Получите код установки для вашего сайта.',
    icon: MessageSquare,
    status: 'После настройки',
  },
  {
    title: 'Собранные лиды',
    description: 'Здесь появятся контакты заинтересованных посетителей.',
    icon: Users,
    status: 'После запуска',
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
          <span className="h-5 w-5 motion-safe:animate-spin rounded-full border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
          Загружаем личный кабинет…
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <a href="#dashboard-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white">
        Перейти к содержимому
      </a>

      <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:min-h-screen lg:flex-col" aria-label="Навигация личного кабинета">
        <div className="px-5 py-5">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm">
              S
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Slotly<span className="text-blue-600">.</span>
            </span>
          </Link>

          <p className="mt-8 px-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Рабочее пространство</p>
          <nav className="mt-3 space-y-1" aria-label="Разделы кабинета">
            <a href="#overview" aria-current="page" className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Обзор
            </a>
            <a href="#quick-start" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Быстрый старт
            </a>
            <a href="#account" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <CircleUserRound className="h-4 w-4" aria-hidden="true" />
              Аккаунт
            </a>
          </nav>
        </div>

        <div id="account" className="mt-auto border-t border-slate-100 p-5">
          <p className="break-words text-xs font-semibold text-slate-500">{user?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? 'Выходим…' : 'Выйти'}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5 rounded-lg">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white">S</span>
              <span className="text-lg font-extrabold tracking-tight">Slotly<span className="text-blue-600">.</span></span>
            </Link>
            <button type="button" onClick={handleSignOut} disabled={signingOut} aria-label="Выйти из аккаунта" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3" aria-label="Разделы кабинета">
            <a href="#overview" aria-current="page" className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">Обзор</a>
            <a href="#quick-start" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600">Быстрый старт</a>
            <a href="#mobile-account" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600">Аккаунт</a>
          </nav>
        </header>

        <main id="dashboard-content" className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <section id="overview" className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-10 sm:py-10">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1 text-xs font-bold text-blue-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Личный кабинет
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Настройте консультанта и запустите его на сайте
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Пройдите три шага ниже. Мы покажем, что делать сейчас и что станет доступно после запуска.
              </p>
            </div>
            <a href="#quick-start" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500 motion-safe:active:scale-[0.96] focus-visible:outline-white">
              Начать настройку
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="quick-start" className="mt-10 scroll-mt-32 lg:scroll-mt-8" aria-labelledby="getting-started-title">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-600">Быстрый старт</p>
              <h2 id="getting-started-title" className="mt-1 text-2xl font-extrabold tracking-tight">
                Подготовьте виджет к работе
              </h2>
            </div>
            <span className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 sm:inline-flex">
              <CheckCircle2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
              0 из 3 шагов
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardItems.map((item, index) => {
              const Icon = item.icon

              return (
                <article key={item.title} className={`rounded-2xl border bg-white p-6 shadow-sm ${index === 0 ? 'border-blue-300 ring-4 ring-blue-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-slate-400">Шаг {index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  <span className={`mt-5 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${index === 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{item.status}</span>
                </article>
              )
            })}
          </div>
        </section>

        <section id="mobile-account" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 lg:hidden" aria-labelledby="account-title">
          <h2 id="account-title" className="text-base font-bold">Аккаунт</h2>
          <p className="mt-1 break-words text-sm text-slate-500">{user?.email}</p>
          <button type="button" onClick={handleSignOut} disabled={signingOut} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? 'Выходим…' : 'Выйти из аккаунта'}
          </button>
        </section>
        </main>
      </div>
    </div>
  )
}
