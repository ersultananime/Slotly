import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { requireCompany } from '@/lib/dashboard'

const maxBodyBytes = 256 * 1024

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return json({ error: 'Запрос отклонён. Обновите страницу и попробуйте снова.' }, 403)
  }

  try {
    const reader = request.body?.getReader()
    if (!reader) return json({ error: 'Введите информацию о компании.' }, 400)

    let bytes = 0
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > maxBodyBytes) {
        await reader.cancel()
        return json({ error: 'Текст слишком длинный.' }, 413)
      }
      chunks.push(value)
    }

    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!body || typeof body !== 'object' || !('content' in body) || typeof body.content !== 'string') {
      return json({ error: 'Введите информацию о компании.' }, 400)
    }
    const content = body.content.trim()
    if (!content || content.length > 50000) {
      return json({ error: 'Введите от 1 до 50 000 символов.' }, 400)
    }

    const { supabase, companyId } = await requireCompany()

    // Do not rely on a database UNIQUE constraint here. Some existing Slotly
    // projects were created before knowledge_base(company_id) became unique,
    // so PostgreSQL rejects an UPSERT with code 42P10 in those projects.
    const { data: existing, error: lookupError } = await supabase
      .from('knowledge_base')
      .select('id')
      .eq('company_id', companyId)
      .limit(1)
      .maybeSingle()

    let data: { id: string } | null = null
    let error = lookupError

    if (!lookupError) {
      const result = existing
        ? await supabase
            .from('knowledge_base')
            .update({ content })
            .eq('id', existing.id)
            .eq('company_id', companyId)
            .select('id')
            .single()
        : await supabase
            .from('knowledge_base')
            .insert({ company_id: companyId, content })
            .select('id')
            .single()

      data = result.data
      error = result.error
    }

    if (error || !data) {
      const reference = crypto.randomUUID()
      console.error('knowledge_base_save_failed', {
        reference,
        code: error?.code,
        message: error?.message,
      })
      return json({ error: `Не удалось сохранить базу знаний. Номер обращения: ${reference}.` }, 500)
    }

    revalidatePath('/dashboard')
    return json({ success: true })
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'Не удалось прочитать данные.' }, 400)
    throw error
  }
}
