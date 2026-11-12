export async function readJson(request: Request, maxBytes = 32 * 1024): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError('Слишком большой запрос.', 413)
  }

  const reader = request.body?.getReader()
  if (!reader) throw new RequestBodyError('Пустой запрос.', 400)

  const chunks: Uint8Array[] = []
  let bytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.byteLength
    if (bytes > maxBytes) {
      await reader.cancel()
      throw new RequestBodyError('Слишком большой запрос.', 413)
    }
    chunks.push(value)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new RequestBodyError('Не удалось прочитать запрос.', 400)
  }
}

export class RequestBodyError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
