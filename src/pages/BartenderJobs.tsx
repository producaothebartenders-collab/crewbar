import { Link } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import {
  bartenderCompleteness,
  canApply,
  formatBRL,
  formatDateBR,
  JOB_STATUS_LABEL,
} from '../lib/profile'

export default function BartenderJobs() {
  const { data, currentUser, bartenderProfile, getEmployer, getUser } = useApp()
  const eligibility = canApply(bartenderProfile)
  const jobs = data.jobs
    .filter((j) => j.status === 'open')
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Shell>
      <h1 className="page-title">Olá, {currentUser?.name.split(' ')[0]}</h1>
      <p className="page-sub">Vagas abertas perto de você.</p>

      {!eligibility.ok && (
        <div className="alert info">
          Para se candidatar: {eligibility.reasons.join(' · ')}.
          <div style={{ marginTop: 8 }}>
            <Link to="/perfil">Completar perfil</Link>
            {' · '}
            <Link to="/quiz">Fazer quiz</Link>
          </div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <span style={{ width: `${bartenderCompleteness(bartenderProfile)}%` }} />
          </div>
        </div>
      )}

      {jobs.length === 0 && <div className="empty">Nenhuma vaga aberta no momento.</div>}

      {jobs.map((job) => {
        const house = getEmployer(job.employerId)
        const employer = getUser(job.employerId)
        const already = data.applications.some(
          (a) => a.jobId === job.id && a.bartenderId === currentUser?.id
        )
        return (
          <Link key={job.id} to={`/vaga/${job.id}`} className="card" style={{ display: 'block' }}>
            <div className="row space-between">
              <h2 className="card-title">{job.title}</h2>
              <span className="badge">{JOB_STATUS_LABEL[job.status]}</span>
            </div>
            <p className="muted" style={{ margin: '0 0 8px' }}>
              {house?.houseName || employer?.name} · {job.city}
            </p>
            <div className="meta-grid">
              <div className="meta-item">
                <div className="label">Data</div>
                <div className="value">{formatDateBR(job.date)}</div>
              </div>
              <div className="meta-item">
                <div className="label">Horário</div>
                <div className="value">{job.time}</div>
              </div>
              <div className="meta-item">
                <div className="label">Cache</div>
                <div className="value">{formatBRL(job.pay)}</div>
              </div>
              <div className="meta-item">
                <div className="label">Vagas</div>
                <div className="value">{job.slots}</div>
              </div>
            </div>
            {already && <span className="badge">Já candidatado</span>}
          </Link>
        )
      })}
    </Shell>
  )
}
