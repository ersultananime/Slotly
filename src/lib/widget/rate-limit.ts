type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

export function takeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  if (buckets.size > 5000) {
    for (const [bucketKey, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(bucketKey)
    }
  }
  return { allowed: true, retryAfterSeconds: 0 }
}

export function requestAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown'
}
