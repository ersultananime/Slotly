import Link from 'next/link';
import { PRICING } from '@/lib/config';
import ChatWidgetDemo from './components/ChatWidgetDemo';
import FloatingSiteChat from './components/FloatingSiteChat';
import { ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden font-sans">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Перейти к основному содержимому
      </a>

      {/* Ambient background lighting and subtle grid */}
      <div className="fixed inset-0 pointer-events-none z-0 ambient-light" aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none z-0 dot-pattern opacity-40" aria-hidden="true" />

      {/* ===== НАВИГАЦИЯ (Pill Navbar) ===== */}
      <nav 
        aria-label="Главная навигация" 
        className="sticky top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6"
      >
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-200/50 rounded-full py-2.5 px-5 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo.jpeg" 
              alt="Slotly Logo" 
              className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform" 
            />
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Slotly<span className="text-blue-600">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Возможности
            </a>
            <a href="#how" className="hover:text-blue-600 transition-colors">
              Как это работает
            </a>
            <a href="#audience" className="hover:text-blue-600 transition-colors">
              Для кого
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Тариф
            </a>
          </div>

          <a
            href="#pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 ease-out active:scale-95 shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Попробовать бесплатно</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </nav>

      {/* ===== ОСНОВНОЙ КОНТЕНТ ===== */}
      <main id="content" className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <header className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <span>✨</span>
                <span>Умный виджет поддержки и продаж на сайте</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-900 text-balance">
                Умный ИИ-консультант <br className="hidden sm:inline" />
                <span className="text-blue-600">для вашего сайта</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed text-pretty font-normal">
                Установите виджет чата в правом нижнем углу сайта за&nbsp;2&nbsp;минуты. ИИ&#8209;ассистент будет мгновенно отвечать на вопросы клиентов, консультировать по вашим услугам 24/7 и&nbsp;повышать конверсию продаж.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3.5 items-center">
                <a
                  href="#pricing"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 ease-out shadow-md shadow-blue-500/20 active:scale-[0.96] flex items-center gap-2"
                >
                  <span>Установить виджет на сайт</span>
                  <span>🚀</span>
                </a>

                <a
                  href="#demo"
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 ease-out active:scale-[0.96] shadow-xs flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>Протестировать чат</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✅</span>
                  <span>14 дней бесплатно</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>1 строчка кода для установки</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>💳</span>
                  <span>Без привязки карты</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Demo */}
            <div id="demo" className="lg:col-span-5 flex items-center justify-center">
              <ChatWidgetDemo />
            </div>
          </div>
        </header>

        {/* ===== FEATURES BENTO SECTION ===== */}
        <section id="features" className="py-20 border-t border-slate-200 bg-white/60 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                <span>🎯</span>
                <span>Возможности ИИ-виджета</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
                Всё для мгновенной консультации и продаж
              </h2>
              <p className="text-slate-600 text-sm sm:text-base text-pretty">
                Slotly заменяет оператора, консультирует клиентов и собирает контакты лидов прямо в правом нижнем углу вашего сайта.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Feature 1 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    🔌
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Простая интеграция
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Установка на любой сайт (Tilda, WordPress, React, Bitrix или HTML) буквально в 1 строчку кода. Без сложных плагинов.
                  </p>
                </div>
                <div className="mt-5 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto shadow-inner">
                  <code>&lt;script src="https://slotly.kz/widget.js"&gt;&lt;/script&gt;</code>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    📚
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Обучение на вашей базе знаний
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Вы загружаете прайс-лист, FAQ или ссылки на сайт, и ИИ отвечает строго по вашим правилам, ценам и услугам без выдумок.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-600 bg-amber-50/60 border border-amber-100 p-2.5 rounded-lg">
                  <span className="text-amber-600 font-bold">📄</span>
                  <span>Прайсы, регламенты и PDF-файлы</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    🎯
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Сбор контактов (Lead Generation)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Помощник аккуратно запрашивает имя, телефон или Telegram посетителя в ходе естественного диалога для передачи вашей команде.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-600 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-lg">
                  <span className="text-emerald-600 font-bold">📲</span>
                  <span>Моментальные заявки в Telegram / CRM</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    🎨
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Кастомизация внешнего вида
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Настройка цвета виджета, аватарки, приветственного сообщения и позиции на экране под дизайн и стиль вашего сайта.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-600 bg-rose-50/60 border border-rose-100 p-2.5 rounded-lg">
                  <span className="text-rose-600 font-bold">💎</span>
                  <span>Гармонично смотрится на любом сайте</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    🛎️
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Перевод на оператора
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Если вопрос слишком сложный или требует индивидуального решения, ИИ перенаправляет диалог менеджеру в Telegram или CRM.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-600 bg-purple-50/60 border border-purple-100 p-2.5 rounded-lg">
                  <span className="text-purple-600 font-bold">🤝</span>
                  <span>Без потери контекста переписки</span>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                    📈
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Аналитика и конверсия
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Удобная статистика: количество диалогов, собранных лидов, популярные вопросы гостей и время пиковой активности.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-600 bg-cyan-50/60 border border-cyan-100 p-2.5 rounded-lg">
                  <span className="text-cyan-600 font-bold">📊</span>
                  <span>Полный контроль эффективности</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section id="how" className="py-20 border-t border-slate-200 bg-slate-50/50 relative">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                <span>⚡</span>
                <span>Как это работает</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
                Три шага — и ИИ консультирует ваших гостей
              </h2>
              <p className="text-slate-600 text-sm sm:text-base text-pretty">
                Настройка занимает 5 минут прямо в личном кабинете.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="clean-card rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 shadow-sm text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>⚙️</span>
                  <span>Настройте ответы ИИ</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Вы создаете и настраиваете ответы ИИ-помощника под свой бизнес: добавляете прайс, FAQ и условия.
                </p>
              </div>

              {/* Step 2 */}
              <div className="clean-card rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 shadow-sm text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  <span>Скопируйте скрипт</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Копируете короткий скрипт и вставляете его на свой сайт (Tilda, WordPress, React или любой HTML).
                </p>
              </div>

              {/* Step 3 */}
              <div className="clean-card rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center mb-4 shadow-sm text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>🚀</span>
                  <span>ИИ начинает работу</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  В правом нижнем углу появляется иконка чата, и ИИ начинает консультировать ваших гостей и собирать лиды.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TARGET AUDIENCE SECTION ===== */}
        <section id="audience" className="py-20 border-t border-slate-200 bg-white relative">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                <span>👥</span>
                <span>Для кого это</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
                Подходит для любого бизнеса с сайтом
              </h2>
              <p className="text-slate-600 text-sm sm:text-base text-pretty">
                Любая компания, которая общается с клиентами онлайн, увеличивает конверсию со Slotly.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { emoji: '🛍️', title: 'Интернет-магазины', desc: 'Наличие, цены и доставка' },
                { emoji: '💅', title: 'Бьюти-салоны', desc: 'Прайс и запись к мастерам' },
                { emoji: '🩺', title: 'Мед. центры', desc: 'Услуги и запись к врачу' },
                { emoji: '🎓', title: 'Онлайн-курсы', desc: 'Программы и тарифы' },
                { emoji: '🛠️', title: 'Частные мастера', desc: 'Приём заявок от клиентов' },
                { emoji: '🏢', title: 'Сервисные компании', desc: 'Круглосуточная поддержка' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="clean-card rounded-xl p-4 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                    {item.emoji}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section id="pricing" className="py-20 border-t border-slate-200 bg-slate-50/70 relative">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              <span>💎</span>
              <span>Тариф</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
              Один прозрачный тариф. Всё включено.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base text-pretty">
              Первые {PRICING.trialDays} дней бесплатно — протестируйте на реальных клиентах без привязки карты.
            </p>
          </div>

          <div className="max-w-lg mx-auto px-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden text-left">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                    Тариф «Бизнес»
                  </span>
                  <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-slate-900 flex items-baseline gap-2">
                    <span className="tabular-nums font-mono">{PRICING.amount.toLocaleString()}</span> {PRICING.currency}
                    <span className="text-xs text-slate-500 font-normal">/ {PRICING.period}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {PRICING.trialDays} дней триал
                  </span>
                </div>
              </div>

              <div className="py-6 space-y-3">
                {PRICING.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-[10px]" aria-hidden="true">
                      ✓
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="#pricing"
                  aria-label={`Начать бесплатный пробный период на ${PRICING.trialDays} дней`}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-150 ease-out shadow-md shadow-blue-500/25 active:scale-[0.96] block"
                >
                  Начать бесплатный период — {PRICING.trialDays} дней
                </a>
                <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
                  Без привязки карты • Быстрая отмена в любой момент
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA BANNER ===== */}
        <section className="py-20 border-t border-slate-200 bg-white relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-balance">
                Готовы увеличить продажи на сайте? 🚀
              </h2>
              <p className="text-sm sm:text-base text-blue-100 max-w-lg mx-auto text-pretty">
                Установите виджет Slotly за 2 минуты и начинайте получать заявки от посетителей 24/7.
              </p>
              <div className="pt-2 flex justify-center">
                <a
                  href="#pricing"
                  className="bg-white hover:bg-slate-100 text-blue-600 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-150 ease-out shadow-lg active:scale-[0.96] inline-flex items-center gap-2"
                >
                  <span>Установить виджет бесплатно</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== ПОДВАЛ ===== */}
      <footer className="border-t border-slate-200 py-10 relative z-10 bg-[#F1F5F9]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5 font-medium">
            <img 
              src="/logo.jpeg" 
              alt="Slotly Logo" 
              className="w-6 h-6 rounded-md object-contain shadow-2xs" 
            />
            <span className="font-bold text-slate-800">Slotly.kz</span>
            <span>— плавающий ИИ-консультант для вашего сайта</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600 font-medium">
            <a href="#features" className="hover:text-blue-600 transition-colors">Возможности</a>
            <a href="#how" className="hover:text-blue-600 transition-colors">Как это работает</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Тариф</a>
          </div>
        </div>
      </footer>

      {/* Floating live site chat widget */}
      <FloatingSiteChat />
    </div>
  );
}
