import type { Metadata } from 'next'
import WidgetClient from './WidgetClient'

export const metadata: Metadata = {
  title: 'Консультант',
  robots: { index: false, follow: false },
}

// The embed URL is request-specific by design: it carries the tenant UUID and
// source page. A static shell would have no useful widget content to render.
export const instant = false

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string | string[]; page?: string | string[] }>
}) {
  const params = await searchParams
  const companyId = typeof params.companyId === 'string' ? params.companyId : ''
  const sourcePage = typeof params.page === 'string' ? params.page : ''
  const validCompanyId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(companyId)

  return <WidgetClient companyId={validCompanyId ? companyId : ''} sourcePage={sourcePage} />
}
