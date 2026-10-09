import { Link, type LinkProps } from 'react-router-dom'

type PortfolioWorkCardProps = {
  to: string
  state?: LinkProps['state']
  coverSrc?: string
  category: string
  title: string
  excerpt: string
  highlights?: readonly string[]
  /** Texto del enlace (ej. «Ver proyecto», «Ver exhibición»). */
  ctaLabel: string
  ariaLabel: string
  /** `grid`: tarjeta compacta para listados en varias columnas. */
  layout?: 'stack' | 'grid'
}

/**
 * Tarjeta de portafolio: imagen protagonista + ficha clara debajo (mobile-first).
 */
export function PortfolioWorkCard({
  to,
  state,
  coverSrc,
  category,
  title,
  excerpt,
  highlights,
  ctaLabel,
  ariaLabel,
  layout = 'stack',
}: PortfolioWorkCardProps) {
  const isGrid = layout === 'grid'
  const chips = highlights?.slice(0, 3)

  return (
    <article className={isGrid ? 'h-full min-w-0' : 'mx-auto max-w-3xl'}>
      <Link
        to={to}
        state={state}
        aria-label={ariaLabel}
        className={[
          'group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-luxury-panel no-underline outline-none transition-[border-color,box-shadow,transform] motion-safe:duration-300',
          'hover:border-brand/35 hover:no-underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg',
          'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)]',
        ].join(' ')}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-luxury-bg">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(184,149,108,0.1),transparent_55%),linear-gradient(160deg,var(--theme-luxury-panel),var(--theme-luxury-bg))]"
              aria-hidden
            />
          )}
        </div>

        <div
          className={[
            'flex min-h-0 flex-1 flex-col border-t border-white/8',
            isGrid ? 'px-3.5 py-4 sm:px-4 sm:py-5' : 'px-4 py-5 sm:px-5 sm:py-6',
          ].join(' ')}
        >
          <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
            {category}
          </p>
          <h2
            className={[
              'm-0 mt-2 font-serif font-semibold leading-snug tracking-tight text-paper',
              isGrid ? 'line-clamp-2 text-lg sm:text-xl' : 'text-xl sm:text-2xl',
            ].join(' ')}
          >
            {title}
          </h2>
          <p
            className={[
              'mt-2 leading-relaxed text-luxury-muted',
              isGrid ? 'line-clamp-2 text-sm' : 'line-clamp-3 text-sm sm:text-base',
            ].join(' ')}
          >
            {excerpt}
          </p>

          {chips && chips.length > 0 ? (
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-sm border border-white/10 bg-black/20 px-2 py-1 text-[0.65rem] font-medium leading-none text-paper/80"
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand">
            <span>{ctaLabel}</span>
            <span aria-hidden className="transition-transform motion-safe:duration-200 group-hover:translate-x-1">
              →
            </span>
          </p>
        </div>
      </Link>
    </article>
  )
}
