# Slotly — Платформа онлайн-записи к бьюти-мастерам в Казахстане

🌐 **Демо-версия / Продакшн сайт:** [https://slotly-inky.vercel.app/](https://slotly-inky.vercel.app/)

---

## 📌 О проекте

**Slotly** — это современный сервис для бьюти-мастеров и их клиентов в Казахстане (Алматы, Астана, Шымкент и др.). 

Сервис решает главную проблему мастеров — потерю клиентов и рутину ручной записи в WhatsApp/Instagram Direct:
- **Для мастера:** персональная ссылка в шапку профиля (`slotly.kz/book/[master-slug]`), прозрачное расписание, автоматический учет времени и слотов, гибкое управление услугами и ценами.
- **Для клиента:** быстрая и удобная запись за 30 секунд без звонков и долгих переписок — выбор услуги, даты, свободного времени и мгновенное подтверждение.

---

## ✨ Ключевые возможности

- 🚀 **Быстрая онлайн-запись (3 клика):** выбор услуги, времени и даты с автоподбором свободных окон.
- 📱 **Mobile-First & Premium UI:** лаконичный, эстетичный и адаптивный интерфейс с мягкой природной палитрой (кремовые, терракотовые и золотистые оттенки).
- 📅 **Управление слотами и графиком:** настройка рабочих часов, перерывов и выходных дней для каждого мастера.
- 💇‍♀️ **Каталог услуг и категорий:** ногтевой сервис, ресницы, брови, волосы, макияж, косметология и массаж с указанием цен в тенге (₸).
- 💬 **Интеграция с мессенджерами:** быстрый переход в WhatsApp для связи с мастером и напоминаний.
- ⭐ **Отзывы и рейтинги:** подтвержденные отзывы клиентов после посещения процедур.

---

## 🛠 Технологический стек

- **Фреймворк:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Язык:** [TypeScript](https://www.typescriptlang.org/)
- **Стилизация:** [Tailwind CSS v4](https://tailwindcss.com/)
- **База данных и ORM:** [PostgreSQL](https://www.postgresql.org/) (Supabase) + [Prisma ORM](https://www.prisma.io/)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Валидация:** [Zod](https://zod.dev/)
- **Деплой:** [Vercel](https://vercel.com/) ([https://slotly-inky.vercel.app/](https://slotly-inky.vercel.app/))

---

## 🚀 Быстрый старт локально

### 1. Клонирование репозитория и установка зависимостей

```bash
git clone https://github.com/ersultananime/Slotly.git
cd Slotly
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` на основе примера:

```bash
cp .env.example .env.local
```

Заполните ключи подключения к вашему проекту в **Supabase**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### 3. Настройка базы данных Prisma

```bash
# Генерация Prisma Client
npm run db:generate

# Применение схемы в базу данных (или миграции)
npm run db:push

# Заполнение тестовыми данными (опционально)
npm run db:seed
```

### 4. Запуск сервера разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 📁 Структура проекта

```text
├── prisma/
│   ├── schema.prisma       # Схема базы данных (пользователи, мастера, записи, отзывы)
│   └── seed.ts             # Сидер с тестовыми данными
├── public/                 # Статические файлы и логотипы
├── src/
│   ├── app/
│   │   ├── book/[slug]/    # Страница персональной онлайн-записи к мастеру
│   │   ├── globals.css     # Глобальные стили
│   │   ├── layout.tsx      # Корневой лейаут
│   │   └── page.tsx        # Главный лендинг платформы
│   └── lib/                # Утилиты, клиенты Prisma / Supabase
├── supabase_schema.sql     # SQL-схема для инициализации в Supabase
├── .env.example            # Шаблон переменных окружения
└── README.md
```

---

## 🌐 Ссылка на работающий проект

Посетите рабочий сайт: **[https://slotly-inky.vercel.app/](https://slotly-inky.vercel.app/)**
