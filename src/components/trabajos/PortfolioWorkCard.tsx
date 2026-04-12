import { Link } from 'react-router-dom'

type PortfolioWorkCardProps = {
  to: string
  coverSrc?: string
  category: string
  title: string
  excerpt: string
  /** Texto del enlace (ej. «Ver proyecto», «Ver exhibición»). */
  ctaLabel: string
  ariaLabel: string
}

/**
 * Tarjeta de portafolio: foto a 4:3, texto sobre degradado (sin bloque claro aparte).
 */
export function PortfolioWorkCard({
  to,
  coverSrc,
  category,
  title,
  excerpt,
  ctaLabel,
  ariaLabel,
}: PortfolioWorkCardProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to={to}
        aria-label={ariaLabel}
        className="group relative block overflow-hidden rounded-2xl border border-paper/8 bg-wood-dark/30 shadow-[0_4px_32px_rgba(0,0,0,0.35)] transition-[box-shadow,border-color,transform] duration-300 hover:border-wood/35 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] motion-safe:hover:-translate-y-0.5 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <div className="relative aspect-4/3 w-full">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[1.05]"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(56,189,248,0.15),transparent_50%),linear-gradient(160deg,#12151c,#0a0c10)]"
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/10 opacity-[0.97] transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-5 pt-20 sm:px-5 sm:pb-6 sm:pt-24 md:px-7 md:pb-7 md:pt-28">
            <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-wood">{category}</p>
            <h2 className="m-0 mt-2 max-w-[95%] text-balance text-xl font-semibold leading-snug tracking-tight text-paper md:max-w-[90%] md:text-2xl">
              {title}
            </h2>
            <p className="mt-2 line-clamp-2 max-w-xl text-[0.8125rem] leading-relaxed text-paper/82 md:text-sm">
              {excerpt}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold">
              <span>{ctaLabel}</span>
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
