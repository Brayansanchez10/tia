import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

const navLinkClass =
  'no-underline rounded-sm px-3 py-2 text-xs text-luxury-muted transition-colors active:bg-luxury-gold/10 sm:px-3 sm:py-1.5 sm:text-sm'
const navLinkActive = 'text-luxury-gold'
const navLinkInactive = 'hover:text-paper'

export function AdminLayout() {
  const { logout } = useAdminAuth()

  return (
    <div className="min-h-svh w-full overflow-x-hidden bg-luxury-bg text-paper pb-[env(safe-area-inset-bottom)]">
      <header className="border-b border-luxury-gold/20 bg-luxury-panel/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-3 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:gap-5">
            <p className="shrink-0 font-[family-name:var(--font-display)] text-[0.7rem] tracking-[0.18em] text-luxury-gold uppercase sm:text-sm sm:tracking-[0.2em]">
              Administración
            </p>
            <nav
              className="flex min-h-11 min-w-0 items-center gap-1 sm:border-l sm:border-luxury-gold/20 sm:pl-4 md:pl-5"
              aria-label="Secciones del administrador"
            >
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `${navLinkClass} inline-flex min-h-11 items-center ${isActive ? navLinkActive : navLinkInactive}`
                }
              >
                Cotizaciones
              </NavLink>
              <span className="px-0.5 text-luxury-gold/35 select-none sm:px-0" aria-hidden>
                ·
              </span>
              <NavLink
                to="/admin/recibos"
                className={({ isActive }) =>
                  `${navLinkClass} inline-flex min-h-11 items-center ${isActive ? navLinkActive : navLinkInactive}`
                }
              >
                Recibos
              </NavLink>
            </nav>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-luxury-gold/15 pt-2 sm:justify-end sm:border-t-0 sm:pt-0">
            <Link
              to="/"
              className="no-underline inline-flex min-h-11 items-center text-xs text-luxury-muted transition-colors hover:text-luxury-gold sm:text-sm"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex min-h-11 items-center rounded-sm border border-luxury-gold/45 px-3 py-2 text-xs text-luxury-gold transition-colors hover:border-luxury-gold hover:bg-luxury-gold/10 sm:text-sm"
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
