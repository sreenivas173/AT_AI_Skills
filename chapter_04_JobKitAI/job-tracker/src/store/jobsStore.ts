import { create } from 'zustand'
import { getJobs, mergeJobs, putJob, removeJob, replaceJobs } from '../lib/db'
import type { Job, JobDraft, JobStatus } from '../types/job'

interface JobsState {
  jobs: Job[]
  loading: boolean
  error?: string
  load: () => Promise<void>
  add: (draft: JobDraft) => Promise<Job>
  update: (id: string, draft: JobDraft) => Promise<void>
  move: (id: string, status: JobStatus) => Promise<void>
  remove: (id: string) => Promise<Job | undefined>
  restore: (job: Job) => Promise<void>
  importJobs: (jobs: Job[], mode: 'merge' | 'replace') => Promise<void>
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [], loading: true,
  load: async () => {
    try { set({ jobs: await getJobs(), loading: false }) } catch { set({ loading: false, error: 'Could not open local storage' }) }
  },
  add: async (draft) => {
    const now = new Date().toISOString()
    const job = { ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
    set((state) => ({ jobs: [...state.jobs, job] }))
    await putJob(job)
    return job
  },
  update: async (id, draft) => {
    const current = get().jobs.find((job) => job.id === id)
    if (!current) return
    const job = { ...current, ...draft, updatedAt: new Date().toISOString() }
    set((state) => ({ jobs: state.jobs.map((item) => item.id === id ? job : item) }))
    await putJob(job)
  },
  move: async (id, status) => get().update(id, { ...get().jobs.find((job) => job.id === id), status } as JobDraft),
  remove: async (id) => {
    const job = get().jobs.find((item) => item.id === id)
    set((state) => ({ jobs: state.jobs.filter((item) => item.id !== id) }))
    await removeJob(id)
    return job
  },
  restore: async (job) => { set((state) => ({ jobs: [...state.jobs, job] })); await putJob(job) },
  importJobs: async (jobs, mode) => {
    set({ jobs: mode === 'replace' ? jobs : [...get().jobs.filter((old) => !jobs.some((item) => item.id === old.id)), ...jobs] })
    if (mode === 'replace') await replaceJobs(jobs)
    else await mergeJobs(jobs)
  },
}))