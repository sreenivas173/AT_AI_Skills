import { deleteDB, openDB, type DBSchema } from 'idb'
import type { Job } from '../types/job'

interface JobSchema extends DBSchema {
  jobs: {
    key: string
    value: Job
    indexes: { status: string; company: string; dateApplied: string }
  }
}

const database = openDB<JobSchema>('job-tracker', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('jobs')) {
      const store = db.createObjectStore('jobs', { keyPath: 'id' })
      store.createIndex('status', 'status')
      store.createIndex('company', 'company')
      store.createIndex('dateApplied', 'dateApplied')
    }
  },
})

export const getJobs = async () => (await database).getAll('jobs')
export const putJob = async (job: Job) => (await database).put('jobs', job)
export const removeJob = async (id: string) => (await database).delete('jobs', id)
export const replaceJobs = async (jobs: Job[]) => {
  const db = await database
  const tx = db.transaction('jobs', 'readwrite')
  await tx.store.clear()
  await Promise.all(jobs.map((job) => tx.store.put(job)))
  await tx.done
}
export const mergeJobs = async (jobs: Job[]) => Promise.all(jobs.map(putJob))
export const closeDatabase = () => database.then((db) => db.close())
void deleteDB