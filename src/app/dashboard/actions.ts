'use server'

import { revalidatePath } from 'next/cache'
import { requireCompany } from '@/lib/dashboard'

export async function saveKnowledge(content: string) {
  // Recheck ownership for each mutation; company_id is never accepted from the browser.
  const { supabase, companyId } = await requireCompany()
  if (typeof content !== 'string' || !content.trim() || content.length > 50000) {
    return { error: 'Введите от 1 до 50 000 символов.' }
  }
  const { data, error } = await supabase.from('knowledge_base')
    .upsert({ company_id: companyId, content: content.trim() }, { onConflict: 'company_id' })
    .select('id').single()
  if (error || !data) return { error: 'Не удалось сохранить базу знаний. Попробуйте ещё раз.' }
  revalidatePath('/dashboard')
  return { success: true }
}
