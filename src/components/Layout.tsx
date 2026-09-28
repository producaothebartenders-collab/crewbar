import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Header({ title }: { title?: string }) {
  const { currentUser, logout } = useApp()
  return (
    <header className="header">
      <Link to={currentUser ? '/home' : '/'}>
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CrewBar" className="header-logo" />
      </Link>
      {title ? <div className="header-title">{title}</div> : <div />}
      <div className="header-actions">
        {currentUser && (
          <button className="btn btn-ghost btn-sm" onClick={logout} type="button">
            Sair
          </button>
        )}
      </div>
    </header>
  )
}

export function BottomNav() {
  const { currentUser } = useApp()
  const loc = useLocation()
  const nav = useNavigate()
  if (!currentUser) return null

  const items =
    currentUser.role === 'bartender'
      ? [
          { to: '/home', label: 'Vagas', icon: '🍸' },
          { to: '/minhas-candidaturas', label: 'Candidaturas', icon: '📋' },
          { to: '/quiz', label: 'Quiz', icon: '🧠' },
          { to: '/perfil', label: 'Perfil', icon: '👤' },
        ]
      : [
          { to: '/home', label: 'Vagas', icon: '📝' },
          { to: '/nova-vaga', label: 'Nova', icon: '＋' },
          { to: '/casa', label: 'Casa', icon: '🏠' },
          { to: '/perfil', label: 'Conta', icon: '👤' },
        ]

  return (
    <nav className="bottom-nav" aria-label="Navegação">
      {items.map((item) => {
        const active =
          loc.pathname === item.to ||
          (item.to !== '/home' && loc.pathname.startsWith(item.to))
        return (
          <button
            key={item.to}
            type="button"
            className={`nav-item${active ? ' active' : ''}`}
            onClick={() => nav(item.to)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export function Shell({
  children,
  title,
  showNav = true,
}: {
  children: React.ReactNode
  title?: string
  showNav?: boolean
}) {
  const { currentUser } = useApp()
  const withNav = Boolean(showNav && currentUser)
  return (
    <div className={`app-shell${withNav ? ' with-nav' : ''}`}>
      <Header title={title} />
      <main className="page">{children}</main>
      {withNav && <BottomNav />}
    </div>
  )
}
