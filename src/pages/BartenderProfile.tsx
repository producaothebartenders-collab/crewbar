import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { EXPERIENCE_OPTIONS, SKILL_OPTIONS } from '../data/skills'
import { useApp } from '../context/AppContext'
import { bartenderCompleteness, badgeColor } from '../lib/profile'

export default function BartenderProfile() {
  const { bartenderProfile, updateBartenderProfile, currentUser } = useApp()
  const [photo, setPhoto] = useState(bartenderProfile?.photo || '')
  const [bio, setBio] = useState(bartenderProfile?.bio || '')
  const [city, setCity] = useState(bartenderProfile?.city || '')
  const [experience, setExperience] = useState(
    bartenderProfile?.experience || EXPERIENCE_OPTIONS[0]
  )
  const [skills, setSkills] = useState<string[]>(bartenderProfile?.skills || [])
  const [phone, setPhone] = useState(bartenderProfile?.phone || '')
  const [whatsapp, setWhatsapp] = useState(bartenderProfile?.whatsapp || '')
  const [saved, setSaved] = useState(false)

  const draft = {
    userId: currentUser?.id || '',
    photo,
    bio,
    city,
    experience,
    skills,
    phone,
    whatsapp,
    quizScore: bartenderProfile?.quizScore ?? null,
    quizBadge: bartenderProfile?.quizBadge ?? null,
    quizAttemptAt: bartenderProfile?.quizAttemptAt ?? null,
  }
  const pct = bartenderCompleteness(draft)

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const onPhoto = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateBartenderProfile({
      photo,
      bio: bio.trim(),
      city: city.trim(),
      experience,
      skills,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Shell>
      <h1 className="page-title">Meu perfil</h1>
      <p className="page-sub">
        Completude {pct}% · mínimo 70% + foto + quiz para candidatar.
      </p>
      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="card">
        <div className="row space-between">
          <div>
            <strong>Quiz de conhecimento</strong>
            <div className="muted">
              {bartenderProfile?.quizScore != null
                ? `${bartenderProfile.quizScore}% · ${bartenderProfile.quizBadge}`
                : 'Ainda não realizado'}
            </div>
          </div>
          {bartenderProfile?.quizBadge && (
            <span
              className="badge"
              style={{ color: badgeColor(bartenderProfile.quizBadge) }}
            >
              {bartenderProfile.quizBadge}
            </span>
          )}
        </div>
        <Link to="/quiz" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}>
          {bartenderProfile?.quizScore != null ? 'Refazer quiz' : 'Fazer quiz'}
        </Link>
      </div>

      {saved && <div className="alert success">Perfil salvo!</div>}

      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label>Foto *</label>
          <div className="row" style={{ gap: 16 }}>
            {photo ? (
              <img src={photo} alt="Foto" className="photo-preview" />
            ) : (
              <div className="photo-preview" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPhoto(e.target.files?.[0] || null)}
            />
          </div>
          <input
            placeholder="Ou cole URL da foto"
            value={photo.startsWith('data:') ? '' : photo}
            onChange={(e) => setPhoto(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>

        <div className="field">
          <label htmlFor="bio">Bio *</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="city">Cidade *</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="experience">Experiência *</label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            {EXPERIENCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Skills *</label>
          <div className="chips">
            {SKILL_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip${skills.includes(s) ? ' active' : ''}`}
                onClick={() => toggleSkill(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="alert info">
          Telefone e WhatsApp ficam ocultos para empregadores até você ser selecionado.
        </div>

        <div className="field">
          <label htmlFor="phone">Telefone *</label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="11999999999"
          />
        </div>
        <div className="field">
          <label htmlFor="whatsapp">WhatsApp (com DDI, ex: 5511999999999)</label>
          <input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Salvar perfil
        </button>
      </form>
    </Shell>
  )
}
