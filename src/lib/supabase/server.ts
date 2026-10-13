import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client для Server Components, Route Handlers и Server Actions.
 * Использует service_role — НЕ выставлять на клиент!
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}
