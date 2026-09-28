export type Role = 'bartender' | 'employer'

export type JobStatus = 'open' | 'filled' | 'closed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'selected' | 'rejected' | 'withdrawn'

export interface User {
  id: string
  email: string
  password: string
  role: Role
  name: string
  createdAt: string
}

export interface BartenderProfile {
  userId: string
  photo: string
  bio: string
  city: string
  experience: string
  skills: string[]
  phone: string
  whatsapp: string
  quizScore: number | null
  quizBadge: string | null
  quizAttemptAt: string | null
}

export interface EmployerProfile {
  userId: string
  houseName: string
  city: string
  type: string
}

export interface Job {
  id: string
  employerId: string
  title: string
  date: string
  time: string
  city: string
  pay: number
  slots: number
  requirements: string
  description: string
  status: JobStatus
  createdAt: string
}

export interface Application {
  id: string
  jobId: string
  bartenderId: string
  status: ApplicationStatus
  appliedAt: string
  selectedAt?: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

export interface AppData {
  users: User[]
  bartenderProfiles: BartenderProfile[]
  employerProfiles: EmployerProfile[]
  jobs: Job[]
  applications: Application[]
  seeded: boolean
}

export type QuizBadge = 'Excelente' | 'Bom' | 'Regular' | 'Iniciante'
