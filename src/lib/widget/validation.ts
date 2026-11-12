import { z } from 'zod'

const uuid = z.string().uuid()
const message = z.string().trim().min(1).max(1200)

export const chatRequestSchema = z.object({
  companyId: uuid,
  message,
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(1200),
  })).max(10).default([]),
})

export const leadRequestSchema = z.object({
  companyId: uuid,
  name: z.string().trim().max(120).default(''),
  contact: z.string().trim().min(3).max(200),
  message: z.string().trim().max(2000).default(''),
  sourcePage: z.string().trim().max(2000).refine(value => {
    if (!value) return true
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Некорректный адрес страницы.').default(''),
})

export function splitContact(contact: string) {
  const value = contact.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { email: value }
  if (/^@[a-zA-Z0-9_]{3,32}$/.test(value)) return { telegram: value }
  return { phone: value }
}
