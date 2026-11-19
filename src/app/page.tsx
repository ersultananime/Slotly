import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Code2,
  FileCheck2,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { PRICING } from '@/lib/config';
import ChatWidgetDemo from './components/ChatWidgetDemo';

const capabilities = [
  {
    icon: FileCheck2,
    title: 'Подготовьте точные ответы',
    text: 'Укажите сайт, проверьте собранную информацию и исправьте цены, контакты или условия до публикации.',
  },
  {
    icon: Code2,
    title: 'Подключите одной строкой',
    text: 'Добавьте готовый JavaScript-код на сайт. Виджет работает отдельно и не требует переделывать страницы.',
  },
  {
    icon: Inbox,
    title: 'Получайте обращения',
    text: 'Если посетителю нужен человек, он может добровольно оставить контакт. Заявка появится в личном кабинете.',
  },
];

const steps = [
  ['01', 'Добавьте сайт', 'Slotly прочитает до пяти публичных страниц и подготовит черновик базы знаний.'],
  ['02', 'Проверьте информацию', 'Вы решаете, какие ответы увидят посетители, и сохраняете только подтверждённый текст.'],
  ['03', 'Установите виджет', 'Скопируйте код на сайт и следите за новыми обращениями в личном кабинете.'],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#18201c]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#18201c]"
      >
        Перейти к основному содержимому
      </a>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur-sm">
        <nav
          aria-label="Главная навигация"
          className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-[-0.02em]">
            <Image src="/logo.jpeg" alt="" width={34} height={34} className="rounded-lg" priority />
            <span className="text-lg">Slotly</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-[#53605a] md:flex">
            <a href="#capabilities" className="transition-colors hover:text-[#18201c]">Возможности</a>
            <a href="#how" className="transition-colors hover:text-[#18201c]">Как работает</a>
            <a href="#pricing" className="transition-colors hover:text-[#18201c]">Тариф</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="hidden px-2 py-2 text-sm font-semibold text-[#53605a] hover:text-[#18201c] sm:inline-flex">
              Войти
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#b9430f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#96360c] motion-safe:active:scale-[0.96]"
            >
              <span className="sm:hidden">Начать</span>
              <span className="hidden sm:inline">Начать бесплатно</span>
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
            </Link>
          </div>
        </nav>
      </header>

      <main id="content">
        <section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-center lg:py-24">
          <div className="min-w-0">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.08em] text-[#a13a0c]">
              ИИ-консультант для сайта
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-balance sm:text-5xl lg:text-[3.75rem]">
              Отвечайте посетителям, даже когда вы офлайн
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-7 text-[#53605a] text-pretty sm:text-lg sm:leading-8">
              Slotly изучает информацию о компании, отвечает на вопросы и сохраняет контакты заинтересованных клиентов. Вы проверяете каждый ответ до запуска.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#b9430f] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#96360c] motion-safe:active:scale-[0.96]"
              >
                Создать консультанта
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </Link>
              <a href="#demo" className="inline-flex min-h-12 items-center border-b border-[#18201c] px-1 text-sm font-semibold text-[#18201c] hover:border-[#b9430f] hover:text-[#a13a0c]">
                Проверить демо
              </a>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-1 gap-5 border-t border-black/10 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-[#6b756f]">Подготовка</dt>
                <dd className="mt-1 font-semibold">до 5 страниц</dd>
              </div>
              <div>
                <dt className="text-sm text-[#6b756f]">Установка</dt>
                <dd className="mt-1 font-semibold">1 строка кода</dd>
              </div>
              <div>
                <dt className="text-sm text-[#6b756f]">Доступ</dt>
                <dd className="mt-1 font-semibold">14 дней бесплатно</dd>
              </div>
            </dl>
          </div>

          <div id="demo" className="min-w-0 scroll-mt-24">
            <ChatWidgetDemo />
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-20 border-y border-black/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#a13a0c]">Что делает Slotly</p>
              <h2 className="mt-4 max-w-md text-3xl font-bold leading-[1.16] tracking-[-0.03em] text-balance sm:text-4xl">
                Один консультант вместо набора разрозненных форм
              </h2>
              <p className="mt-5 max-w-[54ch] leading-7 text-[#5f6a64] text-pretty">
                Посетитель получает ответ в том же окне, а вам остаётся только обработать обращения, которым действительно нужен человек.
              </p>
            </div>

            <div className="divide-y divide-black/10 border-t border-black/10">
              {capabilities.map(({ icon: Icon, title, text }) => (
                <article key={title} className="grid gap-4 py-7 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[#f8e6dc] text-[#a13a0c]">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{title}</h3>
                    <p className="mt-2 max-w-[62ch] leading-7 text-[#5f6a64] text-pretty">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 bg-[#1d2722] text-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#f2a071]">Запуск без сложной настройки</p>
                <h2 className="mt-4 text-3xl font-bold leading-[1.16] tracking-[-0.03em] text-balance sm:text-4xl">От ссылки до первого ответа</h2>
              </div>
              <p className="max-w-[64ch] leading-7 text-[#bec8c2] lg:justify-self-end">
                Информация не публикуется автоматически. Сначала вы проверяете текст, затем устанавливаете виджет и только после этого принимаете обращения.
              </p>
            </div>

            <ol className="mt-12 grid border-t border-white/20 lg:grid-cols-3">
              {steps.map(([number, title, text], index) => (
                <li key={number} className={'py-8 lg:px-7 ' + (index > 0 ? 'border-t border-white/20 lg:border-s lg:border-t-0' : 'lg:ps-0')}>
                  <span className="font-mono text-sm text-[#f2a071]">{number}</span>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-3 leading-7 text-[#bec8c2] text-pretty">{text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 overflow-x-auto rounded-lg border border-white/15 bg-black/20 p-5 font-mono text-sm leading-7 text-[#d9e1dc]">
              <code className="whitespace-nowrap">&lt;script src=&quot;https://slotly-inky.vercel.app/widget.js&quot; data-company-id=&quot;...&quot;&gt;&lt;/script&gt;</code>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <ShieldCheck aria-hidden="true" className="size-8 text-[#a13a0c]" strokeWidth={1.8} />
              <h2 className="mt-6 max-w-lg text-3xl font-bold leading-[1.16] tracking-[-0.03em] text-balance sm:text-4xl">
                Консультант не придумывает условия компании
              </h2>
              <p className="mt-5 max-w-[62ch] leading-7 text-[#5f6a64] text-pretty">
                Если ответа нет в базе знаний, Slotly честно сообщает об этом и предлагает посетителю оставить контакт. Цены и обещания не подставляются автоматически.
              </p>
            </div>

            <div className="border-s-2 border-[#b9430f] ps-6 sm:ps-8">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#a13a0c]">Подходит для</p>
              <p className="mt-4 text-xl leading-8 text-[#28332d] text-pretty">
                Сервисных компаний, агентств, онлайн-школ, клиник и небольших команд, которым важно быстро ответить на типовой вопрос и не потерять обращение.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#a13a0c]">Тариф после бета-теста</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                <span className="tabular-nums">{PRICING.amount.toLocaleString('ru-RU')}</span> {PRICING.currency}
                <span className="block text-lg font-medium tracking-normal text-[#68736d]">в месяц</span>
              </h2>
              <p className="mt-6 max-w-md leading-7 text-[#5f6a64]">
                Первые {PRICING.trialDays} дней бесплатно. Карта для начала теста не требуется.
              </p>
            </div>

            <div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {PRICING.features.map((feature) => (
                  <li key={feature} className="flex gap-3 leading-6 text-[#354039]">
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#a13a0c]" strokeWidth={2.5} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#b9430f] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#96360c] motion-safe:active:scale-[0.96]"
              >
                Начать бесплатный тест
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-[#ece8df]">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <div>
              <h2 className="max-w-2xl text-3xl font-bold leading-[1.16] tracking-[-0.03em] text-balance sm:text-4xl">
                Проверьте Slotly на своём сайте
              </h2>
              <p className="mt-3 text-[#5f6a64]">Создайте консультанта, задайте ему реальные вопросы и решите, подходит ли он вашей команде.</p>
            </div>
            <Link
              href="/register"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18201c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2b3731] motion-safe:active:scale-[0.96]"
            >
              Создать консультанта
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-[#f7f5f0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#68736d] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5 text-[#28332d]">
            <Image src="/logo.jpeg" alt="" width={28} height={28} className="rounded-md" />
            <span className="font-semibold">Slotly</span>
          </div>
          <p>ИИ-консультант для ответов и обращений с сайта.</p>
          <p>© 2026 Slotly</p>
        </div>
      </footer>
    </div>
  );
}
