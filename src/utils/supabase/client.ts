import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase клиент для Client Components (браузер).
 *
 * Использование:
 * import { createClient } from '@/utils/supabase/client'
 * const supabase = createClient()
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
