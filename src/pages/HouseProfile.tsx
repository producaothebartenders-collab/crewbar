import type { FormEvent } from 'react'
import { useState } from 'react'
import { Shell } from '../components/Layout'
import { HOUSE_TYPES } from '../data/skills'
import { useApp } from '../context/AppContext'
import { employerCompleteness } from '../lib/profile'

export default function HouseProfile() {
  const { employerProfile, updateEmployerProfile, currentUser } = useApp()
  const [houseName, setHouseName] = useState(employerProfile?.houseName || '')
  const [city, setCity] = useState(employerProfile?.city || '')
  const [type, setType] = useState(employerProfile?.type || 'Bar')
  const [saved, setSaved] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateEmployerProfile({
      houseName: houseName.trim(),
      city: city.trim(),
      type,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const pct = employerCompleteness({
    userId: currentUser?.id || '',
    houseName,
    city,
    type,
  })

  return (
    <Shell>
      <h1 className="page-title">Perfil da casa</h1>
      <p className="page-sub">Como sua casa aparece para os bartenders.</p>
      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <span style={{ width: `${pct}%` }} />
      </div>
      {saved && <div className="alert success">Salvo!</div>}
      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="houseName">Nome da casa *</label>
          <input
            id="houseName"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="city">Cidade *</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="type">Tipo *</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {HOUSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Salvar
        </button>
      </form>
    </Shell>
  )
}
