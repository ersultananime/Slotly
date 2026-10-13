import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client для использования в браузере (Client Components).
 * Используй для: Auth, Realtime, Storage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
