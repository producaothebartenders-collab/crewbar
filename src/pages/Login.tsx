import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, currentUser, resetDemo } = useApp()
  const nav = useNavigate()
  const [email, setEmail] = useState('ana@crewbar.demo')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to="/home" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const res = login(email, password)
    if (!res.ok) {
      setError(res.error || 'Falha no login')
      return
    }
    nav('/home')
  }

  return (
    <Shell showNav={false}>
      <h1 className="page-title">Entrar</h1>
      <p className="page-sub">Demo local — senhas em texto no localStorage.</p>
      {error && <div className="alert error">{error}</div>}
      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit">
          Entrar
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
      <div className="divider" />
      <p className="muted">Atalhos demo:</p>
      <div className="stack">
        <button
          type="button"
          className="btn btn-secondary btn-block btn-sm"
          onClick={() => {
            setEmail('ana@crewbar.demo')
            setPassword('demo123')
          }}
        >
          Bartender Ana
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block btn-sm"
          onClick={() => {
            setEmail('bruno@crewbar.demo')
            setPassword('demo123')
          }}
        >
          Bartender Bruno
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block btn-sm"
          onClick={() => {
            setEmail('empregador@crewbar.demo')
            setPassword('demo123')
          }}
        >
          Empregador Carlos
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            resetDemo()
            setError('')
          }}
        >
          Resetar dados demo
        </button>
      </div>
    </Shell>
  )
}
