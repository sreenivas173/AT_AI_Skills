import type { JobStatus } from '../types/job'

export const STATUS_COLUMNS: Array<{ id: JobStatus; label: string; accent: string; soft: string }> = [
  { id: 'wishlist', label: 'Wishlist', accent: '#8b5cf6', soft: '#ede9fe' },
  { id: 'applied', label: 'Applied', accent: '#2563eb', soft: '#dbeafe' },
  { id: 'followup', label: 'Follow-up', accent: '#d97706', soft: '#fef3c7' },
  { id: 'interview', label: 'Interview', accent: '#0891b2', soft: '#cffafe' },
  { id: 'offer', label: 'Offer', accent: '#16a34a', soft: '#dcfce7' },
  { id: 'rejected', label: 'Rejected', accent: '#dc2626', soft: '#fee2e2' },
]

export const today = () => new Date().toISOString().slice(0, 10)