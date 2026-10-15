'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRICING } from '@/lib/config';

export default function RegisterMasterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'salony-krasoty',
    specialization: '',
    city: 'Алматы',
    district: 'Бостандыкский',
    instagram: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF4EF] text-[#211B1C] flex flex-col">
      {/* Навигация */}
      <nav className="border-b border-[#E7DBD0] py-5 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-tight flex items-center gap-3">
            <img src="/logo.jpeg" alt="Slotly Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm" />
            slotly
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#5B5254] hover:text-[#211B1C] flex items-center gap-1"
          >
            ← На главную
          </Link>
        </div>
      </nav>

      {/* Контент формы */}
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 sm:py-16 w-full">
        <div className="bg-white rounded-3xl border border-[#E7DBD0] p-8 sm:p-12 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#E8F0EA] text-[#2E5546] rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
                ✓
              </div>
              <h1 className="font-serif text-3xl font-medium">Добро пожаловать в Slotly!</h1>
              <p className="text-[#5B5254] mt-3 text-base leading-relaxed max-w-md mx-auto">
                {formData.name}, ваш профиль мастера успешно зарегистрирован. Мы активировали бесплатный пробный период на {PRICING.trialDays} дней.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-[#FBF4EF] border border-[#E7DBD0] text-left text-sm space-y-2.5 max-w-md mx-auto">
                <div><span className="text-[#5B5254]">Ваша ссылка для клиентов:</span> <strong className="font-mono text-xs bg-white px-2 py-1 rounded border border-[#E7DBD0]">slotly.kz/book/{formData.name.toLowerCase().replace(/\s+/g, '-') || 'master'}</strong></div>
                <div><span className="text-[#5B5254]">Город / Район:</span> {formData.city}, {formData.district}</div>
                <div><span className="text-[#5B5254]">Телефон:</span> {formData.phone}</div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="bg-[#E2704F] hover:bg-[#C4552F] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md"
                >
                  Перейти в панель мастера
                </Link>
                <Link
                  href="/"
                  className="bg-white hover:bg-[#FBF4EF] text-[#211B1C] border border-[#E7DBD0] px-6 py-3.5 rounded-full font-medium text-sm transition-all"
                >
                  Вернуться на сайт
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C4552F] bg-[#FFF2ED] px-3 py-1 rounded-full mb-3">
                  Бесплатно {PRICING.trialDays} дней • Без карты
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-medium">Регистрация для мастеров</h1>
                <p className="text-[#5B5254] mt-2 text-sm sm:text-base">
                  Начните принимать онлайн-записи за 3 минуты и забудьте о рутине в WhatsApp
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                    Ваше имя или название студии *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Например: Алина Садвакасова"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                      Номер WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+7 (705) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                      Instagram (аккаунт)
                    </label>
                    <input
                      type="text"
                      placeholder="@beauty_master"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                      Основная категория *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F] bg-white"
                    >
                      <option value="salony-krasoty">Салоны красоты</option>
                      <option value="manikyur-pedikyur">Маникюр и педикюр</option>
                      <option value="barbershopy">Барбершопы</option>
                      <option value="brovi-resnitsy">Брови и ресницы</option>
                      <option value="vizazhisty">Визажисты</option>
                      <option value="parikmakhery">Парикмахеры</option>
                      <option value="kosmetologiya">Косметология</option>
                      <option value="massazh">Массаж</option>
                      <option value="tatu-pirsing">Тату и пирсинг</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                      Район города *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F] bg-white"
                    >
                      <option value="Бостандыкский">Бостандыкский</option>
                      <option value="Медеуский">Медеуский</option>
                      <option value="Алмалинский">Алмалинский</option>
                      <option value="Ауэзовский">Ауэзовский</option>
                      <option value="Наурызбайский">Наурызбайский</option>
                      <option value="Алатауский">Алатауский</option>
                      <option value="Жетысуский">Жетысуский</option>
                      <option value="Турксибский">Турксибский</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-2">
                    Специализация и ключевые услуги
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Аппаратный маникюр, гель-лак, френч"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF4EF] border border-[#E7DBD0] text-xs text-[#5B5254] space-y-1">
                  <div className="font-semibold text-[#211B1C]">Что входит в тариф:</div>
                  <div>• {PRICING.features.join(' • ')}</div>
                  <div className="pt-1 text-[#2E5546] font-medium">После пробного периода: {PRICING.amount.toLocaleString()} ₸ / месяц</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#E2704F] hover:bg-[#C4552F] text-white font-semibold text-base transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Зарегистрироваться бесплатно
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
