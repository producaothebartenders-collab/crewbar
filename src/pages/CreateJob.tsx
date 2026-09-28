import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { useApp } from '../context/AppContext'

export default function CreateJob() {
  const { createJob, employerProfile } = useApp()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [city, setCity] = useState(employerProfile?.city || '')
  const [pay, setPay] = useState('300')
  const [slots, setSlots] = useState('1')
  const [requirements, setRequirements] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const payN = Number(pay)
    const slotsN = Number(slots)
    if (!title || !date || !time || !city || !description) {
      setError('Preencha os campos obrigatórios')
      return
    }
    if (!Number.isFinite(payN) || payN <= 0) {
      setError('Informe um cache válido')
      return
    }
    if (!Number.isFinite(slotsN) || slotsN < 1) {
      setError('Informe ao menos 1 vaga')
      return
    }
    const job = createJob({
      title: title.trim(),
      date,
      time: time.trim(),
      city: city.trim(),
      pay: payN,
      slots: slotsN,
      requirements: requirements.trim(),
      description: description.trim(),
    })
    nav(`/vaga/${job.id}`)
  }

  return (
    <Shell>
      <h1 className="page-title">Nova vaga</h1>
      <p className="page-sub">Publicação gratuita. Sem pagamento neste MVP.</p>
      {error && <div className="alert error">{error}</div>}
      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="title">Título *</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="date">Data *</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="time">Horário *</label>
          <input
            id="time"
            placeholder="18:00–01:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="city">Cidade *</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="pay">Cache (R$) *</label>
          <input
            id="pay"
            type="number"
            min={1}
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="slots">Quantidade de vagas *</label>
          <input
            id="slots"
            type="number"
            min={1}
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="requirements">Requisitos</label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Publicar vaga
        </button>
      </form>
    </Shell>
  )
}
