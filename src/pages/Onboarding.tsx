import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STEPS = [
  {
    title: 'Para bars e casas',
    text: 'Publique vagas gratuitamente, veja candidatos ranqueados pelo quiz e selecione quem combina com o evento.',
  },
  {
    title: 'Para bartenders',
    text: 'Monte seu perfil, faça o quiz de conhecimento e candidate-se a freelas perto de você.',
  },
  {
    title: 'Contato só após seleção',
    text: 'Telefone e WhatsApp ficam ocultos até o empregador selecionar — privacidade no MVP.',
  },
]

export default function Onboarding() {
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const step = STEPS[i]

  const finish = () => {
    localStorage.setItem('crewbar_onboarded', '1')
    nav('/cadastro')
  }

  return (
    <div className="splash" style={{ justifyContent: 'space-between' }}>
      <div />
      <div>
        <img src={`${import.meta.env.BASE_URL}icon.png`} alt="" style={{ width: 88, margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '1.35rem' }}>{step.title}</h1>
        <p>{step.text}</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: idx === i ? '#C8F542' : '#333',
              }}
            />
          ))}
        </div>
      </div>
      <div className="stack" style={{ width: '100%', maxWidth: 320 }}>
        {i < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary btn-block" onClick={() => setI(i + 1)}>
            Próximo
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-block" onClick={finish}>
            Começar
          </button>
        )}
        <Link className="btn btn-ghost" to="/login">
          Já tenho conta
        </Link>
      </div>
    </div>
  )
}
