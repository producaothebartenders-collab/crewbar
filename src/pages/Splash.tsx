import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Splash() {
  const { currentUser } = useApp()
  const nav = useNavigate()
  const [seen, setSeen] = useState(
    () => localStorage.getItem('crewbar_onboarded') === '1'
  )

  useEffect(() => {
    if (currentUser) return
    const t = setTimeout(() => {
      if (!seen) nav('/onboarding')
    }, 1800)
    return () => clearTimeout(t)
  }, [currentUser, seen, nav])

  if (currentUser) return <Navigate to="/home" replace />

  return (
    <div className="splash">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CrewBar" className="logo" />
      <h1>
        <span style={{ color: '#fff' }}>Crew</span>
        <span style={{ color: '#C8F542' }}>Bar</span>
      </h1>
      <p>Marketplace que conecta bars a bartenders freelancers.</p>
      <div className="stack" style={{ width: '100%', maxWidth: 320, marginTop: 12 }}>
        <Link className="btn btn-primary btn-block" to="/login">
          Entrar
        </Link>
        <Link className="btn btn-secondary btn-block" to="/cadastro">
          Criar conta
        </Link>
        {!seen && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              localStorage.setItem('crewbar_onboarded', '1')
              setSeen(true)
              nav('/onboarding')
            }}
          >
            Como funciona
          </button>
        )}
      </div>
    </div>
  )
}
