'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { categories, masters, districts } from '@/lib/mock/data';
import type { Category, Master } from '@/lib/mock/types';

// Предустановленные фоновые фото и градиенты для карточек в стиле Яндекс.Еды
const CARD_COVER_STYLES: Record<string, { bgGradient: string; emoji: string; accentColor: string }> = {
  'salony-krasoty': {
    bgGradient: 'from-[#3A2624] via-[#634139] to-[#8C5D52]',
    emoji: '✨',
    accentColor: '#E2704F',
  },
  'manikyur-pedikyur': {
    bgGradient: 'from-[#2B1B1E] via-[#5C323B] to-[#914D5D]',
    emoji: '💅',
    accentColor: '#E2704F',
  },
  'barbershopy': {
    bgGradient: 'from-[#171A21] via-[#2D3341] to-[#4A5568]',
    emoji: '✂️',
    accentColor: '#D9BD93',
  },
  'brovi-resnitsy': {
    bgGradient: 'from-[#1D2924] via-[#2F453B] to-[#476B5B]',
    emoji: '👁️',
    accentColor: '#476B5B',
  },
  'tatu-pirsing': {
    bgGradient: 'from-[#1A1A1A] via-[#332226] to-[#592B35]',
    emoji: '🖋️',
    accentColor: '#C4552F',
  },
  'vizazhisty': {
    bgGradient: 'from-[#331C24] via-[#6E3547] to-[#A85870]',
    emoji: '💄',
    accentColor: '#E2704F',
  },
  'parikmakhery': {
    bgGradient: 'from-[#232029] via-[#433B54] to-[#685D80]',
    emoji: '💇‍♀️',
    accentColor: '#D9BD93',
  },
  'kosmetologiya': {
    bgGradient: 'from-[#192A2C] via-[#2B4B4F] to-[#43757A]',
    emoji: '🧴',
    accentColor: '#43757A',
  },
  'massazh': {
    bgGradient: 'from-[#2D241C] via-[#5C4533] to-[#8C6B4F]',
    emoji: '💆‍♀️',
    accentColor: '#D9BD93',
  },
};

export default function CatalogSection() {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Фильтрация мастеров
  const filteredMasters = useMemo(() => {
    return masters.filter((m) => {
      const matchCategory =
        activeCategorySlug === 'all' || m.categorySlug === activeCategorySlug;
      const matchDistrict =
        selectedDistrict === 'all' || m.district === selectedDistrict;
      const matchQuery =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.services.some((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchDistrict && matchQuery;
    });
  }, [activeCategorySlug, selectedDistrict, searchQuery]);

  return (
    <section id="catalog" className="py-12 sm:py-16 bg-[#F8F5F2] border-t border-[#E7DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[#C4552F] text-xs font-bold tracking-wider uppercase mb-1">
              Онлайн-каталог мастеров • Алматы
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#211B1C]">
              Выберите мастера и запишитесь
            </h2>
            <p className="text-[#5B5254] mt-1 text-sm sm:text-base">
              Свободные окна в реальном времени, актуальные цены и честные отзывы
            </p>
          </div>

          <div className="text-xs text-[#5B5254] bg-white px-3 py-1.5 rounded-full border border-[#E7DBD0] self-start md:self-auto flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E5546] animate-pulse"></span>
            Найдено мастеров: <strong className="text-[#211B1C]">{filteredMasters.length}</strong>
          </div>
        </div>

        {/* 1. Поисковая строка и фильтр по районам в стиле Яндекс.Еды */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E7DBD0] shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center">
          {/* Поле поиска */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B5254]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти мастера, услугу (маникюр, стрижка, массаж)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#FBF4EF] border border-transparent focus:border-[#E2704F] focus:bg-white text-sm outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#5B5254] hover:text-[#211B1C]"
              >
                Очистить
              </button>
            )}
          </div>

          {/* Фильтр по району */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-[#5B5254] whitespace-nowrap hidden sm:inline">
              Район:
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-52 py-2.5 px-3.5 rounded-xl bg-[#FBF4EF] border border-[#E7DBD0] text-sm text-[#211B1C] font-medium outline-none focus:border-[#E2704F]"
            >
              <option value="all">Все районы Алматы</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Горизонтальная лента категорий (Яндекс.Еда style с чипсами и иконками) */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none flex gap-2.5">
          <button
            onClick={() => setActiveCategorySlug('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs ${
              activeCategorySlug === 'all'
                ? 'bg-[#211B1C] text-white shadow-sm'
                : 'bg-white text-[#5B5254] border border-[#E7DBD0] hover:border-[#211B1C] hover:text-[#211B1C]'
            }`}
          >
            <span>✨</span>
            Все категории
          </button>

          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            const style = CARD_COVER_STYLES[cat.slug] || { emoji: '✨' };
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs ${
                  isActive
                    ? 'bg-[#E2704F] text-white shadow-sm ring-2 ring-[#E2704F]/20'
                    : 'bg-white text-[#5B5254] border border-[#E7DBD0] hover:border-[#E2704F] hover:text-[#211B1C]'
                }`}
              >
                <span>{style.emoji}</span>
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 3. Сетка карточек мастеров в стиле Яндекс.Еды (баннер + бейджи + инфо) */}
        {filteredMasters.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E7DBD0] max-w-md mx-auto my-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-serif text-xl font-medium mb-1">Ничего не найдено</h3>
            <p className="text-sm text-[#5B5254] mb-6">
              Попробуйте сбросить поисковый запрос или выбрать другую категорию
            </p>
            <button
              onClick={() => {
                setActiveCategorySlug('all');
                setSelectedDistrict('all');
                setSearchQuery('');
              }}
              className="bg-[#211B1C] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-black"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMasters.map((m) => {
              const style = CARD_COVER_STYLES[m.categorySlug] || {
                bgGradient: 'from-[#2B1B1E] to-[#634139]',
                emoji: '✨',
                accentColor: '#E2704F',
              };

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-[#E7DBD0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Верхний баннер-картинка (как карточка ресторана в Яндекс.Еде) */}
                  <div
                    className={`relative h-44 bg-gradient-to-tr ${style.bgGradient} p-4 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Декоративный бэкграунд-узор */}
                    <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none flex items-center justify-center text-8xl font-serif">
                      {style.emoji}
                    </div>

                    {/* Верхние бейджи: Ближайшее время записи и Район */}
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      {m.nearestSlot ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#2E5546] shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E5546] animate-pulse"></span>
                          {m.nearestSlot}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-medium text-white/90">
                          Запись открыта
                        </span>
                      )}

                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-[11px] font-medium text-white shadow-xs">
                        {m.district}
                      </span>
                    </div>

                    {/* Нижняя часть баннера: аватарка с инициалами и бейдж цены */}
                    <div className="relative z-10 flex items-end justify-between mt-auto">
                      <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg transform group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#E2704F] to-[#D9BD93] flex items-center justify-center font-serif text-lg font-bold text-white shadow-inner">
                          {m.avatar.initials}
                        </div>
                      </div>

                      <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md text-right">
                        <div className="text-[10px] text-[#5B5254] uppercase font-bold tracking-wider leading-none">
                          от
                        </div>
                        <div className="font-serif text-sm font-bold text-[#211B1C] leading-tight">
                          {m.minPrice.toLocaleString()} ₸
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Основное тело карточки */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Заголовок и рейтинг */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-lg font-semibold text-[#211B1C] group-hover:text-[#E2704F] transition-colors line-clamp-1">
                        {m.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-[#FFF9EE] border border-[#F3E3C3] px-2 py-0.5 rounded-lg text-xs font-bold text-[#9C6D15] shrink-0">
                        <span>★</span>
                        <span>{m.rating}</span>
                        <span className="text-[10px] text-[#A67B2E] font-normal">
                          ({m.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Специализация */}
                    <p className="text-xs text-[#5B5254] line-clamp-1 mb-3">
                      {m.specialization}
                    </p>

                    {/* Список популярных услуг мастера (2-3 штуки) */}
                    <div className="space-y-1.5 mb-4 flex-1">
                      {m.services.slice(0, 2).map((srv) => (
                        <div
                          key={srv.id}
                          className="flex justify-between items-center text-xs py-1 border-b border-[#F5EDE6] last:border-0"
                        >
                          <span className="text-[#5B5254] truncate max-w-[170px]">
                            {srv.name}
                          </span>
                          <span className="font-semibold text-[#211B1C] shrink-0">
                            {srv.price.toLocaleString()} ₸
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Кнопка мгновенной записи */}
                    <Link
                      href={`/book/${m.slug}`}
                      className="w-full py-2.5 rounded-2xl bg-[#FBF4EF] hover:bg-[#E2704F] text-[#211B1C] hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#E7DBD0] hover:border-transparent active:scale-98 shadow-xs"
                    >
                      <span>Записаться</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
