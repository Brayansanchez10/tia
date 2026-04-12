import { NavLink } from 'react-router-dom'
import { site } from '@/content/site'

function brandInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function BrandLogo() {
  const src = site.logoSrc.trim()

  return (
    <NavLink
      to="/"
      end
      aria-label="Ir al inicio"
      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold/35 bg-gradient-to-br from-wood-dark to-ink no-underline shadow-sm ring-1 ring-inset ring-gold/15 transition duration-200 hover:border-gold/55 hover:ring-gold/30 motion-safe:hover:scale-[1.04] motion-safe:active:scale-[0.98]"
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-contain p-1.5" loading="eager" />
      ) : (
        <span className="select-none text-sm font-bold tracking-tight text-gold">
          {brandInitials(site.brand)}
        </span>
      )}
    </NavLink>
  )
}
