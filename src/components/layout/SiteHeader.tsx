import { startTransition, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { site } from '@/content/site'

function hashNavActive(pathname: string, hash: string, to: string): boolean {
  if (!to.startsWith('/#')) return false
  if (pathname !== '/') return false
  if (to === '/#inicio') return hash === '' || hash === '#inicio'
  return hash === to.slice(1)
}

/** La barra es oscura en ambos temas (ver `global.css`); no usar `text-paper` del tema claro aquí. */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-2 py-1.5 text-xs uppercase tracking-[0.16em] no-underline transition-colors duration-200 motion-safe:hover:scale-[1.03] hover:no-underline',
    isActive ? 'font-semibold text-brand' : 'text-zinc-200/88 hover:text-brand',
  ].join(' ')

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block w-full rounded-lg px-4 py-3.5 text-base font-medium uppercase tracking-[0.12em] no-underline transition-colors duration-200 hover:no-underline',
    isActive ? 'text-brand' : 'text-zinc-200/90 hover:bg-white/[0.06] hover:text-brand',
  ].join(' ')

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <span
        className={`absolute left-0 top-1 block h-0.5 w-6 rounded-full bg-paper transition-transform duration-200 ${
          open ? 'translate-y-1.5 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-2.5 block h-0.5 w-6 rounded-full bg-paper transition-opacity duration-200 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 top-4 block h-0.5 w-6 rounded-full bg-paper transition-transform duration-200 ${
          open ? '-translate-y-1.5 -rotate-45' : ''
        }`}
      />
    </span>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false)
    })
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const headerSurface = isHome
    ? 'border-b border-white/10 bg-luxury-bg/45 backdrop-blur-md supports-[backdrop-filter]:bg-luxury-bg/35'
    : 'border-b border-wood/15 bg-ink/95 backdrop-blur-md supports-[backdrop-filter]:bg-ink/88'

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] ${headerSurface}`}
    >
      <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <BrandLogo />

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          <ThemeToggle compact />
          <button
            type="button"
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-paper/15 bg-surface/80 text-paper transition-colors hover:border-wood/40 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/55 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            <MenuIcon open={menuOpen} />
          </button>

          <nav aria-label="Principal" className="hidden flex-wrap justify-end gap-x-1 gap-y-1 md:flex md:flex-none">
          <ul className="m-0 flex list-none flex-wrap items-center justify-end gap-x-1 gap-y-1 p-0">
            {site.nav.map((item) => {
              if (item.to.startsWith('/#')) {
                const active = hashNavActive(location.pathname, location.hash, item.to)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={[
                        'rounded-lg px-3 py-2 text-xs uppercase tracking-[0.16em] no-underline transition-colors duration-200 motion-safe:hover:scale-[1.03] hover:no-underline',
                        active ? 'font-semibold text-brand' : 'text-zinc-200/88 hover:text-brand',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              }
              return (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
            <li className="ml-1 hidden shrink-0 md:block">
              <Link
                to="/admin/login"
                className="rounded-lg px-2 py-2 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-zinc-400/40 no-underline transition-colors hover:text-zinc-200/75 hover:no-underline focus-visible:text-zinc-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40"
                aria-label="Iniciar sesión como administrador"
              >
                Acceso
              </Link>
            </li>
          </ul>
        </nav>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="site-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación"
          className="site-mobile-nav max-h-[min(70dvh,calc(100dvh-5.5rem))] overflow-y-auto border-t border-white/10 bg-luxury-bg/98 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:hidden"
        >
          <ul className="m-0 list-none space-y-1 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
            {site.nav.map((item) => {
              if (item.to.startsWith('/#')) {
                const active = hashNavActive(location.pathname, location.hash, item.to)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={[
                        'block w-full rounded-lg px-4 py-3.5 text-base font-medium uppercase tracking-[0.12em] no-underline transition-colors duration-200 hover:no-underline',
                        active ? 'text-brand' : 'text-zinc-200/90 hover:bg-white/[0.06] hover:text-brand',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              }
              return (
                <li key={item.to}>
                  <NavLink to={item.to} className={mobileNavLinkClass} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
            <li className="mt-4 border-t border-white/10 pt-4">
              <Link
                to="/admin/login"
                className="block w-full rounded-lg px-4 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-400/55 no-underline transition-colors hover:bg-white/[0.06] hover:text-luxury-gold/90 hover:no-underline"
              >
                Administración
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
