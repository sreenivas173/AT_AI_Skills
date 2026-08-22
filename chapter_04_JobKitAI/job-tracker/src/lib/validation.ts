import { STATUS_IDS, type Job, type JobDraft } from '../types/job'

export type FormErrors = Partial<Record<'company' | 'role' | 'linkedinUrl', string>>

export function validateDraft(draft: JobDraft): FormErrors {
  const errors: FormErrors = {}
  if (!draft.company.trim()) errors.company = 'Company is required'
  if (!draft.role.trim()) errors.role = 'Role is required'
  if (draft.linkedinUrl && !isValidUrl(draft.linkedinUrl)) errors.linkedinUrl = 'Enter a valid LinkedIn URL'
  return errors
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeImported(value: unknown): Job[] {
  if (!Array.isArray(value)) throw new Error('Import must be a JSON array')
  const now = new Date().toISOString()
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Record ${index + 1} is invalid`)
    const record = item as Record<string, unknown>
    if (typeof record.company !== 'string' || typeof record.role !== 'string') throw new Error(`Record ${index + 1} needs company and role`)
    const status = typeof record.status === 'string' && STATUS_IDS.includes(record.status as never) ? record.status : 'wishlist'
    return {
      ...record,
      id: typeof record.id === 'string' ? record.id : crypto.randomUUID(),
      company: record.company.trim(),
      role: record.role.trim(),
      status,
      dateApplied: typeof record.dateApplied === 'string' ? record.dateApplied : now.slice(0, 10),
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : now,
      updatedAt: now,
    } as Job
  })
}