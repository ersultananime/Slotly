import assert from 'node:assert/strict'
import test from 'node:test'
import { chatRequestSchema, leadRequestSchema, splitContact } from './validation.ts'

const companyId = '09672335-a478-4e32-b802-d0e925777651'

test('chat request accepts a bounded conversation', () => {
  const result = chatRequestSchema.safeParse({
    companyId,
    message: 'Сколько стоит услуга?',
    history: [{ role: 'assistant', content: 'Здравствуйте!' }],
  })
  assert.equal(result.success, true)
})

test('chat request rejects invalid tenant and oversized messages', () => {
  assert.equal(chatRequestSchema.safeParse({ companyId: 'wrong', message: 'Вопрос' }).success, false)
  assert.equal(chatRequestSchema.safeParse({ companyId, message: 'x'.repeat(1201) }).success, false)
})

test('lead request requires an explicit contact', () => {
  assert.equal(leadRequestSchema.safeParse({ companyId, contact: '' }).success, false)
  assert.equal(leadRequestSchema.safeParse({ companyId, contact: '@visitor' }).success, true)
  assert.equal(leadRequestSchema.safeParse({ companyId, contact: '@visitor', sourcePage: 'javascript:alert(1)' }).success, false)
  assert.equal(leadRequestSchema.safeParse({ companyId, contact: '@visitor', sourcePage: 'https://example.com/page' }).success, true)
})

test('contact is mapped to the extended production schema', () => {
  assert.deepEqual(splitContact('person@example.com'), { email: 'person@example.com' })
  assert.deepEqual(splitContact('@visitor'), { telegram: '@visitor' })
  assert.deepEqual(splitContact('+7 700 000 00 00'), { phone: '+7 700 000 00 00' })
})
