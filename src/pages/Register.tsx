import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'

export default function Register() {
  const { register, currentUser } = useApp()
  const nav = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to="/home" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!role) {
      setError('Escolha um perfil')
      return
    }
    const res = register({ name, email, password, role })
    if (!res.ok) {
      setError(res.error || 'Falha no cadastro')
      return
    }
    localStorage.setItem('crewbar_onboarded', '1')
    nav(role === 'bartender' ? '/perfil' : '/casa')
  }

  return (
    <Shell showNav={false}>
      <h1 className="page-title">Criar conta</h1>
      <p className="page-sub">Escolha seu papel e comece em minutos.</p>
      {error && <div className="alert error">{error}</div>}

      <div className="stack" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`card role-card${role === 'bartender' ? ' selected' : ''}`}
          onClick={() => setRole('bartender')}
        >
          <h3>Bartender</h3>
          <p className="muted" style={{ margin: 0 }}>
            Quero me candidatar a freelas em bars e eventos.
          </p>
        </button>
        <button
          type="button"
          className={`card role-card${role === 'employer' ? ' selected' : ''}`}
          onClick={() => setRole('employer')}
        >
          <h3>Empregador</h3>
          <p className="muted" style={{ margin: 0 }}>
            Quero publicar vagas e contratar bartenders.
          </p>
        </button>
      </div>

      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit">
          Cadastrar
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </Shell>
  )
}
