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
    'Безлимитные диалоги с посетителями 24/7',
    'Обучение ИИ на вашей базе знаний и прайсе',
    'Сбор контактов и лидов в Telegram / CRM',
    'Кастомизация дизайна виджета',
    'Перевод на оператора при сложных вопросах',
    'Аналитика диалогов и конверсий',
    'Установка на любой сайт за 2 минуты',
  ],
};

export const CONTACTS = {
  whatsapp: '+7 (700) 000-00-00',
  email: 'hello@slotly.kz',
  telegram: '@slotly_support',
};
