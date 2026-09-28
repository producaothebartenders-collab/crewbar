import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BartenderJobs from './BartenderJobs'
import EmployerJobs from './EmployerJobs'

export default function Home() {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  return currentUser.role === 'bartender' ? <BartenderJobs /> : <EmployerJobs />
}
