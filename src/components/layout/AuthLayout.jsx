import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f1117] to-slate-900 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
