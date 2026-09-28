import { createSeedData } from '../data/seed'
import type { AppData } from '../types'

const KEY = 'crewbar_mvp_v1'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const seed = createSeedData()
      localStorage.setItem(KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.seeded) {
      const seed = createSeedData()
      localStorage.setItem(KEY, JSON.stringify(seed))
      return seed
    }
    return parsed
  } catch {
    const seed = createSeedData()
    localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function resetData(): AppData {
  const seed = createSeedData()
  localStorage.setItem(KEY, JSON.stringify(seed))
  localStorage.removeItem('crewbar_session')
  return seed
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
