-- ============================================================
-- Slotly Database Schema for Supabase (PostgreSQL)
-- Скопируйте весь этот код и вставьте в Supabase -> SQL Editor -> Run
-- ============================================================

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('CLIENT', 'MASTER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT UNIQUE,
  "name" TEXT NOT NULL,
  "role" "Role" DEFAULT 'CLIENT' NOT NULL,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "gradient" TEXT NOT NULL,
  "sortOrder" INTEGER DEFAULT 0 NOT NULL
);

-- 4. Masters Table
CREATE TABLE IF NOT EXISTS "masters" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE NOT NULL,
  "userId" UUID UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "categoryId" TEXT NOT NULL REFERENCES "categories"("id"),
  "specialization" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "avatarInitials" TEXT NOT NULL,
  "avatarGradient" TEXT NOT NULL,
  "minPrice" INTEGER DEFAULT 0 NOT NULL,
  "rating" DOUBLE PRECISION DEFAULT 0 NOT NULL,
  "reviewCount" INTEGER DEFAULT 0 NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS "services" (
  "id" TEXT PRIMARY KEY,
  "masterId" TEXT NOT NULL REFERENCES "masters"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "sortOrder" INTEGER DEFAULT 0 NOT NULL
);

-- 6. Schedules Table
CREATE TABLE IF NOT EXISTS "schedules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterId" TEXT NOT NULL REFERENCES "masters"("id") ON DELETE CASCADE,
  "dayOfWeek" INTEGER NOT NULL, -- 0=Пн, 6=Вс
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "isWorking" BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT "unique_master_day" UNIQUE ("masterId", "dayOfWeek")
);

-- 7. Time Blocks Table (отпуска, перерывы)
CREATE TABLE IF NOT EXISTS "time_blocks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterId" TEXT NOT NULL REFERENCES "masters"("id") ON DELETE CASCADE,
  "startsAt" TIMESTAMPTZ NOT NULL,
  "endsAt" TIMESTAMPTZ NOT NULL,
  "reason" TEXT
);

-- 8. Bookings Table (Записи)
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterId" TEXT NOT NULL REFERENCES "masters"("id"),
  "clientId" UUID NOT NULL REFERENCES "users"("id"),
  "serviceId" TEXT NOT NULL REFERENCES "services"("id"),
  "startsAt" TIMESTAMPTZ NOT NULL,
  "endsAt" TIMESTAMPTZ NOT NULL,
  "status" "BookingStatus" DEFAULT 'PENDING' NOT NULL,
  "clientNote" TEXT,
  "masterNote" TEXT,
  "totalPrice" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterId" TEXT NOT NULL REFERENCES "masters"("id") ON DELETE CASCADE,
  "clientId" UUID NOT NULL REFERENCES "users"("id"),
  "bookingId" UUID UNIQUE NOT NULL REFERENCES "bookings"("id"),
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "text" TEXT NOT NULL,
  "isVisible" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. Subscriptions Table
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterId" TEXT UNIQUE NOT NULL REFERENCES "masters"("id") ON DELETE CASCADE,
  "status" "SubscriptionStatus" DEFAULT 'TRIAL' NOT NULL,
  "trialEnds" TIMESTAMPTZ NOT NULL,
  "paidUntil" TIMESTAMPTZ,
  "priceKzt" INTEGER DEFAULT 3900 NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (Категории из проекта Slotly)
-- ============================================================
INSERT INTO "categories" ("id", "slug", "name", "icon", "gradient", "sortOrder") VALUES
  ('cat-1', 'salony-krasoty', 'Салоны красоты', 'Sparkles', 'from-coral to-coral-deep', 1),
  ('cat-2', 'manikyur-pedikyur', 'Маникюр и педикюр', 'Hand', 'from-coral to-sand', 2),
  ('cat-3', 'barbershopy', 'Барбершопы', 'Scissors', 'from-ink to-ink-soft', 3),
  ('cat-4', 'brovi-resnitsy', 'Брови и ресницы', 'Eye', 'from-pine to-pine-soft', 4),
  ('cat-5', 'tatu-pirsing', 'Тату и пирсинг', 'PenTool', 'from-ink to-coral-deep', 5),
  ('cat-6', 'vizazhisty', 'Визажисты', 'Palette', 'from-sand to-coral', 6),
  ('cat-7', 'parikmakhery', 'Парикмахеры', 'Scissors', 'from-pine to-ink', 7),
  ('cat-8', 'kosmetologiya', 'Косметология', 'Droplets', 'from-coral to-pine', 8),
  ('cat-9', 'massazh', 'Массаж', 'Heart', 'from-sand to-pine', 9)
ON CONFLICT ("id") DO NOTHING;
