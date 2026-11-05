-- Applies to the schema described for the dashboard, or after 0001.
-- Does not drop tables or silently discard duplicate knowledge records.
BEGIN;

-- Compatibility with 0001, which called the message column "summary".
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'message') THEN
    ALTER TABLE public.leads ADD COLUMN message text;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'summary') THEN
      UPDATE public.leads SET message = summary;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM public.knowledge_base GROUP BY company_id HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Multiple knowledge records per company: merge them before applying 0002_dashboard.sql';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS dashboard_knowledge_company_unique ON public.knowledge_base(company_id);
CREATE INDEX IF NOT EXISTS dashboard_leads_company_created ON public.leads(company_id, created_at DESC, id DESC);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY dashboard_company_read ON public.companies FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY dashboard_knowledge_read ON public.knowledge_base FOR SELECT TO authenticated USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY dashboard_knowledge_insert ON public.knowledge_base FOR INSERT TO authenticated WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY dashboard_knowledge_update ON public.knowledge_base FOR UPDATE TO authenticated USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())) WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY dashboard_leads_read ON public.leads FOR SELECT TO authenticated USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Restrictive policies also constrain any pre-existing permissive owner policies.
CREATE POLICY dashboard_company_boundary ON public.companies AS RESTRICTIVE FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY dashboard_knowledge_boundary ON public.knowledge_base AS RESTRICTIVE FOR ALL TO authenticated USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())) WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY dashboard_leads_boundary ON public.leads AS RESTRICTIVE FOR ALL TO authenticated USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())) WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
COMMIT;
