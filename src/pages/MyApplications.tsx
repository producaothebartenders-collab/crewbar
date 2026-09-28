import { Link } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import { APP_STATUS_LABEL, formatBRL, formatDateBR, JOB_STATUS_LABEL } from '../lib/profile'

export default function MyApplications() {
  const { getMyApplications, data, getEmployer } = useApp()
  const apps = getMyApplications()

  return (
    <Shell>
      <h1 className="page-title">Minhas candidaturas</h1>
      <p className="page-sub">Acompanhe o status das vagas.</p>
      {apps.length === 0 && <div className="empty">Você ainda não se candidatou.</div>}
      {apps.map((app) => {
        const job = data.jobs.find((j) => j.id === app.jobId)
        if (!job) return null
        const house = getEmployer(job.employerId)
        return (
          <Link key={app.id} to={`/vaga/${job.id}`} className="card" style={{ display: 'block' }}>
            <div className="row space-between">
              <h2 className="card-title">{job.title}</h2>
              <span className="badge">{APP_STATUS_LABEL[app.status]}</span>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              {house?.houseName} · {formatDateBR(job.date)} · {formatBRL(job.pay)}
            </p>
            <div className="muted" style={{ marginTop: 6 }}>
              Vaga: {JOB_STATUS_LABEL[job.status]}
              {app.status === 'selected' && ' · Contato liberado para o empregador'}
            </div>
          </Link>
        )
      })}
    </Shell>
  )
}
