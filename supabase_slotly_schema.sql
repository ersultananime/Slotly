-- ============================================================
-- Slotly — B2B SaaS AI-Widget
-- Full Database Schema for Supabase (PostgreSQL)
-- Version: 1.0.0
-- 
-- ИНСТРУКЦИЯ:
-- Скопируйте весь этот код и вставьте в Supabase → SQL Editor → Run
-- ============================================================


-- ============================================================
-- СЕКЦИЯ 0: ОЧИСТКА (безопасный сброс перед повторным запуском)
-- ============================================================
DROP TABLE IF EXISTS public.messages        CASCADE;
DROP TABLE IF EXISTS public.chat_sessions   CASCADE;
DROP TABLE IF EXISTS public.leads           CASCADE;
DROP TABLE IF EXISTS public.knowledge_base  CASCADE;
DROP TABLE IF EXISTS public.widgets         CASCADE;
DROP TABLE IF EXISTS public.companies       CASCADE;

DROP TYPE IF EXISTS public.plan_type        CASCADE;
DROP TYPE IF EXISTS public.kb_content_type  CASCADE;
DROP TYPE IF EXISTS public.kb_status        CASCADE;
DROP TYPE IF EXISTS public.lead_status      CASCADE;
DROP TYPE IF EXISTS public.message_role     CASCADE;

-- ============================================================
-- СЕКЦИЯ 1: ТИПЫ (ENUMS)
-- ============================================================

-- Тарифные планы
CREATE TYPE public.plan_type AS ENUM (
  'trial',    -- Пробный (14 дней)
  'starter',  -- Базовый
  'pro',      -- Профессиональный
  'enterprise'-- Корпоративный
);

-- Тип контента в базе знаний
CREATE TYPE public.kb_content_type AS ENUM (
  'url',       -- Ссылка на страницу сайта
  'text',      -- Произвольный текст
  'document'   -- Загруженный документ (PDF и т.д.)
);

-- Статус обработки контента (RAG pipeline)
CREATE TYPE public.kb_status AS ENUM (
  'pending',    -- Ожидает обработки
  'processing', -- В процессе индексации
  'ready',      -- Готово к использованию
  'error'       -- Ошибка обработки
);

-- Статус лида
CREATE TYPE public.lead_status AS ENUM (
  'new',        -- Новый, не обработан
  'in_progress',-- В работе
  'done',       -- Завершён
  'spam'        -- Спам / нерелевантно
);

-- Роль отправителя сообщения
CREATE TYPE public.message_role AS ENUM (
  'user',       -- Посетитель сайта
  'assistant',  -- Ответ ИИ-бота
  'system'      -- Системное сообщение
);


-- ============================================================
-- СЕКЦИЯ 2: ТАБЛИЦЫ
-- ============================================================

-- ------------------------------------------------------------
-- 2.1 companies (Профиль компании / Тенант)
-- Создаётся автоматически при регистрации через триггер.
-- ------------------------------------------------------------
CREATE TABLE public.companies (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL DEFAULT '',         -- Название компании
  plan            plan_type   NOT NULL DEFAULT 'trial',    -- Текущий тариф
  trial_ends_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  is_active       BOOLEAN     NOT NULL DEFAULT true,       -- Аккаунт активен?
  website_url     TEXT,                                    -- Сайт компании
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.companies              IS 'Профили компаний (тенанты). Создаются автоматически при регистрации.';
COMMENT ON COLUMN public.companies.user_id      IS 'Ссылка на auth.users — владелец компании.';
COMMENT ON COLUMN public.companies.plan         IS 'Текущий тарифный план.';
COMMENT ON COLUMN public.companies.trial_ends_at IS 'Дата окончания пробного периода.';


-- ------------------------------------------------------------
-- 2.2 widgets (Настройки виджета чата)
-- Каждая компания имеет один виджет (один к одному).
-- ------------------------------------------------------------
CREATE TABLE public.widgets (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID    NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  bot_name            TEXT    NOT NULL DEFAULT 'Ассистент',    -- Имя бота в чате
  welcome_message     TEXT    NOT NULL DEFAULT 'Привет! Чем могу помочь?',
  primary_color       TEXT    NOT NULL DEFAULT '#6366f1',      -- HEX цвет
  allowed_domains     TEXT[]  NOT NULL DEFAULT '{}',           -- ['example.com', 'shop.kz']
  is_active           BOOLEAN NOT NULL DEFAULT true,           -- Виджет включён?
  position            TEXT    NOT NULL DEFAULT 'bottom-right', -- Позиция на странице
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.widgets                  IS 'Настройки внешнего вида и поведения виджета чата.';
COMMENT ON COLUMN public.widgets.allowed_domains  IS 'Массив доменов, на которых разрешена работа виджета.';
COMMENT ON COLUMN public.widgets.primary_color    IS 'Основной цвет виджета в формате HEX.';


-- ------------------------------------------------------------
-- 2.3 knowledge_base (База знаний для RAG)
-- Хранит источники данных для обучения ИИ.
-- ------------------------------------------------------------
CREATE TABLE public.knowledge_base (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID            NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  content_type    kb_content_type NOT NULL,
  title           TEXT,                          -- Заголовок/описание источника
  content         TEXT,                          -- Текстовое содержание или URL
  file_path       TEXT,                          -- Путь к файлу в Supabase Storage
  status          kb_status       NOT NULL DEFAULT 'pending',
  error_message   TEXT,                          -- Сообщение об ошибке если status = 'error'
  token_count     INTEGER,                       -- Количество токенов после обработки
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.knowledge_base              IS 'База знаний для RAG (Retrieval-Augmented Generation). Источники данных для ИИ.';
COMMENT ON COLUMN public.knowledge_base.content      IS 'Для типа url — адрес страницы. Для text — сам текст. Для document — null (файл в Storage).';
COMMENT ON COLUMN public.knowledge_base.token_count  IS 'Число токенов после векторизации (для контроля лимитов).';


-- ------------------------------------------------------------
-- 2.4 leads (Лиды / Собранные контакты)
-- Контакты посетителей, которые бот собрал в диалоге.
-- ------------------------------------------------------------
CREATE TABLE public.leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  session_id      UUID,                          -- Связь с chat_sessions (nullable для гибкости)
  client_name     TEXT,                          -- Имя клиента
  phone           TEXT,                          -- Телефон
  telegram        TEXT,                          -- Telegram username (@handle)
  email           TEXT,                          -- Email (опционально)
  summary         TEXT,                          -- Суть обращения (AI-summary)
  status          lead_status NOT NULL DEFAULT 'new',
  notes           TEXT,                          -- Заметки менеджера
  source_page     TEXT,                          -- URL страницы, с которой пришёл
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.leads             IS 'Лиды — контакты посетителей, собранные ботом в ходе диалога.';
COMMENT ON COLUMN public.leads.summary     IS 'Краткое описание обращения, сгенерированное ИИ.';
COMMENT ON COLUMN public.leads.source_page IS 'URL страницы, на которой был открыт виджет.';


-- ------------------------------------------------------------
-- 2.5 chat_sessions (Сессии диалогов — аналитика)
-- Одна сессия = один диалог посетителя с ботом.
-- ------------------------------------------------------------
CREATE TABLE public.chat_sessions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  visitor_id      TEXT,                          -- Анонимный ID посетителя (из cookie)
  source_page     TEXT,                          -- URL страницы начала диалога
  lead_id         UUID        REFERENCES public.leads(id) ON DELETE SET NULL,
  message_count   INTEGER     NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at        TIMESTAMPTZ,                   -- NULL = сессия ещё активна
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.chat_sessions           IS 'Сессии диалогов. Одна запись = один разговор посетителя с ботом.';
COMMENT ON COLUMN public.chat_sessions.visitor_id IS 'Анонимный идентификатор посетителя (например, из localStorage).';


-- ------------------------------------------------------------
-- 2.6 messages (Сообщения внутри сессии)
-- Полная история диалога для аналитики и контекста.
-- ------------------------------------------------------------
CREATE TABLE public.messages (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID         NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  company_id  UUID         NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role        message_role NOT NULL,           -- 'user' | 'assistant' | 'system'
  content     TEXT         NOT NULL,           -- Текст сообщения
  tokens_used INTEGER,                         -- Токены потраченные на этот ответ ИИ
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.messages            IS 'Отдельные сообщения внутри сессии диалога.';
COMMENT ON COLUMN public.messages.company_id IS 'Дублируем company_id для упрощения RLS-политик.';
COMMENT ON COLUMN public.messages.tokens_used IS 'Количество LLM-токенов на этот ответ (для биллинга).';


-- ============================================================
-- СЕКЦИЯ 3: ИНДЕКСЫ (для производительности)
-- ============================================================

CREATE INDEX idx_knowledge_base_company ON public.knowledge_base(company_id);
CREATE INDEX idx_knowledge_base_status  ON public.knowledge_base(status);
CREATE INDEX idx_leads_company          ON public.leads(company_id);
CREATE INDEX idx_leads_status           ON public.leads(status);
CREATE INDEX idx_leads_created_at       ON public.leads(created_at DESC);
CREATE INDEX idx_chat_sessions_company  ON public.chat_sessions(company_id);
CREATE INDEX idx_messages_session       ON public.messages(session_id);
CREATE INDEX idx_messages_company       ON public.messages(company_id);
CREATE INDEX idx_messages_created_at    ON public.messages(created_at);


-- ============================================================
-- СЕКЦИЯ 4: ФУНКЦИЯ И ТРИГГЕР — Авто-создание компании
-- Срабатывает при регистрации нового пользователя в auth.users
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- Важно: функция выполняется с правами владельца (service role)
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.companies (user_id, name)
  VALUES (
    NEW.id,
    -- Берём имя из метаданных регистрации (если передано), иначе — из email
    COALESCE(NEW.raw_user_meta_data->>'company_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Триггер вызывает функцию ПОСЛЕ вставки нового пользователя
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Автоматически создаёт запись в companies при регистрации нового пользователя.';


-- ============================================================
-- СЕКЦИЯ 5: ФУНКЦИЯ — Авто-обновление updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Применяем триггер updated_at ко всем нужным таблицам
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_widgets_updated_at
  BEFORE UPDATE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- СЕКЦИЯ 6: ROW LEVEL SECURITY (RLS)
-- Каждый пользователь видит ТОЛЬКО свои данные
-- ============================================================

-- Включаем RLS на всех таблицах
ALTER TABLE public.companies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- RLS: companies
-- Пользователь управляет ТОЛЬКО своей компанией (user_id = auth.uid())
-- ------------------------------------------------------------
CREATE POLICY "companies: owner can select"
  ON public.companies FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "companies: owner can insert"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "companies: owner can update"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "companies: owner can delete"
  ON public.companies FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- Хелпер-функция: возвращает company_id текущего пользователя.
-- Используется во всех RLS-политиках ниже для чистоты кода.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.my_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.companies WHERE user_id = auth.uid() LIMIT 1;
$$;

COMMENT ON FUNCTION public.my_company_id IS 'Возвращает company_id текущего аутентифицированного пользователя. Используется в RLS-политиках.';


-- ------------------------------------------------------------
-- RLS: widgets
-- ------------------------------------------------------------
CREATE POLICY "widgets: owner can select"
  ON public.widgets FOR SELECT
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "widgets: owner can insert"
  ON public.widgets FOR INSERT
  TO authenticated
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "widgets: owner can update"
  ON public.widgets FOR UPDATE
  TO authenticated
  USING (company_id = public.my_company_id())
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "widgets: owner can delete"
  ON public.widgets FOR DELETE
  TO authenticated
  USING (company_id = public.my_company_id());


-- ------------------------------------------------------------
-- RLS: knowledge_base
-- ------------------------------------------------------------
CREATE POLICY "knowledge_base: owner can select"
  ON public.knowledge_base FOR SELECT
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "knowledge_base: owner can insert"
  ON public.knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "knowledge_base: owner can update"
  ON public.knowledge_base FOR UPDATE
  TO authenticated
  USING (company_id = public.my_company_id())
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "knowledge_base: owner can delete"
  ON public.knowledge_base FOR DELETE
  TO authenticated
  USING (company_id = public.my_company_id());


-- ------------------------------------------------------------
-- RLS: leads
-- ------------------------------------------------------------
CREATE POLICY "leads: owner can select"
  ON public.leads FOR SELECT
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "leads: owner can insert"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "leads: owner can update"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (company_id = public.my_company_id())
  WITH CHECK (company_id = public.my_company_id());

CREATE POLICY "leads: owner can delete"
  ON public.leads FOR DELETE
  TO authenticated
  USING (company_id = public.my_company_id());

-- Публичная политика: анонимный бот (anon key) может создавать лиды
-- Это нужно для виджета на сайте, который работает без авторизации
CREATE POLICY "leads: anon can insert via widget"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (true);  -- Ограничение по домену лучше делать на уровне Edge Function


-- ------------------------------------------------------------
-- RLS: chat_sessions
-- ------------------------------------------------------------
CREATE POLICY "chat_sessions: owner can select"
  ON public.chat_sessions FOR SELECT
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "chat_sessions: owner can update"
  ON public.chat_sessions FOR UPDATE
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "chat_sessions: owner can delete"
  ON public.chat_sessions FOR DELETE
  TO authenticated
  USING (company_id = public.my_company_id());

-- Виджет (anon) может создавать и обновлять сессии
CREATE POLICY "chat_sessions: anon can insert"
  ON public.chat_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "chat_sessions: anon can update own session"
  ON public.chat_sessions FOR UPDATE
  TO anon
  USING (true);  -- Дополнительно ограничить по visitor_id в Edge Function


-- ------------------------------------------------------------
-- RLS: messages
-- ------------------------------------------------------------
CREATE POLICY "messages: owner can select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (company_id = public.my_company_id());

CREATE POLICY "messages: owner can delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (company_id = public.my_company_id());

-- Виджет (anon) может добавлять сообщения в сессию
CREATE POLICY "messages: anon can insert"
  ON public.messages FOR INSERT
  TO anon
  WITH CHECK (true);


-- ============================================================
-- СЕКЦИЯ 7: ПУБЛИЧНОЕ ЧТЕНИЕ ВИДЖЕТА (для анонимного JS-кода)
-- Виджет на сайте клиента должен загружать свои настройки
-- ============================================================

CREATE POLICY "widgets: anon can read by company"
  ON public.widgets FOR SELECT
  TO anon
  USING (is_active = true);


-- ============================================================
-- ИТОГ: Проверка созданных таблиц
-- ============================================================
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
