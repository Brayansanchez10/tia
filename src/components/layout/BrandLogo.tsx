import { Link } from 'react-router-dom'
import { site } from '@/content/site'

function brandInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function BrandLogo() {
  const src = site.logoSrc.trim()
  const initials = site.logoInitials.trim()
    ? site.logoInitials.trim().toUpperCase()
    : brandInitials(site.brand)

  if (src) {
    return (
      <Link
        to="/#inicio"
        aria-label={`Ir al inicio — ${site.brand}`}
        className="flex min-w-0 shrink-0 items-center no-underline transition-opacity duration-200 hover:opacity-90 hover:no-underline motion-safe:active:scale-[0.99]"
      >
        <img
          src={src}
          alt={site.brand}
          className="h-12 w-auto max-w-[min(58vw,16rem)] object-contain object-left sm:h-14 sm:max-w-[min(72vw,26rem)] md:h-[4.25rem] md:max-w-[min(78vw,34rem)] lg:h-20 lg:max-w-[min(72vw,40rem)] xl:max-w-[44rem]"
          loading="eager"
          decoding="async"
        />
      </Link>
    )
  }

  return (
    <Link
      to="/#inicio"
      aria-label="Ir al inicio"
      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-wood/30 bg-gradient-to-br from-wood-dark to-ink no-underline shadow-sm ring-1 ring-inset ring-gold/25 transition duration-200 hover:border-gold/50 hover:ring-gold/35 motion-safe:hover:scale-[1.04] motion-safe:active:scale-[0.98]"
    >
      <span className="select-none text-sm font-bold tracking-tight text-gold">{initials}</span>
    </Link>
  )
}
