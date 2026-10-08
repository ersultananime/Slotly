import type { Category, Master, Review, Service, TimeSlot } from './types';

/* ============================================================
   CATEGORIES
   ============================================================ */
export const categories: Category[] = [
  { id: 'cat-1',  slug: 'salony-krasoty',     name: 'Салоны красоты',       icon: 'Sparkles',    masterCount: 3, gradient: 'from-coral to-coral-deep' },
  { id: 'cat-2',  slug: 'manikyur-pedikyur',  name: 'Маникюр и педикюр',    icon: 'Hand',        masterCount: 3, gradient: 'from-coral to-sand' },
  { id: 'cat-3',  slug: 'barbershopy',        name: 'Барбершопы',           icon: 'Scissors',    masterCount: 2, gradient: 'from-ink to-ink-soft' },
  { id: 'cat-4',  slug: 'brovi-resnitsy',     name: 'Брови и ресницы',      icon: 'Eye',         masterCount: 2, gradient: 'from-pine to-pine-soft' },
  { id: 'cat-5',  slug: 'tatu-pirsing',       name: 'Тату и пирсинг',      icon: 'PenTool',     masterCount: 2, gradient: 'from-ink to-coral-deep' },
  { id: 'cat-6',  slug: 'vizazhisty',         name: 'Визажисты',            icon: 'Palette',     masterCount: 2, gradient: 'from-sand to-coral' },
  { id: 'cat-7',  slug: 'parikmakhery',       name: 'Парикмахеры',          icon: 'Scissors',    masterCount: 2, gradient: 'from-pine to-ink' },
  { id: 'cat-8',  slug: 'kosmetologiya',      name: 'Косметология',         icon: 'Droplets',    masterCount: 2, gradient: 'from-coral to-pine' },
  { id: 'cat-9',  slug: 'massazh',            name: 'Массаж',               icon: 'Heart',       masterCount: 2, gradient: 'from-sand to-pine' },
];

/* ============================================================
   MASTERS (20)
   ============================================================ */
export const masters: Master[] = [
  // ── Салоны красоты ──
  {
    id: 'm-1', slug: 'aigerim-nurlanova', name: 'Айгерим Нурланова',
    specialization: 'Маникюр · педикюр · наращивание',
    categorySlug: 'salony-krasoty', district: 'Бостандыкский', rating: 4.9, reviewCount: 127, minPrice: 7000,
    avatar: { initials: 'АН', gradient: 'from-coral to-sand' },
    nearestSlot: 'Сегодня, 15:00', bio: 'Мастер маникюра с 8-летним опытом. Сертифицированный мастер LUXIO и CND.',
    services: [
      { id: 's-1-1', name: 'Маникюр с покрытием гель-лак', durationMinutes: 90, price: 8000 },
      { id: 's-1-2', name: 'Педикюр классический', durationMinutes: 60, price: 7000 },
      { id: 's-1-3', name: 'Наращивание ногтей', durationMinutes: 150, price: 14000 },
      { id: 's-1-4', name: 'Снятие + маникюр', durationMinutes: 120, price: 9000 },
    ],
    reviews: [
      { id: 'r-1-1', clientName: 'Дана', rating: 5, text: 'Лучший мастер маникюра в городе! Хожу уже 2 года, всегда идеально.', date: '2026-09-28' },
      { id: 'r-1-2', clientName: 'Мадина К.', rating: 5, text: 'Очень аккуратная работа, покрытие держится 3 недели.', date: '2026-09-15' },
      { id: 'r-1-3', clientName: 'Асель', rating: 4, text: 'Всё отлично, но немного задержалась с предыдущим клиентом.', date: '2026-09-01' },
      { id: 'r-1-4', clientName: 'Камила', rating: 5, text: 'Наращивание просто огонь! Формы ровные, носятся долго.', date: '2026-08-20' },
      { id: 'r-1-5', clientName: 'Жанна', rating: 5, text: 'Приятная атмосфера, всё стерильно, результат супер.', date: '2026-08-10' },
    ],
  },
  {
    id: 'm-2', slug: 'salon-elegance', name: 'Салон Elegance',
    specialization: 'Полный спектр бьюти-услуг',
    categorySlug: 'salony-krasoty', district: 'Медеуский', rating: 4.7, reviewCount: 89, minPrice: 5000,
    avatar: { initials: 'SE', gradient: 'from-pine to-sand' },
    nearestSlot: 'Завтра, 10:00', bio: 'Салон красоты в центре Алматы. Работаем с 2018 года.',
    services: [
      { id: 's-2-1', name: 'Стрижка женская', durationMinutes: 60, price: 6000 },
      { id: 's-2-2', name: 'Окрашивание', durationMinutes: 180, price: 15000 },
      { id: 's-2-3', name: 'Укладка', durationMinutes: 45, price: 5000 },
    ],
    reviews: [
      { id: 'r-2-1', clientName: 'Алия', rating: 5, text: 'Красивый салон, профессиональные мастера.', date: '2026-09-25' },
      { id: 'r-2-2', clientName: 'Карина', rating: 4, text: 'Хорошее окрашивание, но цены немного выше среднего.', date: '2026-09-10' },
      { id: 'r-2-3', clientName: 'Динара', rating: 5, text: 'Обожаю этот салон! Всегда ухожу довольная.', date: '2026-08-28' },
    ],
  },
  {
    id: 'm-3', slug: 'gulnara-beauty', name: 'Гульнара Сейтова',
    specialization: 'Стрижки · окрашивание · уход',
    categorySlug: 'salony-krasoty', district: 'Алмалинский', rating: 4.8, reviewCount: 64, minPrice: 5500,
    avatar: { initials: 'ГС', gradient: 'from-coral-deep to-pine' },
    nearestSlot: 'Сегодня, 17:00', bio: 'Стилист-колорист с международными сертификатами. Специализация — сложное окрашивание.',
    services: [
      { id: 's-3-1', name: 'Стрижка + укладка', durationMinutes: 75, price: 7000 },
      { id: 's-3-2', name: 'Сложное окрашивание', durationMinutes: 240, price: 25000 },
      { id: 's-3-3', name: 'Уходовая процедура', durationMinutes: 60, price: 5500 },
    ],
    reviews: [
      { id: 'r-3-1', clientName: 'Томирис', rating: 5, text: 'Гульнара — волшебница! Окрашивание именно такое, как хотела.', date: '2026-09-22' },
      { id: 'r-3-2', clientName: 'Аружан', rating: 5, text: 'Стрижка супер, очень довольна!', date: '2026-09-05' },
      { id: 'r-3-3', clientName: 'Сабина', rating: 4, text: 'Всё хорошо, но долго ждала очередь.', date: '2026-08-15' },
    ],
  },

  // ── Маникюр и педикюр ──
  {
    id: 'm-4', slug: 'zhanna-nails', name: 'Жанна Ким',
    specialization: 'Маникюр · дизайн ногтей',
    categorySlug: 'manikyur-pedikyur', district: 'Бостандыкский', rating: 4.8, reviewCount: 95, minPrice: 6000,
    avatar: { initials: 'ЖК', gradient: 'from-coral to-coral-deep' },
    nearestSlot: 'Сегодня, 14:00', bio: 'Нейл-дизайнер. Специализация — сложный дизайн и аквариумное наращивание.',
    services: [
      { id: 's-4-1', name: 'Маникюр гель-лак', durationMinutes: 90, price: 7000 },
      { id: 's-4-2', name: 'Маникюр + дизайн', durationMinutes: 120, price: 9000 },
      { id: 's-4-3', name: 'Педикюр', durationMinutes: 60, price: 6000 },
    ],
    reviews: [
      { id: 'r-4-1', clientName: 'Айнур', rating: 5, text: 'Потрясающий дизайн! Все подруги спрашивают, где делала.', date: '2026-09-30' },
      { id: 'r-4-2', clientName: 'Меруерт', rating: 5, text: 'Аккуратно, быстро, красиво. Рекомендую!', date: '2026-09-18' },
      { id: 'r-4-3', clientName: 'Лаура', rating: 4, text: 'Хороший мастер, только запись на 2 недели вперёд.', date: '2026-09-05' },
    ],
  },
  {
    id: 'm-5', slug: 'nail-studio-almaty', name: 'Nail Studio Almaty',
    specialization: 'Маникюр · педикюр · наращивание',
    categorySlug: 'manikyur-pedikyur', district: 'Ауэзовский', rating: 4.6, reviewCount: 52, minPrice: 5000,
    avatar: { initials: 'NS', gradient: 'from-sand to-coral' },
    nearestSlot: 'Завтра, 11:00', bio: 'Студия ногтевого сервиса. 3 мастера в команде.',
    services: [
      { id: 's-5-1', name: 'Маникюр классический', durationMinutes: 60, price: 5000 },
      { id: 's-5-2', name: 'Маникюр + покрытие', durationMinutes: 90, price: 7000 },
      { id: 's-5-3', name: 'Педикюр с покрытием', durationMinutes: 90, price: 8000 },
      { id: 's-5-4', name: 'Наращивание', durationMinutes: 150, price: 12000 },
    ],
    reviews: [
      { id: 'r-5-1', clientName: 'Гулим', rating: 5, text: 'Удобное расположение, отличный сервис.', date: '2026-09-20' },
      { id: 'r-5-2', clientName: 'Назерке', rating: 4, text: 'Покрытие держится хорошо, цены адекватные.', date: '2026-09-08' },
      { id: 'r-5-3', clientName: 'Балжан', rating: 5, text: 'Хожу сюда каждые 3 недели, всё нравится.', date: '2026-08-25' },
    ],
  },
  {
    id: 'm-6', slug: 'alina-podologiya', name: 'Алина Тен',
    specialization: 'Педикюр · подология',
    categorySlug: 'manikyur-pedikyur', district: 'Медеуский', rating: 4.9, reviewCount: 78, minPrice: 8000,
    avatar: { initials: 'АТ', gradient: 'from-pine to-pine-soft' },
    nearestSlot: 'Сегодня, 16:00', bio: 'Сертифицированный подолог. Медицинский и аппаратный педикюр.',
    services: [
      { id: 's-6-1', name: 'Аппаратный педикюр', durationMinutes: 90, price: 10000 },
      { id: 's-6-2', name: 'Медицинский педикюр', durationMinutes: 120, price: 12000 },
      { id: 's-6-3', name: 'Консультация подолога', durationMinutes: 30, price: 8000 },
    ],
    reviews: [
      { id: 'r-6-1', clientName: 'Ольга', rating: 5, text: 'Профессионал высшего класса. Решила проблему с вросшим ногтем.', date: '2026-09-27' },
      { id: 'r-6-2', clientName: 'Светлана', rating: 5, text: 'Наконец нашла хорошего подолога в Алматы!', date: '2026-09-12' },
      { id: 'r-6-3', clientName: 'Ирина', rating: 5, text: 'Стерильно, аккуратно, безболезненно.', date: '2026-08-30' },
    ],
  },

  // ── Барбершопы ──
  {
    id: 'm-7', slug: 'alikhan-barber', name: 'Алихан Касымов',
    specialization: 'Мужские стрижки · бороды',
    categorySlug: 'barbershopy', district: 'Бостандыкский', rating: 4.8, reviewCount: 156, minPrice: 4000,
    avatar: { initials: 'АК', gradient: 'from-ink to-ink-soft' },
    nearestSlot: 'Сегодня, 13:00', bio: 'Барбер с 6-летним опытом. Призёр Barber Battle Kazakhstan 2025.',
    services: [
      { id: 's-7-1', name: 'Мужская стрижка', durationMinutes: 45, price: 5000 },
      { id: 's-7-2', name: 'Стрижка + борода', durationMinutes: 60, price: 7000 },
      { id: 's-7-3', name: 'Моделирование бороды', durationMinutes: 30, price: 4000 },
      { id: 's-7-4', name: 'Камуфляж седины', durationMinutes: 45, price: 6000 },
    ],
    reviews: [
      { id: 'r-7-1', clientName: 'Арман', rating: 5, text: 'Лучший барбер в Алматы, без вариантов!', date: '2026-09-29' },
      { id: 'r-7-2', clientName: 'Данияр', rating: 5, text: 'Стрижёт быстро и ровно. Хожу каждые 2 недели.', date: '2026-09-15' },
      { id: 'r-7-3', clientName: 'Тимур', rating: 4, text: 'Классный барбер, только запись сложно поймать.', date: '2026-09-02' },
      { id: 'r-7-4', clientName: 'Ернар', rating: 5, text: 'Борода — огонь! Наконец нашёл своего мастера.', date: '2026-08-18' },
    ],
  },
  {
    id: 'm-8', slug: 'topcut-barbershop', name: 'TopCut Barbershop',
    specialization: 'Барбершоп · мужской стиль',
    categorySlug: 'barbershopy', district: 'Алмалинский', rating: 4.7, reviewCount: 203, minPrice: 3500,
    avatar: { initials: 'TC', gradient: 'from-ink to-coral-deep' },
    nearestSlot: 'Сегодня, 11:00', bio: 'Барбершоп в центре города. Работаем без выходных с 9 до 21.',
    services: [
      { id: 's-8-1', name: 'Стрижка', durationMinutes: 40, price: 4500 },
      { id: 's-8-2', name: 'Стрижка + борода', durationMinutes: 60, price: 6500 },
      { id: 's-8-3', name: 'Детская стрижка', durationMinutes: 30, price: 3500 },
      { id: 's-8-4', name: 'Королевское бритьё', durationMinutes: 45, price: 5000 },
    ],
    reviews: [
      { id: 'r-8-1', clientName: 'Марат', rating: 5, text: 'Атмосферное место, стрижка на уровне.', date: '2026-09-26' },
      { id: 'r-8-2', clientName: 'Бауржан', rating: 4, text: 'Неплохо, но в выходные очереди.', date: '2026-09-14' },
      { id: 'r-8-3', clientName: 'Руслан', rating: 5, text: 'Вожу сюда сына, ему нравится.', date: '2026-08-30' },
    ],
  },

  // ── Брови и ресницы ──
  {
    id: 'm-9', slug: 'madina-brows', name: 'Мадина Абдрахманова',
    specialization: 'Брови · ресницы · ламинирование',
    categorySlug: 'brovi-resnitsy', district: 'Бостандыкский', rating: 4.9, reviewCount: 112, minPrice: 5000,
    avatar: { initials: 'МА', gradient: 'from-pine to-sand' },
    nearestSlot: 'Завтра, 12:00', bio: 'Бровист и лешмейкер. Обучалась у Анастасии Старковой (Москва).',
    services: [
      { id: 's-9-1', name: 'Коррекция + окрашивание бровей', durationMinutes: 60, price: 5000 },
      { id: 's-9-2', name: 'Ламинирование бровей', durationMinutes: 60, price: 7000 },
      { id: 's-9-3', name: 'Наращивание ресниц (классика)', durationMinutes: 120, price: 8000 },
      { id: 's-9-4', name: 'Наращивание ресниц (объём)', durationMinutes: 150, price: 10000 },
      { id: 's-9-5', name: 'Ламинирование ресниц', durationMinutes: 75, price: 6000 },
    ],
    reviews: [
      { id: 'r-9-1', clientName: 'Сауле', rating: 5, text: 'Идеальные брови! Мадина — волшебница.', date: '2026-09-28' },
      { id: 'r-9-2', clientName: 'Инжу', rating: 5, text: 'Наращивание держится месяц, очень аккуратно.', date: '2026-09-16' },
      { id: 'r-9-3', clientName: 'Аида', rating: 5, text: 'Ламинирование бровей — эффект WOW.', date: '2026-09-03' },
      { id: 'r-9-4', clientName: 'Жибек', rating: 4, text: 'Всё отлично, рекомендую подругам.', date: '2026-08-22' },
    ],
  },
  {
    id: 'm-10', slug: 'lash-bar-almaty', name: 'Lash Bar Almaty',
    specialization: 'Ресницы · брови',
    categorySlug: 'brovi-resnitsy', district: 'Медеуский', rating: 4.6, reviewCount: 45, minPrice: 6000,
    avatar: { initials: 'LB', gradient: 'from-coral to-pine-soft' },
    nearestSlot: 'Завтра, 14:00', bio: 'Студия ресниц и бровей в центре Алматы.',
    services: [
      { id: 's-10-1', name: 'Наращивание ресниц', durationMinutes: 120, price: 8000 },
      { id: 's-10-2', name: 'Коррекция бровей', durationMinutes: 45, price: 6000 },
    ],
    reviews: [
      { id: 'r-10-1', clientName: 'Нурай', rating: 5, text: 'Красивые ресницы, ношу уже полгода.', date: '2026-09-20' },
      { id: 'r-10-2', clientName: 'Дильназ', rating: 4, text: 'Хорошая работа за свои деньги.', date: '2026-09-05' },
      { id: 'r-10-3', clientName: 'Эльмира', rating: 5, text: 'Уютная студия, приятные мастера.', date: '2026-08-18' },
    ],
  },

  // ── Тату и пирсинг ──
  {
    id: 'm-11', slug: 'ruslan-tattoo', name: 'Руслан Оспанов',
    specialization: 'Тату · каверы · реализм',
    categorySlug: 'tatu-pirsing', district: 'Алмалинский', rating: 4.9, reviewCount: 87, minPrice: 15000,
    avatar: { initials: 'РО', gradient: 'from-ink to-coral-deep' },
    nearestSlot: 'Завтра, 12:00', bio: 'Тату-мастер. Реализм, дотворк, каверы. Стерильность гарантирована.',
    services: [
      { id: 's-11-1', name: 'Мини-тату (до 5 см)', durationMinutes: 60, price: 15000 },
      { id: 's-11-2', name: 'Тату среднее', durationMinutes: 180, price: 35000 },
      { id: 's-11-3', name: 'Консультация', durationMinutes: 30, price: 0 },
    ],
    reviews: [
      { id: 'r-11-1', clientName: 'Нуржан', rating: 5, text: 'Тату зажило идеально, рисунок четкий.', date: '2026-09-25' },
      { id: 'r-11-2', clientName: 'Азамат', rating: 5, text: 'Кавер старой татуировки — не отличить от новой.', date: '2026-09-10' },
      { id: 'r-11-3', clientName: 'Диас', rating: 5, text: 'Профессионал. Работает чисто и аккуратно.', date: '2026-08-28' },
    ],
  },
  {
    id: 'm-12', slug: 'piercing-studio-alma', name: 'Piercing Studio Alma',
    specialization: 'Пирсинг · проколы',
    categorySlug: 'tatu-pirsing', district: 'Бостандыкский', rating: 4.7, reviewCount: 63, minPrice: 5000,
    avatar: { initials: 'PS', gradient: 'from-coral-deep to-ink' },
    nearestSlot: 'Сегодня, 18:00', bio: 'Студия пирсинга. Медицинская стерилизация, украшения из титана.',
    services: [
      { id: 's-12-1', name: 'Прокол мочки', durationMinutes: 15, price: 5000 },
      { id: 's-12-2', name: 'Прокол хряща', durationMinutes: 20, price: 8000 },
      { id: 's-12-3', name: 'Пирсинг носа', durationMinutes: 20, price: 7000 },
    ],
    reviews: [
      { id: 'r-12-1', clientName: 'Амина', rating: 5, text: 'Быстро, почти не больно, всё стерильно.', date: '2026-09-22' },
      { id: 'r-12-2', clientName: 'Алишер', rating: 4, text: 'Хороший выбор украшений, приемлемые цены.', date: '2026-09-08' },
      { id: 'r-12-3', clientName: 'Камилла', rating: 5, text: 'Зажило быстро, никаких проблем.', date: '2026-08-20' },
    ],
  },

  // ── Визажисты ──
  {
    id: 'm-13', slug: 'dana-makeup', name: 'Дана Бекмухамбетова',
    specialization: 'Макияж · свадебный образ',
    categorySlug: 'vizazhisty', district: 'Медеуский', rating: 4.8, reviewCount: 74, minPrice: 10000,
    avatar: { initials: 'ДБ', gradient: 'from-sand to-coral' },
    nearestSlot: 'Завтра, 09:00', bio: 'Визажист. Свадебный и вечерний макияж, фотосессии.',
    services: [
      { id: 's-13-1', name: 'Дневной макияж', durationMinutes: 60, price: 10000 },
      { id: 's-13-2', name: 'Вечерний макияж', durationMinutes: 90, price: 15000 },
      { id: 's-13-3', name: 'Свадебный образ', durationMinutes: 180, price: 35000 },
      { id: 's-13-4', name: 'Макияж + укладка', durationMinutes: 120, price: 20000 },
    ],
    reviews: [
      { id: 'r-13-1', clientName: 'Молдир', rating: 5, text: 'Свадебный макияж был идеальным, продержался весь день!', date: '2026-09-27' },
      { id: 'r-13-2', clientName: 'Аяна', rating: 5, text: 'Дана понимает с полуслова, что хочешь.', date: '2026-09-14' },
      { id: 'r-13-3', clientName: 'Зарина', rating: 4, text: 'Красивый макияж, но немного дорого.', date: '2026-09-01' },
    ],
  },
  {
    id: 'm-14', slug: 'asel-visage', name: 'Асель Турсынбаева',
    specialization: 'Визаж · укладки',
    categorySlug: 'vizazhisty', district: 'Ауэзовский', rating: 4.6, reviewCount: 38, minPrice: 8000,
    avatar: { initials: 'АТ', gradient: 'from-coral to-sand' },
    nearestSlot: 'Сегодня, 15:00', bio: 'Визажист с 5-летним опытом. Работаю с MAC, Charlotte Tilbury.',
    services: [
      { id: 's-14-1', name: 'Дневной макияж', durationMinutes: 60, price: 8000 },
      { id: 's-14-2', name: 'Вечерний макияж', durationMinutes: 75, price: 12000 },
    ],
    reviews: [
      { id: 'r-14-1', clientName: 'Венера', rating: 5, text: 'Очень нежный и стойкий макияж.', date: '2026-09-24' },
      { id: 'r-14-2', clientName: 'Гульмира', rating: 4, text: 'Хорошая работа, буду обращаться ещё.', date: '2026-09-10' },
      { id: 'r-14-3', clientName: 'Айжан', rating: 5, text: 'Макияж на выпускной — все подруги завидовали!', date: '2026-08-25' },
    ],
  },

  // ── Парикмахеры ──
  {
    id: 'm-15', slug: 'nursultan-hair', name: 'Нурсултан Жумабеков',
    specialization: 'Мужские и женские стрижки',
    categorySlug: 'parikmakhery', district: 'Бостандыкский', rating: 4.7, reviewCount: 93, minPrice: 4000,
    avatar: { initials: 'НЖ', gradient: 'from-pine to-ink' },
    nearestSlot: 'Сегодня, 12:00', bio: 'Парикмахер-универсал. 10 лет опыта.',
    services: [
      { id: 's-15-1', name: 'Мужская стрижка', durationMinutes: 40, price: 4000 },
      { id: 's-15-2', name: 'Женская стрижка', durationMinutes: 60, price: 6000 },
      { id: 's-15-3', name: 'Окрашивание', durationMinutes: 120, price: 12000 },
    ],
    reviews: [
      { id: 'r-15-1', clientName: 'Самат', rating: 5, text: 'Отличные стрижки, рекомендую!', date: '2026-09-28' },
      { id: 'r-15-2', clientName: 'Ботагоз', rating: 4, text: 'Хороший мастер, удобное расположение.', date: '2026-09-15' },
      { id: 'r-15-3', clientName: 'Ержан', rating: 5, text: 'Хожу уже 3 года, не разочаровывал.', date: '2026-09-01' },
    ],
  },
  {
    id: 'm-16', slug: 'studio-look', name: 'Studio Look',
    specialization: 'Стрижки · укладки · кератин',
    categorySlug: 'parikmakhery', district: 'Алмалинский', rating: 4.5, reviewCount: 41, minPrice: 5000,
    avatar: { initials: 'SL', gradient: 'from-ink to-pine' },
    nearestSlot: 'Завтра, 10:00', bio: 'Парикмахерская в центре. Кератиновое выпрямление и ботокс для волос.',
    services: [
      { id: 's-16-1', name: 'Стрижка женская', durationMinutes: 60, price: 5000 },
      { id: 's-16-2', name: 'Кератиновое выпрямление', durationMinutes: 180, price: 20000 },
      { id: 's-16-3', name: 'Ботокс для волос', durationMinutes: 150, price: 18000 },
    ],
    reviews: [
      { id: 'r-16-1', clientName: 'Толганай', rating: 5, text: 'Кератин держится 4 месяца, волосы как шёлк.', date: '2026-09-20' },
      { id: 'r-16-2', clientName: 'Наргиз', rating: 4, text: 'Стрижка хорошая, но долго ждала.', date: '2026-09-06' },
      { id: 'r-16-3', clientName: 'Алтынай', rating: 4, text: 'Нормальная парикмахерская, средние цены.', date: '2026-08-22' },
    ],
  },

  // ── Косметология ──
  {
    id: 'm-17', slug: 'elena-cosmetology', name: 'Елена Пак',
    specialization: 'Косметология · чистка · пилинги',
    categorySlug: 'kosmetologiya', district: 'Медеуский', rating: 4.9, reviewCount: 68, minPrice: 8000,
    avatar: { initials: 'ЕП', gradient: 'from-coral to-pine' },
    nearestSlot: 'Завтра, 11:00', bio: 'Врач-косметолог, дерматолог. Стаж 12 лет. Медицинская лицензия.',
    services: [
      { id: 's-17-1', name: 'Чистка лица комбинированная', durationMinutes: 90, price: 12000 },
      { id: 's-17-2', name: 'Пилинг', durationMinutes: 45, price: 8000 },
      { id: 's-17-3', name: 'Биоревитализация', durationMinutes: 60, price: 25000 },
      { id: 's-17-4', name: 'Консультация', durationMinutes: 30, price: 5000 },
    ],
    reviews: [
      { id: 'r-17-1', clientName: 'Гаухар', rating: 5, text: 'Елена — профессионал. Кожа стала идеальной за 3 процедуры.', date: '2026-09-26' },
      { id: 'r-17-2', clientName: 'Алма', rating: 5, text: 'Пилинг без побочек, результат видно сразу.', date: '2026-09-12' },
      { id: 'r-17-3', clientName: 'Роза', rating: 5, text: 'Лучший косметолог в городе.', date: '2026-08-29' },
    ],
  },
  {
    id: 'm-18', slug: 'cosmo-clinic', name: 'Cosmo Clinic',
    specialization: 'Инъекционная косметология',
    categorySlug: 'kosmetologiya', district: 'Бостандыкский', rating: 4.7, reviewCount: 55, minPrice: 10000,
    avatar: { initials: 'CC', gradient: 'from-pine to-coral' },
    nearestSlot: 'Сегодня, 16:00', bio: 'Клиника косметологии. Ботокс, филлеры, мезотерапия.',
    services: [
      { id: 's-18-1', name: 'Ботокс (1 зона)', durationMinutes: 30, price: 15000 },
      { id: 's-18-2', name: 'Филлеры (губы)', durationMinutes: 45, price: 25000 },
      { id: 's-18-3', name: 'Мезотерапия лица', durationMinutes: 60, price: 10000 },
    ],
    reviews: [
      { id: 'r-18-1', clientName: 'Салтанат', rating: 5, text: 'Ботокс смотрится естественно, очень довольна.', date: '2026-09-24' },
      { id: 'r-18-2', clientName: 'Жанар', rating: 4, text: 'Хорошая клиника, но цены кусаются.', date: '2026-09-08' },
      { id: 'r-18-3', clientName: 'Кундыз', rating: 5, text: 'Филлеры в губы — идеально, спасибо!', date: '2026-08-20' },
    ],
  },

  // ── Массаж ──
  {
    id: 'm-19', slug: 'marat-massage', name: 'Марат Исабеков',
    specialization: 'Массаж · мануальная терапия',
    categorySlug: 'massazh', district: 'Ауэзовский', rating: 4.8, reviewCount: 82, minPrice: 7000,
    avatar: { initials: 'МИ', gradient: 'from-sand to-pine' },
    nearestSlot: 'Сегодня, 14:00', bio: 'Массажист с медицинским образованием. Классический, спортивный, лечебный массаж.',
    services: [
      { id: 's-19-1', name: 'Общий массаж (60 мин)', durationMinutes: 60, price: 8000 },
      { id: 's-19-2', name: 'Массаж спины', durationMinutes: 40, price: 7000 },
      { id: 's-19-3', name: 'Спортивный массаж', durationMinutes: 90, price: 12000 },
    ],
    reviews: [
      { id: 'r-19-1', clientName: 'Канат', rating: 5, text: 'Сильные руки, после массажа как новый человек.', date: '2026-09-27' },
      { id: 'r-19-2', clientName: 'Бекзат', rating: 5, text: 'Спина перестала болеть после 5 сеансов.', date: '2026-09-13' },
      { id: 'r-19-3', clientName: 'Серик', rating: 4, text: 'Хороший массажист, рекомендую.', date: '2026-08-30' },
    ],
  },
  {
    id: 'm-20', slug: 'relax-spa-studio', name: 'Relax SPA Studio',
    specialization: 'SPA · релакс-массаж · обёртывания',
    categorySlug: 'massazh', district: 'Медеуский', rating: 4.6, reviewCount: 47, minPrice: 10000,
    avatar: { initials: 'RS', gradient: 'from-pine to-sand' },
    nearestSlot: 'Завтра, 13:00', bio: 'SPA-студия. Релакс-массаж, стоун-терапия, обёртывания.',
    services: [
      { id: 's-20-1', name: 'Релакс-массаж', durationMinutes: 60, price: 10000 },
      { id: 's-20-2', name: 'Стоун-массаж', durationMinutes: 90, price: 15000 },
      { id: 's-20-3', name: 'Шоколадное обёртывание', durationMinutes: 90, price: 12000 },
    ],
    reviews: [
      { id: 'r-20-1', clientName: 'Индира', rating: 5, text: 'Потрясающая атмосфера, полное расслабление.', date: '2026-09-22' },
      { id: 'r-20-2', clientName: 'Айгуль', rating: 4, text: 'Хороший массаж, но хотелось бы дольше.', date: '2026-09-07' },
      { id: 'r-20-3', clientName: 'Лейла', rating: 5, text: 'Дарила подруге сертификат — осталась в восторге.', date: '2026-08-24' },
    ],
  },
];

export const districts = [
  'Бостандыкский', 'Медеуский', 'Алмалинский', 'Ауэзовский',
  'Наурызбайский', 'Алатауский', 'Жетысуский', 'Турксибский',
];
