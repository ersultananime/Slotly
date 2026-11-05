import Link from 'next/link'
import { Users } from 'lucide-react'
import { requireCompany } from '@/lib/dashboard'

type Lead = {
  id: string
  name: string | null
  contact: string | null
  message: string | null
  status: string | null
  created_at: string
}

const statuses: Record<string, { label: string; style: string }> = {
  new: { label: 'Новый', style: 'bg-blue-50 text-blue-700' },
  in_progress: { label: 'В работе', style: 'bg-amber-50 text-amber-800' },
  done: { label: 'Завершён', style: 'bg-emerald-50 text-emerald-700' },
  spam: { label: 'Спам', style: 'bg-slate-100 text-slate-600' },
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { supabase, companyId } = await requireCompany()
  const params = await searchParams
  const requestedPage = Number(params.page ?? 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1
  const pageSize = 50
  const { data, error, count } = await supabase.from('leads')
    .select('id, name, contact, message, status, created_at', { count: 'exact' })
    .eq('company_id', companyId)
    .order('created_at', { ascending: false }).order('id', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)
  if (error) throw new Error('Не удалось загрузить лиды.')
  const leads = (data ?? []) as Lead[]
  const dateFormat = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Qyzylorda',
  })

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
    <Link href="/dashboard" className="text-sm font-semibold text-blue-700 hover:underline">← Личный кабинет</Link>
    <h1 className="mt-6 text-3xl font-extrabold text-slate-900">Собранные лиды</h1>
    <p className="mt-2 text-sm text-slate-500">Контакты посетителей вашего сайта. Время указано по Казахстану (UTC+5).</p>
    {leads.length === 0 ? <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <Users className="mx-auto h-12 w-12 text-blue-500" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold">{page === 1 ? 'Пока нет собранных лидов' : 'На этой странице нет лидов'}</h2>
      <p className="mt-2 text-sm text-slate-500">{page === 1 ? 'Подключите виджет — здесь появятся обращения ваших клиентов.' : 'Вернитесь к предыдущей странице.'}</p>
      <Link href={page === 1 ? '/dashboard#widget-code' : '/dashboard/leads'} className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
        {page === 1 ? 'Подключить виджет' : 'К первой странице'}
      </Link>
    </section> : <>
      <div tabIndex={0} role="region" aria-label="Таблица собранных лидов" className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Обращения клиентов, сначала новые</caption>
          <thead className="bg-slate-50 text-slate-600"><tr>{['Имя', 'Контакты', 'Сообщение', 'Дата', 'Статус'].map(title => <th key={title} scope="col" className="px-5 py-4 font-semibold">{title}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{leads.map(lead => {
            const status = statuses[lead.status ?? '']
            const date = new Date(lead.created_at)
            return <tr key={lead.id} className="align-top hover:bg-slate-50">
              <td className="max-w-48 break-words px-5 py-4 font-semibold">{lead.name || 'Без имени'}</td>
              <td className="max-w-56 break-words px-5 py-4">{lead.contact || '—'}</td>
              <td className="min-w-56 max-w-md whitespace-pre-wrap break-words px-5 py-4">{lead.message || '—'}</td>
              <td className="whitespace-nowrap px-5 py-4">{Number.isNaN(date.getTime()) ? '—' : <time dateTime={lead.created_at}>{dateFormat.format(date)}</time>}</td>
              <td className="px-5 py-4"><span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status?.style ?? 'bg-slate-100 text-slate-600'}`}>{status?.label ?? lead.status ?? 'Не указан'}</span></td>
            </tr>
          })}</tbody>
        </table>
      </div>
      <nav aria-label="Страницы лидов" className="mt-5 flex items-center gap-5 text-sm text-blue-700">
        {page > 1 && <Link href={`/dashboard/leads?page=${page - 1}`}>← Назад</Link>}
        <span className="text-slate-600">Страница {page}</span>
        {page * pageSize < (count ?? 0) && <Link href={`/dashboard/leads?page=${page + 1}`}>Далее →</Link>}
      </nav>
    </>}
  </main>
}
