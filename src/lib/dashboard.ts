import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export const requireUser = cache(async () => {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return { supabase, user }
})

export const requireCompany = cache(async () => {
  const { supabase, user } = await requireUser()
  const { data: company, error } = await supabase.from('companies')
    .select('id').eq('user_id', user.id).maybeSingle()
  if (error) throw new Error('Не удалось загрузить компанию.')
  if (!company) throw new Error('Компания не найдена. Обратитесь в поддержку Slotly.')
  return { supabase, user, companyId: company.id as string }
})
