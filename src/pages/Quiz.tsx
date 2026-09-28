import { useMemo, useState } from 'react'
import { Shell } from '../components/Layout'
import { badgeFromScore, QUIZ_QUESTIONS, scoreFromAnswers } from '../data/quiz'
import { useApp } from '../context/AppContext'
import { badgeColor } from '../lib/profile'

export default function QuizPage() {
  const { bartenderProfile, setQuizResult } = useApp()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(QUIZ_QUESTIONS.length).fill(null)
  )
  const [finished, setFinished] = useState(false)

  const score = useMemo(() => scoreFromAnswers(answers), [answers])
  const badge = useMemo(() => badgeFromScore(score), [score])
  const q = QUIZ_QUESTIONS[index]

  const select = (opt: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = opt
      return next
    })
  }

  const next = () => {
    if (index < QUIZ_QUESTIONS.length - 1) setIndex(index + 1)
    else {
      setFinished(true)
      setQuizResult(scoreFromAnswers(answers), badgeFromScore(scoreFromAnswers(answers)))
    }
  }

  const retake = () => {
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null))
    setIndex(0)
    setFinished(false)
    setStarted(true)
  }

  if (!started && !finished) {
    return (
      <Shell>
        <h1 className="page-title">Quiz de conhecimento</h1>
        <p className="page-sub">
          15 perguntas de clássicos, técnica e atendimento. Uma tentativa por vez — pode refazer
          depois de ver o resultado.
        </p>
        {bartenderProfile?.quizScore != null && (
          <div className="card">
            <strong>Último resultado</strong>
            <div style={{ marginTop: 8, fontSize: '1.4rem', fontWeight: 800 }}>
              {bartenderProfile.quizScore}%
            </div>
            <span
              className="badge"
              style={{ color: badgeColor(bartenderProfile.quizBadge), marginTop: 8 }}
            >
              {bartenderProfile.quizBadge}
            </span>
          </div>
        )}
        <button type="button" className="btn btn-primary btn-block" onClick={() => setStarted(true)}>
          {bartenderProfile?.quizScore != null ? 'Refazer quiz' : 'Começar'}
        </button>
      </Shell>
    )
  }

  if (finished) {
    return (
      <Shell>
        <h1 className="page-title">Resultado</h1>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#C8F542' }}>{score}%</div>
          <div
            style={{
              marginTop: 8,
              fontSize: '1.2rem',
              fontWeight: 800,
              color: badgeColor(badge),
            }}
          >
            {badge}
          </div>
          <p className="muted">
            Excelente 90+ · Bom 75–89 · Regular 60–74 · Iniciante &lt;60
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={retake}>
          Refazer agora
        </button>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="row space-between" style={{ marginBottom: 8 }}>
        <span className="muted">
          Pergunta {index + 1} de {QUIZ_QUESTIONS.length}
        </span>
        <span className="badge">{Math.round(((index + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <span style={{ width: `${((index + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>
      <h1 className="page-title" style={{ fontSize: '1.15rem' }}>
        {q.question}
      </h1>
      <div className="stack">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            className={`quiz-option${answers[index] === i ? ' selected' : ''}`}
            onClick={() => select(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-block"
        style={{ marginTop: 16 }}
        disabled={answers[index] == null}
        onClick={next}
      >
        {index === QUIZ_QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima'}
      </button>
    </Shell>
  )
}
