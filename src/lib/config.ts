/** Site-wide configuration. Single source of truth for brand, pricing, and defaults. */

export const BRAND_NAME = 'Slotly';
export const BRAND_DOMAIN = 'slotly.kz';
export const BRAND_TAGLINE = 'Умный ИИ-консультант для вашего сайта';

export const DEFAULT_CITY = 'Алматы';
export const DEFAULT_TIMEZONE = 'Asia/Almaty';
export const DEFAULT_CURRENCY = '₸';
export const DEFAULT_LOCALE = 'ru';

export const PRICING = {
  amount: 4_900,
  currency: '₸',
  period: 'месяц' as const,
  trialDays: 14,
  features: [
    'Анализ до пяти публичных страниц сайта',
    'Ответы ИИ по проверенной базе знаний',
    'Форма добровольной заявки внутри виджета',
    'Сохранение заявок в личном кабинете',
    'Установка внешним JavaScript-кодом',
  ],
};

export const CONTACTS = {
  whatsapp: '+7 (700) 000-00-00',
  email: 'hello@slotly.kz',
  telegram: '@slotly_support',
};
