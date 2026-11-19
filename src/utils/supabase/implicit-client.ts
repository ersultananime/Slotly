import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Client-only auth client used for password recovery links.
 *
 * The implicit flow puts the short-lived recovery session in the link itself,
 * so the email can be opened on a different browser or device from the one
 * that requested it. The session is used only to set a new password and is
 * signed out immediately afterwards.
 */
export function createImplicitClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
      },
    }
  )
}
