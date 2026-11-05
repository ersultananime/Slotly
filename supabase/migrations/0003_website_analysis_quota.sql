BEGIN;

CREATE TABLE public.website_analysis_quota (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  window_started_at timestamptz NOT NULL,
  last_attempt_at timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts BETWEEN 1 AND 10)
);
ALTER TABLE public.website_analysis_quota ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.website_analysis_quota FROM anon, authenticated;

-- No caller-supplied identity; concurrent requests compete for the same row lock.
CREATE FUNCTION public.claim_website_analysis() RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE claimed uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.companies WHERE user_id = auth.uid()) THEN RETURN false; END IF;
  INSERT INTO public.website_analysis_quota AS quota (user_id, window_started_at, last_attempt_at, attempts)
  VALUES (auth.uid(), now(), now(), 1)
  ON CONFLICT (user_id) DO UPDATE SET
    window_started_at = CASE WHEN quota.window_started_at <= now() - interval '1 hour' THEN now() ELSE quota.window_started_at END,
    last_attempt_at = now(),
    attempts = CASE WHEN quota.window_started_at <= now() - interval '1 hour' THEN 1 ELSE quota.attempts + 1 END
  WHERE quota.last_attempt_at <= now() - interval '1 minute'
    AND (quota.window_started_at <= now() - interval '1 hour' OR quota.attempts < 10)
  RETURNING user_id INTO claimed;
  RETURN claimed IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_website_analysis() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_website_analysis() TO authenticated;

COMMIT;
