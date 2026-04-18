import { Link, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

export function AdminLayout() {
  const { logout } = useAdminAuth()

  return (
    <div className="min-h-svh w-full bg-luxury-bg text-paper">
      <header className="border-b border-luxury-gold/20 bg-luxury-panel/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-luxury-gold uppercase">
            Administración
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-luxury-muted transition-colors hover:text-luxury-gold sm:text-sm"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-sm border border-luxury-gold/45 px-3 py-1.5 text-xs text-luxury-gold transition-colors hover:border-luxury-gold hover:bg-luxury-gold/10 sm:text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
