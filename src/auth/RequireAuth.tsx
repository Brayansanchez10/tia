import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

export function RequireAuth() {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
