-- ============================================================
-- Slotly — B2B SaaS AI-Widget
-- Migration: 0001_initial_schema
-- Выполни в Supabase → SQL Editor → Run
-- ============================================================

-- ============================================================
-- СЕКЦИЯ 1: ТИПЫ (ENUMS)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE public.plan_type AS ENUM ('trial', 'starter', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('new', 'in_progress', 'done', 'spam');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================
-- СЕКЦИЯ 2: ТАБЛИЦЫ
-- ============================================================

-- 2.1 companies — профиль тенанта (владелец бизнеса)
CREATE TABLE IF NOT EXISTS public.companies (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL DEFAULT '',
  plan       plan_type   NOT NULL DEFAULT 'trial',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 widgets — настройки виджета чата
CREATE TABLE IF NOT EXISTS public.widgets (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID    NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  color           TEXT    NOT NULL DEFAULT '#2563EB',
  bot_name        TEXT    NOT NULL DEFAULT 'Ассистент',
  welcome_message TEXT    NOT NULL DEFAULT 'Привет! Чем могу помочь?',
  allowed_domains TEXT[]  NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 knowledge_base — база знаний для RAG
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID    NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  content    TEXT    NOT NULL,
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 leads — собранные контакты
CREATE TABLE IF NOT EXISTS public.leads (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name       TEXT,
  contact    TEXT,       -- телефон, email или Telegram
  summary    TEXT,       -- суть обращения
  status     lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- СЕКЦИЯ 3: ИНДЕКСЫ
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_widgets_company        ON public.widgets(company_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_company ON public.knowledge_base(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_company          ON public.leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_status           ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at       ON public.leads(created_at DESC);

-- ============================================================
-- СЕКЦИЯ 4: ТРИГГЕР — авто-создание компании при регистрации
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.companies (user_id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- СЕКЦИЯ 5: АВТО-ОБНОВЛЕНИЕ updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_widgets_updated_at
  BEFORE UPDATE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- СЕКЦИЯ 6: ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.companies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads          ENABLE ROW LEVEL SECURITY;

-- Хелпер — получить company_id текущего пользователя
CREATE OR REPLACE FUNCTION public.my_company_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT id FROM public.companies WHERE user_id = auth.uid() LIMIT 1;
$$;

-- --- companies ---
CREATE POLICY "companies: owner select" ON public.companies FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "companies: owner insert" ON public.companies FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "companies: owner update" ON public.companies FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "companies: owner delete" ON public.companies FOR DELETE TO authenticated USING (user_id = auth.uid());

-- --- widgets ---
CREATE POLICY "widgets: owner select" ON public.widgets FOR SELECT TO authenticated USING (company_id = public.my_company_id());
CREATE POLICY "widgets: owner insert" ON public.widgets FOR INSERT TO authenticated WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "widgets: owner update" ON public.widgets FOR UPDATE TO authenticated USING (company_id = public.my_company_id()) WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "widgets: owner delete" ON public.widgets FOR DELETE TO authenticated USING (company_id = public.my_company_id());
-- Виджет на сайте (anon) может читать настройки своей компании
CREATE POLICY "widgets: anon read active" ON public.widgets FOR SELECT TO anon USING (is_active = true);

-- --- knowledge_base ---
CREATE POLICY "kb: owner select" ON public.knowledge_base FOR SELECT TO authenticated USING (company_id = public.my_company_id());
CREATE POLICY "kb: owner insert" ON public.knowledge_base FOR INSERT TO authenticated WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "kb: owner update" ON public.knowledge_base FOR UPDATE TO authenticated USING (company_id = public.my_company_id()) WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "kb: owner delete" ON public.knowledge_base FOR DELETE TO authenticated USING (company_id = public.my_company_id());

-- --- leads ---
CREATE POLICY "leads: owner select" ON public.leads FOR SELECT TO authenticated USING (company_id = public.my_company_id());
CREATE POLICY "leads: owner insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "leads: owner update" ON public.leads FOR UPDATE TO authenticated USING (company_id = public.my_company_id()) WITH CHECK (company_id = public.my_company_id());
CREATE POLICY "leads: owner delete" ON public.leads FOR DELETE TO authenticated USING (company_id = public.my_company_id());
-- Виджет (anon) может создавать лиды
CREATE POLICY "leads: anon insert" ON public.leads FOR INSERT TO anon WITH CHECK (true);

-- ============================================================
-- ПРОВЕРКА: покажет все таблицы с включённым RLS
-- ============================================================
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
