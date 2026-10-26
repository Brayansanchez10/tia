import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

const navLinkClass =
  'no-underline inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors'
const navLinkActive = 'bg-luxury-gold/15 text-luxury-gold'
const navLinkInactive = 'text-luxury-muted hover:bg-white/5 hover:text-paper'

export function AdminLayout() {
  const { logout } = useAdminAuth()

  return (
    <div className="min-h-svh w-full overflow-x-hidden bg-luxury-bg text-paper">
      <header className="sticky top-0 z-40 border-b border-luxury-gold/20 bg-luxury-panel/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-3 px-[max(1rem,env(safe-area-inset-left))] py-2 pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:py-3 lg:px-8">
          <p className="min-w-0 truncate font-[family-name:var(--font-serif)] text-base text-paper">Tus trabajos</p>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="no-underline inline-flex h-11 items-center px-2 text-sm text-luxury-muted hover:text-luxury-gold"
            >
              Ver página
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex h-11 items-center rounded-full border border-luxury-gold/45 px-4 text-sm text-luxury-gold"
            >
              Salir
            </button>
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-[72rem] gap-2 overflow-x-auto px-[max(1rem,env(safe-area-inset-left))] pb-3 pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Secciones del administrador"
        >
          <NavLink
            to="/admin/proyectos"
            className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActive : navLinkInactive}`}
          >
            Trabajos
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActive : navLinkInactive}`}
          >
            Cotizaciones
          </NavLink>
          <NavLink
            to="/admin/recibos"
            className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActive : navLinkInactive}`}
          >
            Recibos
          </NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
