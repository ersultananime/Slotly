import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { PRICING } from '@/lib/config';

async function CategoriesList() {
  let categories: { id: string; slug: string; name: string; icon: string; gradient: string }[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load categories from DB:', error);
  }

  if (categories.length === 0) {
    return (
      <div className="col-span-full text-center text-sm text-[#5B5254] py-8">
        Категории загружаются...
      </div>
    );
  }

  return (
    <>
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="p-5 rounded-2xl border border-[#E7DBD0] bg-[#FBF4EF]/50 hover:bg-[#FBF4EF] hover:border-[#E2704F] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#E2704F] group-hover:scale-110 transition-transform mb-3">
            ✨
          </div>
          <div className="font-medium text-sm text-[#211B1C]">{cat.name}</div>
        </div>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBF4EF] text-[#211B1C]">
      {/* ===== НАВИГАЦИЯ ===== */}
      <nav className="border-b border-[#E7DBD0] py-6 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-tight flex items-center gap-3">
            <img src="/logo.jpeg" alt="Slotly Logo" className="w-11 h-11 object-contain rounded-xl shadow-sm" />
            slotly
          </Link>

          <div className="hidden md:flex gap-8 text-[15px] text-[#5B5254] font-medium">
            <a href="#categories" className="hover:text-[#211B1C] transition-colors">Категории</a>
            <a href="#pain" className="hover:text-[#211B1C] transition-colors">Проблема</a>
            <a href="#how" className="hover:text-[#211B1C] transition-colors">Как это работает</a>
            <a href="#pricing" className="hover:text-[#211B1C] transition-colors">Тариф</a>
          </div>

          <Link
            href="/book/aigerim-nurlanova"
            className="bg-[#211B1C] hover:bg-black text-[#FBF4EF] px-5 py-2.5 rounded-full text-sm font-medium transition-transform active:scale-95 shadow-sm"
          >
            Демо записи →
          </Link>
        </div>
      </nav>

      {/* ===== ГЛАВНЫЙ ЭКРАН (HERO) ===== */}
      <header className="max-w-6xl mx-auto px-6 sm:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <div className="text-[#C4552F] text-sm font-semibold tracking-wide uppercase mb-4">
            Для бьюти-мастеров Казахстана
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] tracking-tight">
            Запись к вам, <em className="italic text-[#C4552F]">без</em> переписки в Direct
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#5B5254] max-w-xl leading-relaxed">
            Отправьте клиенту одну ссылку — он сам выберет свободное окно. Вы получите подтверждение в WhatsApp и забудете о накладках.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link
              href="/book/aigerim-nurlanova"
              className="bg-[#E2704F] hover:bg-[#C4552F] text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all shadow-md active:scale-95"
            >
              Открыть страницу записи
            </Link>
            <a
              href="#how"
              className="px-4 py-3 text-[#211B1C] font-medium text-base border-b border-[#211B1C] hover:opacity-75 transition-opacity"
            >
              Как это работает
            </a>
          </div>
        </div>

        {/* Интерактивные карточки расписания */}
        <div className="md:col-span-5 relative h-80 sm:h-96 flex items-center justify-center">
          <div className="absolute w-64 bg-white rounded-2xl p-5 border border-[#E7DBD0] shadow-xl transform -rotate-6 top-4 left-6 z-10 transition-transform hover:rotate-0">
            <div className="font-serif text-2xl font-medium">15:00</div>
            <div className="text-xs text-[#5B5254] mt-1">Маникюр с покрытием гель-лак</div>
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-[#2E5546] bg-[#E8F0EA] px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E5546]" />
              Подтверждено
            </div>
          </div>

          <div className="absolute w-64 bg-[#2E5546] text-white rounded-2xl p-5 shadow-2xl transform rotate-3 top-24 right-4 z-20 transition-transform hover:rotate-0">
            <div className="font-serif text-2xl font-medium">17:30</div>
            <div className="text-xs text-white/80 mt-1">Сложное окрашивание</div>
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-[#C9E6D6] bg-white/10 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9E6D6]" />
              Занято через WhatsApp
            </div>
          </div>

          <div className="absolute w-64 bg-white rounded-2xl p-5 border border-[#E7DBD0] shadow-lg transform -rotate-2 bottom-4 left-12 z-30 transition-transform hover:rotate-0">
            <div className="font-serif text-2xl font-medium text-[#E2704F]">19:00</div>
            <div className="text-xs text-[#5B5254] mt-1">Свободное окно</div>
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-[#5B5254] bg-[#FBF4EF] px-3 py-1 rounded-full">
              Готово к записи
            </div>
          </div>
        </div>
      </header>

      {/* ===== КАТЕГОРИИ ИЗ SUPABASE ===== */}
      <section id="categories" className="py-16 bg-[#FFFFFF] border-y border-[#E7DBD0]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-medium">Категории услуг</h2>
            <p className="text-[#5B5254] mt-2 text-sm sm:text-base">
              Мастера всех направлений красоты Алматы и Казахстана
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Suspense
              fallback={
                <div className="col-span-full text-center text-sm text-[#5B5254] py-8">
                  Загрузка категорий...
                </div>
              }
            >
              <CategoriesList />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ===== БЛОК "КАК ЭТО РАБОТАЕТ" ===== */}
      <section id="how" className="py-20 max-w-6xl mx-auto px-6 sm:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
            Три шага — и клиенты записываются сами
          </h2>
          <p className="text-[#5B5254] mt-3">
            Настройка занимает меньше 5 минут прямо со смартфона.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E7DBD0] shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C4552F] mb-3">Шаг 1</div>
            <h3 className="font-serif text-xl font-medium mb-2">Настройте услуги и часы</h3>
            <p className="text-sm text-[#5B5254] leading-relaxed">
              Укажите рабочие дни, цены в тенге и длительность процедур один раз.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E7DBD0] shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C4552F] mb-3">Шаг 2</div>
            <h3 className="font-serif text-xl font-medium mb-2">Ссылка в Instagram</h3>
            <p className="text-sm text-[#5B5254] leading-relaxed">
              Поставьте ссылку <span className="font-mono text-xs bg-[#FBF4EF] px-1 py-0.5 rounded">slotly.kz/ваше_имя</span> в шапку профиля вместо «запись в директ».
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E7DBD0] shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C4552F] mb-3">Шаг 3</div>
            <h3 className="font-serif text-xl font-medium mb-2">Запись и WhatsApp</h3>
            <p className="text-sm text-[#5B5254] leading-relaxed">
              Клиент сам кликает в окошко, а бот отправляет уведомление и напоминание за день до визита.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ТАРИФ ===== */}
      <section id="pricing" className="py-16 bg-white border-t border-[#E7DBD0]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">
            Один понятный тариф
          </h2>
          <p className="text-[#5B5254] mb-10 text-sm sm:text-base">
            Первые {PRICING.trialDays} дней бесплатно — попробуйте без привязки карты
          </p>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#FBF4EF] border border-[#E7DBD0] max-w-xl mx-auto shadow-sm text-left">
            <div className="font-serif text-4xl sm:text-5xl font-medium text-[#211B1C]">
              {PRICING.amount.toLocaleString()} {PRICING.currency}
              <span className="text-lg text-[#5B5254] font-sans font-normal"> / {PRICING.period}</span>
            </div>

            <div className="mt-8 space-y-3.5">
              {PRICING.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-[#211B1C]">
                  <span className="w-5 h-5 rounded-full bg-[#2E5546] text-white flex items-center justify-center text-xs">✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/book/aigerim-nurlanova"
              className="mt-8 block text-center bg-[#E2704F] hover:bg-[#C4552F] text-white py-3.5 rounded-full font-semibold transition-colors shadow-md"
            >
              Начать бесплатный пробный период
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ПОДВАЛ ===== */}
      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B5254] border-t border-[#E7DBD0]">
        <div className="font-serif text-base font-semibold text-[#211B1C] flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Slotly Logo" className="w-8 h-8 object-contain rounded-lg" />
          Slotly.kz
        </div>
        <div>Платформа онлайн-записи мастеров в Казахстане</div>
      </footer>
    </div>
  );
}
