import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { emptyBartenderProfile, emptyEmployerProfile, quizCooldown } from '../lib/profile'
import { loadData, resetData, saveData, uid } from '../lib/storage'
import type {
  AppData,
  Application,
  ApplicationStatus,
  BartenderProfile,
  EmployerProfile,
  Job,
  JobStatus,
  Role,
  User,
} from '../types'

const SESSION_KEY = 'crewbar_session'

interface AppContextValue {
  data: AppData
  currentUser: User | null
  bartenderProfile: BartenderProfile | undefined
  employerProfile: EmployerProfile | undefined
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  register: (input: {
    name: string
    email: string
    password: string
    role: Role
  }) => { ok: boolean; error?: string }
  updateBartenderProfile: (patch: Partial<BartenderProfile>) => void
  updateEmployerProfile: (patch: Partial<EmployerProfile>) => void
  createJob: (job: Omit<Job, 'id' | 'employerId' | 'createdAt' | 'status'>) => Job
  updateJobStatus: (jobId: string, status: JobStatus) => void
  applyToJob: (jobId: string) => { ok: boolean; error?: string }
  selectApplicant: (applicationId: string) => { ok: boolean; error?: string }
  rejectApplicant: (applicationId: string) => void
  setQuizResult: (score: number, badge: string) => void
  resetDemo: () => void
  getUser: (id: string) => User | undefined
  getBartender: (userId: string) => BartenderProfile | undefined
  getEmployer: (userId: string) => EmployerProfile | undefined
  getJobApplications: (jobId: string) => Application[]
  getMyApplications: () => Application[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  )

  useEffect(() => {
    saveData(data)
  }, [data])

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === sessionId) ?? null,
    [data.users, sessionId]
  )

  const bartenderProfile = useMemo(
    () =>
      currentUser?.role === 'bartender'
        ? data.bartenderProfiles.find((p) => p.userId === currentUser.id)
        : undefined,
    [currentUser, data.bartenderProfiles]
  )

  const employerProfile = useMemo(
    () =>
      currentUser?.role === 'employer'
        ? data.employerProfiles.find((p) => p.userId === currentUser.id)
        : undefined,
    [currentUser, data.employerProfiles]
  )

  const persistSession = (id: string | null) => {
    setSessionId(id)
    if (id) localStorage.setItem(SESSION_KEY, id)
    else localStorage.removeItem(SESSION_KEY)
  }

  const login = useCallback(
    (email: string, password: string) => {
      const user = data.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (!user || user.password !== password) {
        return { ok: false, error: 'E-mail ou senha incorretos' }
      }
      persistSession(user.id)
      return { ok: true }
    },
    [data.users]
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [])

  const register = useCallback(
    (input: { name: string; email: string; password: string; role: Role }) => {
      const email = input.email.trim().toLowerCase()
      if (!input.name.trim() || !email || !input.password) {
        return { ok: false, error: 'Preencha todos os campos' }
      }
      if (data.users.some((u) => u.email.toLowerCase() === email)) {
        return { ok: false, error: 'E-mail já cadastrado' }
      }
      const id = uid('user')
      const user: User = {
        id,
        email,
        password: input.password,
        role: input.role,
        name: input.name.trim(),
        createdAt: new Date().toISOString(),
      }
      setData((prev) => {
        const next = { ...prev, users: [...prev.users, user] }
        if (input.role === 'bartender') {
          next.bartenderProfiles = [
            ...prev.bartenderProfiles,
            emptyBartenderProfile(id),
          ]
        } else {
          next.employerProfiles = [
            ...prev.employerProfiles,
            emptyEmployerProfile(id),
          ]
        }
        return next
      })
      persistSession(id)
      return { ok: true }
    },
    [data.users]
  )

  const updateBartenderProfile = useCallback(
    (patch: Partial<BartenderProfile>) => {
      if (!currentUser || currentUser.role !== 'bartender') return
      setData((prev) => {
        const exists = prev.bartenderProfiles.some(
          (p) => p.userId === currentUser.id
        )
        if (!exists) {
          return {
            ...prev,
            bartenderProfiles: [
              ...prev.bartenderProfiles,
              { ...emptyBartenderProfile(currentUser.id), ...patch },
            ],
          }
        }
        return {
          ...prev,
          bartenderProfiles: prev.bartenderProfiles.map((p) =>
            p.userId === currentUser.id ? { ...p, ...patch } : p
          ),
        }
      })
    },
    [currentUser]
  )

  const updateEmployerProfile = useCallback(
    (patch: Partial<EmployerProfile>) => {
      if (!currentUser || currentUser.role !== 'employer') return
      setData((prev) => {
        const exists = prev.employerProfiles.some(
          (p) => p.userId === currentUser.id
        )
        if (!exists) {
          return {
            ...prev,
            employerProfiles: [
              ...prev.employerProfiles,
              { ...emptyEmployerProfile(currentUser.id), ...patch },
            ],
          }
        }
        return {
          ...prev,
          employerProfiles: prev.employerProfiles.map((p) =>
            p.userId === currentUser.id ? { ...p, ...patch } : p
          ),
        }
      })
    },
    [currentUser]
  )

  const createJob = useCallback(
    (job: Omit<Job, 'id' | 'employerId' | 'createdAt' | 'status'>) => {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Somente empregador')
      }
      const created: Job = {
        ...job,
        id: uid('job'),
        employerId: currentUser.id,
        status: 'open',
        createdAt: new Date().toISOString(),
      }
      setData((prev) => ({ ...prev, jobs: [created, ...prev.jobs] }))
      return created
    },
    [currentUser]
  )

  const updateJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setData((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
    }))
  }, [])

  const applyToJob = useCallback(
    (jobId: string) => {
      if (!currentUser || currentUser.role !== 'bartender') {
        return { ok: false, error: 'Somente bartenders' }
      }
      const job = data.jobs.find((j) => j.id === jobId)
      if (!job || job.status !== 'open') {
        return { ok: false, error: 'Vaga indisponível' }
      }
      if (
        data.applications.some(
          (a) => a.jobId === jobId && a.bartenderId === currentUser.id
        )
      ) {
        return { ok: false, error: 'Você já se candidatou a esta vaga' }
      }
      const app: Application = {
        id: uid('app'),
        jobId,
        bartenderId: currentUser.id,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      }
      setData((prev) => ({
        ...prev,
        applications: [...prev.applications, app],
      }))
      return { ok: true }
    },
    [currentUser, data.jobs, data.applications]
  )

  const selectApplicant = useCallback(
    (applicationId: string) => {
      if (!currentUser || currentUser.role !== 'employer') {
        return { ok: false, error: 'Somente empregador' }
      }
      const application = data.applications.find((a) => a.id === applicationId)
      if (!application) return { ok: false, error: 'Candidatura não encontrada' }
      const job = data.jobs.find((j) => j.id === application.jobId)
      if (!job || job.employerId !== currentUser.id) {
        return { ok: false, error: 'Vaga não encontrada' }
      }
      const selectedCount = data.applications.filter(
        (a) => a.jobId === job.id && a.status === 'selected'
      ).length
      if (selectedCount >= job.slots) {
        return { ok: false, error: 'Todas as vagas já foram preenchidas' }
      }
      const now = new Date().toISOString()
      setData((prev) => {
        const apps = prev.applications.map((a) =>
          a.id === applicationId
            ? { ...a, status: 'selected' as ApplicationStatus, selectedAt: now }
            : a
        )
        const newSelected = apps.filter(
          (a) => a.jobId === job.id && a.status === 'selected'
        ).length
        const jobs = prev.jobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: (newSelected >= j.slots ? 'filled' : j.status) as JobStatus,
              }
            : j
        )
        return { ...prev, applications: apps, jobs }
      })
      return { ok: true }
    },
    [currentUser, data.applications, data.jobs]
  )

  const rejectApplicant = useCallback((applicationId: string) => {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === applicationId ? { ...a, status: 'rejected' as const } : a
      ),
    }))
  }, [])

  const setQuizResult = useCallback(
    (score: number, badge: string) => {
      if (!currentUser || currentUser.role !== 'bartender') return
      if (!quizCooldown(bartenderProfile?.quizAttemptAt).canStart) return
      updateBartenderProfile({
        quizScore: score,
        quizBadge: badge,
        quizAttemptAt: new Date().toISOString(),
      })
    },
    [bartenderProfile?.quizAttemptAt, currentUser, updateBartenderProfile]
  )

  const resetDemo = useCallback(() => {
    const seed = resetData()
    setData(seed)
    persistSession(null)
  }, [])

  const getUser = useCallback(
    (id: string) => data.users.find((u) => u.id === id),
    [data.users]
  )
  const getBartender = useCallback(
    (userId: string) => data.bartenderProfiles.find((p) => p.userId === userId),
    [data.bartenderProfiles]
  )
  const getEmployer = useCallback(
    (userId: string) => data.employerProfiles.find((p) => p.userId === userId),
    [data.employerProfiles]
  )
  const getJobApplications = useCallback(
    (jobId: string) => {
      return data.applications
        .filter((a) => a.jobId === jobId)
        .slice()
        .sort((a, b) => {
          const scoreA = getBartender(a.bartenderId)?.quizScore ?? -1
          const scoreB = getBartender(b.bartenderId)?.quizScore ?? -1
          if (scoreB !== scoreA) return scoreB - scoreA
          return a.appliedAt.localeCompare(b.appliedAt)
        })
    },
    [data.applications, getBartender]
  )
  const getMyApplications = useCallback(() => {
    if (!currentUser) return []
    return data.applications
      .filter((a) => a.bartenderId === currentUser.id)
      .slice()
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
  }, [currentUser, data.applications])

  const value: AppContextValue = {
    data,
    currentUser,
    bartenderProfile,
    employerProfile,
    login,
    logout,
    register,
    updateBartenderProfile,
    updateEmployerProfile,
    createJob,
    updateJobStatus,
    applyToJob,
    selectApplicant,
    rejectApplicant,
    setQuizResult,
    resetDemo,
    getUser,
    getBartender,
    getEmployer,
    getJobApplications,
    getMyApplications,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp fora do AppProvider')
  return ctx
}

