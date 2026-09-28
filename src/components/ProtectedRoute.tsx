import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode
  role?: Role
}) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) return <Navigate to="/home" replace />
  return <>{children}</>
}
