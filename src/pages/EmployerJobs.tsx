import { Link } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import { formatBRL, formatDateBR, JOB_STATUS_LABEL } from '../lib/profile'

export default function EmployerJobs() {
  const { data, currentUser, employerProfile, getJobApplications } = useApp()
  const jobs = data.jobs
    .filter((j) => j.employerId === currentUser?.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Shell>
      <h1 className="page-title">
        {employerProfile?.houseName || 'Minhas vagas'}
      </h1>
      <p className="page-sub">Gerencie candidaturas e selecione bartenders.</p>

      {!employerProfile?.houseName && (
        <div className="alert info">
          Complete o perfil da casa para atrair mais candidatos.{' '}
          <Link to="/casa">Editar casa</Link>
        </div>
      )}

      <Link to="/nova-vaga" className="btn btn-primary btn-block" style={{ marginBottom: 16 }}>
        + Nova vaga (grátis)
      </Link>

      <p className="muted" style={{ marginBottom: 12 }}>
        Impulsionar vaga <span className="tag-em-breve">em breve</span> — sem pagamentos neste MVP.
      </p>

      {jobs.length === 0 && (
        <div className="empty">Você ainda não publicou vagas.</div>
      )}

      {jobs.map((job) => {
        const apps = getJobApplications(job.id)
        const selected = apps.filter((a) => a.status === 'selected').length
        return (
          <Link key={job.id} to={`/vaga/${job.id}`} className="card" style={{ display: 'block' }}>
            <div className="row space-between">
              <h2 className="card-title">{job.title}</h2>
              <span className="badge">{JOB_STATUS_LABEL[job.status]}</span>
            </div>
            <p className="muted" style={{ margin: '0 0 8px' }}>
              {formatDateBR(job.date)} · {job.time} · {formatBRL(job.pay)}
            </p>
            <div className="row space-between">
              <span className="muted">
                {apps.length} candidato(s) · {selected}/{job.slots} selecionado(s)
              </span>
              <span className="badge">{job.city}</span>
            </div>
          </Link>
        )
      })}
    </Shell>
  )
}
