import { requireCompany } from '@/lib/dashboard'
import DashboardHome from './components/DashboardHome'

export default async function DashboardPage() {
  const { supabase, user, companyId } = await requireCompany()
  const { data, error } = await supabase.from('knowledge_base')
    .select('content').eq('company_id', companyId).maybeSingle()
  if (error) throw new Error('Не удалось загрузить базу знаний.')
  return <DashboardHome email={user.email ?? ''} companyId={companyId} initialContent={data?.content ?? ''} />
}
