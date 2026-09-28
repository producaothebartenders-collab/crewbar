import type { AppData } from '../types'

const PLACEHOLDER_PHOTO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect fill="#1a1a1a" width="200" height="200"/>
      <circle cx="100" cy="75" r="35" fill="#C8F542"/>
      <ellipse cx="100" cy="160" rx="55" ry="40" fill="#C8F542"/>
      <text x="100" y="195" text-anchor="middle" fill="#666" font-size="10" font-family="sans-serif">demo</text>
    </svg>`
  )

export function createSeedData(): AppData {
  const now = new Date().toISOString()
  const employerId = 'user-emp-1'
  const bt1 = 'user-bt-1'
  const bt2 = 'user-bt-2'
  const job1 = 'job-1'
  const job2 = 'job-2'

  return {
    seeded: true,
    users: [
      {
        id: employerId,
        email: 'empregador@crewbar.demo',
        password: 'demo123',
        role: 'employer',
        name: 'Carlos Mendes',
        createdAt: now,
      },
      {
        id: bt1,
        email: 'ana@crewbar.demo',
        password: 'demo123',
        role: 'bartender',
        name: 'Ana Souza',
        createdAt: now,
      },
      {
        id: bt2,
        email: 'bruno@crewbar.demo',
        password: 'demo123',
        role: 'bartender',
        name: 'Bruno Lima',
        createdAt: now,
      },
    ],
    employerProfiles: [
      {
        userId: employerId,
        houseName: 'Bar do Centro',
        city: 'São Paulo',
        type: 'Bar',
      },
    ],
    bartenderProfiles: [
      {
        userId: bt1,
        photo: PLACEHOLDER_PHOTO,
        bio: 'Bartender com foco em clássicos e atendimento VIP. Experiência em rooftops e casamentos.',
        city: 'São Paulo',
        experience: '3–5 anos',
        skills: ['Coquetelaria clássica', 'Eventos / casamentos', 'Atendimento VIP', 'Inglês'],
        phone: '11999887766',
        whatsapp: '5511999887766',
        quizScore: 93,
        quizBadge: 'Excelente',
        quizAttemptAt: now,
      },
      {
        userId: bt2,
        photo: PLACEHOLDER_PHOTO,
        bio: 'Bar de alto volume e mocktails. Pontual e organizado.',
        city: 'São Paulo',
        experience: '1–2 anos',
        skills: ['Bar de alto volume', 'Mocktails / zero álcool', 'Montagem de bar'],
        phone: '11988776655',
        whatsapp: '5511988776655',
        quizScore: 80,
        quizBadge: 'Bom',
        quizAttemptAt: now,
      },
    ],
    jobs: [
      {
        id: job1,
        employerId,
        title: 'Bartender — Sexta no rooftop',
        date: '2026-10-03',
        time: '18:00–01:00',
        city: 'São Paulo',
        pay: 350,
        slots: 2,
        requirements: 'Experiência com clássicos; apresentação impecável; inglês diferencial.',
        description:
          'Serviço de bar em rooftop com carta curta de clássicos e mocktails. Uniforme preto; chegada 30 min antes.',
        status: 'open',
        createdAt: now,
      },
      {
        id: job2,
        employerId,
        title: 'Bartender — Casamento (open bar)',
        date: '2026-10-11',
        time: '16:00–23:00',
        city: 'São Paulo',
        pay: 450,
        slots: 1,
        requirements: 'Eventos; coquetelaria clássica; postura e pontualidade.',
        description:
          'Open bar para 120 convidados. Drinks: gin tônica, aperol, caipirinhas e 2 assinaturas. Inclui montagem.',
        status: 'open',
        createdAt: now,
      },
    ],
    applications: [],
  }
}
