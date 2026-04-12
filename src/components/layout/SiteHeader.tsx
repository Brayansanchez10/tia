import { startTransition, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { site } from '@/content/site'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-2 py-1.5 text-sm no-underline transition-colors duration-200 motion-safe:hover:scale-[1.03] hover:no-underline',
    isActive
      ? 'bg-gold font-semibold text-paper'
      : 'text-paper/70 hover:bg-gold/15 hover:text-gold',
  ].join(' ')

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block w-full rounded-lg px-4 py-3.5 text-base font-medium no-underline transition-colors duration-200 hover:no-underline',
    isActive ? 'bg-gold text-paper' : 'text-paper/85 hover:bg-gold/12 hover:text-gold',
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

  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false)
    })
  }, [location.pathname])

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-ink/88">
      <div className="mx-auto flex max-w-[65rem] items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <BrandLogo />

        <button
          type="button"
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-paper/15 bg-surface/80 text-paper transition-colors hover:border-wood/40 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/55 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
          <MenuIcon open={menuOpen} />
        </button>

        <nav aria-label="Principal" className="hidden flex-1 flex-wrap justify-end gap-x-2 gap-y-1 md:flex md:flex-none">
          <ul className="m-0 flex list-none flex-wrap justify-end gap-x-2 gap-y-1 p-0">
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menuOpen ? (
        <div
          id="site-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación"
          className="max-h-[min(70dvh,calc(100dvh-5.5rem))] overflow-y-auto border-t border-wood/15 bg-ink/98 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:hidden"
        >
          <ul className="m-0 list-none space-y-1 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={mobileNavLinkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  )
}
