import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import {
  canApply,
  formatBRL,
  formatDateBR,
  JOB_STATUS_LABEL,
  APP_STATUS_LABEL,
} from '../lib/profile'

export default function JobDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const {
    data,
    currentUser,
    bartenderProfile,
    applyToJob,
    getEmployer,
    getUser,
    getJobApplications,
    selectApplicant,
    rejectApplicant,
    updateJobStatus,
    getBartender,
  } = useApp()
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const job = data.jobs.find((j) => j.id === id)
  if (!job) {
    return (
      <Shell>
        <div className="empty">Vaga não encontrada.</div>
        <Link to="/home">Voltar</Link>
      </Shell>
    )
  }

  const house = getEmployer(job.employerId)
  const employer = getUser(job.employerId)
  const isOwner = currentUser?.id === job.employerId
  const isBartender = currentUser?.role === 'bartender'
  const myApp = data.applications.find(
    (a) => a.jobId === job.id && a.bartenderId === currentUser?.id
  )
  const eligibility = canApply(bartenderProfile)
  const applicants = isOwner ? getJobApplications(job.id) : []

  const onApply = () => {
    setErr('')
    setMsg('')
    if (!eligibility.ok) {
      setErr(eligibility.reasons.join(' · '))
      return
    }
    const res = applyToJob(job.id)
    if (!res.ok) setErr(res.error || 'Erro')
    else setMsg('Candidatura enviada!')
  }

  return (
    <Shell>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => nav(-1)}>
        ← Voltar
      </button>
      <h1 className="page-title">{job.title}</h1>
      <p className="page-sub">
        {house?.houseName || employer?.name} · {house?.type} · {job.city}
      </p>

      <div className="row wrap" style={{ marginBottom: 12 }}>
        <span className="badge">{JOB_STATUS_LABEL[job.status]}</span>
        <span className="badge warn">
          Impulsionar <span className="tag-em-breve">em breve</span>
        </span>
      </div>

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

      <div className="card">
        <h2 className="card-title">Descrição</h2>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.description}</p>
      </div>
      <div className="card">
        <h2 className="card-title">Requisitos</h2>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert success">{msg}</div>}

      {isBartender && job.status === 'open' && (
        <div className="stack">
          {myApp ? (
            <div className="alert info">
              Status da candidatura: <strong>{APP_STATUS_LABEL[myApp.status]}</strong>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={onApply}
              disabled={!eligibility.ok}
            >
              Candidatar-se
            </button>
          )}
          {!eligibility.ok && (
            <p className="muted">
              {eligibility.reasons.join(' · ')}. <Link to="/perfil">Completar perfil</Link>
            </p>
          )}
        </div>
      )}

      {isOwner && (
        <>
          <div className="divider" />
          <div className="row wrap" style={{ marginBottom: 12 }}>
            {job.status === 'open' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => updateJobStatus(job.id, 'closed')}
              >
                Encerrar vaga
              </button>
            )}
            {job.status !== 'cancelled' && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => updateJobStatus(job.id, 'cancelled')}
              >
                Cancelar
              </button>
            )}
          </div>

          <h2 className="page-title" style={{ fontSize: '1.15rem' }}>
            Candidatos ({applicants.length})
          </h2>
          <p className="page-sub">Ordenados por nota do quiz e depois por horário.</p>

          {applicants.length === 0 && <div className="empty">Ninguém se candidatou ainda.</div>}

          {applicants.map((app) => {
            const bt = getBartender(app.bartenderId)
            const user = getUser(app.bartenderId)
            const showContact = app.status === 'selected'
            return (
              <div key={app.id} className="card">
                <div className="row" style={{ gap: 12 }}>
                  {bt?.photo ? (
                    <img src={bt.photo} alt="" className="avatar" />
                  ) : (
                    <div className="avatar" />
                  )}
                  <div style={{ flex: 1 }}>
                    <div className="row space-between">
                      <strong>{user?.name}</strong>
                      <span className="badge">{APP_STATUS_LABEL[app.status]}</span>
                    </div>
                    <div className="muted">
                      {bt?.city} · {bt?.experience}
                    </div>
                    <div className="row wrap" style={{ marginTop: 6 }}>
                      <span className="badge">
                        Quiz {bt?.quizScore ?? '—'}% {bt?.quizBadge ? `· ${bt.quizBadge}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
                {bt?.bio && (
                  <p className="muted" style={{ marginTop: 10 }}>
                    {bt.bio}
                  </p>
                )}
                {bt?.skills?.length ? (
                  <div className="chips" style={{ marginTop: 8 }}>
                    {bt.skills.map((s) => (
                      <span key={s} className="chip active" style={{ cursor: 'default' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div style={{ marginTop: 12 }}>
                  {showContact ? (
                    <div className="stack">
                      <div className="alert success">
                        Contato liberado: {bt?.phone || '—'}
                        {bt?.whatsapp ? ` · WhatsApp ${bt.whatsapp}` : ''}
                      </div>
                      {bt?.whatsapp && (
                        <a
                          className="btn btn-block wa-btn"
                          href={`https://wa.me/${bt.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Olá ${user?.name}! Você foi selecionado(a) para a vaga "${job.title}" no CrewBar.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Abrir WhatsApp
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="locked-contact">
                      Telefone/WhatsApp ocultos até selecionar.
                    </p>
                  )}
                </div>

                {app.status === 'pending' && job.status === 'open' && (
                  <div className="row" style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        const res = selectApplicant(app.id)
                        if (!res.ok) setErr(res.error || 'Erro')
                        else setMsg(`${user?.name} selecionado(a)!`)
                      }}
                    >
                      Selecionar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => rejectApplicant(app.id)}
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </Shell>
  )
}
