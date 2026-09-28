import type { QuizBadge, QuizQuestion } from '../types'

/** Perguntas oficiais CrewBar (fornecido por William) */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual dessas medidas possui maior quantidade?',
    options: ['Dash', 'Splash', 'Drop', 'Pinch'],
    correctIndex: 1, // Splash
  },
  {
    id: 2,
    question: 'Quanto mais gelo eu utilizo, maior a diluição.',
    options: ['Verdadeiro', 'Falso'],
    correctIndex: 1, // Falso
  },
  {
    id: 3,
    question: 'Quais desses paladares se equilibram entre si?',
    options: [
      'Doce com azedo (ou amargo)',
      'Doce com doce',
      'Salgado com salgado',
      'Azedo com azedo',
    ],
    correctIndex: 0,
  },
  {
    id: 4,
    question: 'Toda bebida destilada é previamente fermentada.',
    options: ['Verdadeiro', 'Falso'],
    correctIndex: 0, // Verdadeiro
  },
  {
    id: 5,
    question: 'Qual é a faixa média de teor alcoólico de uma bebida destilada?',
    options: ['5 a 12%', '15 a 25%', '38 a 45%', '60 a 80%'],
    correctIndex: 2, // 38 a 45%
  },
  {
    id: 6,
    question:
      'Bebidas mais escuras, como rum, whiskey e conhaque, possuem essa cor devido à matéria-prima utilizada.',
    options: ['Verdadeiro', 'Falso'],
    correctIndex: 1, // Falso (geralmente envelhecimento/carvalho etc.)
  },
  {
    id: 7,
    question: 'Todo licor possui álcool na composição.',
    options: ['Verdadeiro', 'Falso'],
    correctIndex: 0, // Verdadeiro
  },
  {
    id: 8,
    question: 'O que é um bitter?',
    options: [
      'Um tipo de cerveja clara',
      'Termo genérico para bebidas amargas',
      'Um soft drink cítrico',
      'Um destilado sem álcool',
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question:
      'Proporção que geralmente é utilizada para equilibrar um ingrediente mais doce e um mais cítrico:',
    options: ['70% doce / 30% cítrico', '50% / 50%', '90% / 10%', '30% doce / 70% cítrico'],
    correctIndex: 1, // 50% 50%
  },
  {
    id: 10,
    question: 'O que é um vermouth?',
    options: [
      'Um destilado de cana',
      'Um vinho fortificado e infusionado com herbáceos e outros ingredientes',
      'Um soft drink amargo',
      'Um licor de chocolate',
    ],
    correctIndex: 1,
  },
  {
    id: 11,
    question: 'O que é um soft drink?',
    options: [
      'Uma bebida alcoólica leve',
      'Uma bebida sem álcool e gaseificada',
      'Um shot de destilado',
      'Um vinho espumante',
    ],
    correctIndex: 1,
  },
  {
    id: 12,
    question:
      'Um coquetel montado é preparado diretamente no copo, sem que o conteúdo do mesmo seja mexido.',
    options: ['Verdadeiro', 'Falso'],
    correctIndex: 1, // Falso
  },
  {
    id: 13,
    question: 'Um coquetel mexido deve ser preparado em:',
    options: ['Shaker Boston', 'Mixing glass', 'Copo de serviço direto', 'Jigger'],
    correctIndex: 1, // mixing glass
  },
  {
    id: 14,
    question:
      'Identifique a família desse coquetel pela proporção de ingredientes: 50 ml de destilado, 30 ml de limão e 15 ml de açúcar.',
    options: ['Família highball', 'Família sour', 'Família old fashioned', 'Família punch'],
    correctIndex: 1, // sour
  },
  {
    id: 15,
    question:
      'Identifique a família desse coquetel pela proporção de ingredientes: 50 ml de destilado e 100 ml de soft drink.',
    options: ['Família sour', 'Família highball', 'Família fizz', 'Família cocktail'],
    correctIndex: 1, // highball
  },
]

export function badgeFromScore(score: number): QuizBadge {
  if (score >= 90) return 'Excelente'
  if (score >= 75) return 'Bom'
  if (score >= 60) return 'Regular'
  return 'Iniciante'
}

export function scoreFromAnswers(answers: (number | null)[]): number {
  let correct = 0
  QUIZ_QUESTIONS.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct += 1
  })
  return Math.round((correct / QUIZ_QUESTIONS.length) * 100)
}
