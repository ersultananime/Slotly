/** Site-wide configuration. Single source of truth for brand, pricing, and defaults. */

export const BRAND_NAME = 'Slotly';
export const BRAND_DOMAIN = 'slotly.kz';
export const BRAND_TAGLINE = 'Онлайн-запись к лучшим мастерам красоты';

export const DEFAULT_CITY = 'Алматы';
export const DEFAULT_TIMEZONE = 'Asia/Almaty';
export const DEFAULT_CURRENCY = '₸';
export const DEFAULT_LOCALE = 'ru';

export const PRICING = {
  amount: 3_900,
  currency: '₸',
  period: 'месяц' as const,
  trialDays: 30,
  features: [
    'Безлимитная запись клиентов',
    'Напоминания в WhatsApp вам и клиенту',
    'Учёт дохода по месяцам и услугам',
    'Персональная страница записи',
    'ИИ-бот для автоматических ответов',
  ],
};

export const SLOT_GRID_STEP_MINUTES = 30;
export const MIN_ADVANCE_MINUTES = 60;
export const MAX_ADVANCE_DAYS = 14;

export const CONTACTS = {
  whatsapp: '+7 (700) 000-00-00',
  email: 'hello@slotly.kz',
  instagram: '@slotly.kz',
};
