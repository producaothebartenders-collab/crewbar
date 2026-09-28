import { Link, Navigate } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import BartenderProfile from './BartenderProfile'

export default function Account() {
  const { currentUser, resetDemo, logout, employerProfile } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />

  if (currentUser.role === 'bartender') return <BartenderProfile />

  return (
    <Shell>
      <h1 className="page-title">Conta</h1>
      <p className="page-sub">
        {currentUser.name} · {currentUser.email}
      </p>
      <div className="card">
        <strong>Papel</strong>
        <div className="muted">Empregador</div>
        {employerProfile?.houseName && (
          <div className="muted" style={{ marginTop: 8 }}>
            Casa: {employerProfile.houseName} · {employerProfile.city} · {employerProfile.type}
          </div>
        )}
      </div>
      <div className="stack">
        <Link className="btn btn-secondary btn-block" to="/casa">
          Editar perfil da casa
        </Link>
        <button type="button" className="btn btn-secondary btn-block" onClick={logout}>
          Sair
        </button>
        <button type="button" className="btn btn-danger btn-block" onClick={() => resetDemo()}>
          Resetar dados demo
        </button>
      </div>
      <p className="muted" style={{ marginTop: 16 }}>
        MVP local — sem pagamentos. Senhas demo em texto no localStorage.
      </p>
    </Shell>
  )
}
