export const STATUS_IDS = ['wishlist', 'applied', 'followup', 'interview', 'offer', 'rejected'] as const

export type JobStatus = (typeof STATUS_IDS)[number]
export type Priority = 'low' | 'medium' | 'high'

export interface Job {
  id: string
  company: string
  role: string
  linkedinUrl?: string
  resumeUsed?: string
  dateApplied: string
  salaryRange?: string
  notes?: string
  status: JobStatus
  createdAt: string
  updatedAt: string
  contactName?: string
  followUpDate?: string
  priority?: Priority
  tags?: string[]
}

export type JobDraft = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>