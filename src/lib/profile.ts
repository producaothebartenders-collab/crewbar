import type { BartenderProfile, EmployerProfile, QuizBadge } from '../types'

export function bartenderCompleteness(p: BartenderProfile | undefined): number {
  if (!p) return 0
  const checks = [
    Boolean(p.photo),
    Boolean(p.bio?.trim()),
    Boolean(p.city?.trim()),
    Boolean(p.experience?.trim()),
    (p.skills?.length ?? 0) >= 1,
    Boolean(p.phone?.trim() || p.whatsapp?.trim()),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function canApply(p: BartenderProfile | undefined): {
  ok: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  if (!p) return { ok: false, reasons: ['Complete seu perfil'] }
  const pct = bartenderCompleteness(p)
  if (pct < 70) reasons.push(`Perfil incompleto (${pct}% — mínimo 70%)`)
  if (!p.photo) reasons.push('Adicione uma foto')
  if (p.quizScore == null) reasons.push('Faça o quiz de conhecimento')
  return { ok: reasons.length === 0, reasons }
}

export function employerCompleteness(p: EmployerProfile | undefined): number {
  if (!p) return 0
  const checks = [
    Boolean(p.houseName?.trim()),
    Boolean(p.city?.trim()),
    Boolean(p.type?.trim()),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function emptyBartenderProfile(userId: string): BartenderProfile {
  return {
    userId,
    photo: '',
    bio: '',
    city: '',
    experience: '',
    skills: [],
    phone: '',
    whatsapp: '',
    quizScore: null,
    quizBadge: null,
    quizAttemptAt: null,
  }
}

export function emptyEmployerProfile(userId: string): EmployerProfile {
  return {
    userId,
    houseName: '',
    city: '',
    type: '',
  }
}

export function badgeColor(badge: QuizBadge | string | null | undefined): string {
  switch (badge) {
    case 'Excelente':
      return '#C8F542'
    case 'Bom':
      return '#8BC34A'
    case 'Regular':
      return '#FFC107'
    case 'Iniciante':
      return '#FF9800'
    default:
      return '#888'
  }
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDateBR(isoDate: string): string {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-')
  if (!y || !m || !d) return isoDate
  return `${d}/${m}/${y}`
}

export function waLink(whatsapp: string, message?: string): string {
  const digits = whatsapp.replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export const JOB_STATUS_LABEL: Record<string, string> = {
  open: 'Aberta',
  filled: 'Preenchida',
  closed: 'Encerrada',
  cancelled: 'Cancelada',
}

export const APP_STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  selected: 'Selecionado',
  rejected: 'Não selecionado',
  withdrawn: 'Cancelada',
}
