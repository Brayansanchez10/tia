import { Link, type LinkProps } from 'react-router-dom'

type PortfolioWorkCardProps = {
  to: string
  state?: LinkProps['state']
  coverSrc?: string
  category: string
  title: string
  excerpt: string
  /** Texto del enlace (ej. «Ver proyecto», «Ver exhibición»). */
  ctaLabel: string
  ariaLabel: string
  /** `grid`: tarjeta compacta para listados en varias columnas. */
  layout?: 'stack' | 'grid'
}

/**
 * Tarjeta de portafolio: foto a 4:3, texto sobre degradado (sin bloque claro aparte).
 */
export function PortfolioWorkCard({
  to,
  state,
  coverSrc,
  category,
  title,
  excerpt,
  ctaLabel,
  ariaLabel,
  layout = 'stack',
}: PortfolioWorkCardProps) {
  const isGrid = layout === 'grid'

  return (
    <article className={isGrid ? 'h-full min-w-0' : 'mx-auto max-w-3xl'}>
      <Link
        to={to}
        state={state}
        aria-label={ariaLabel}
        className={[
          'group relative block overflow-hidden rounded-sm border border-white/10 bg-luxury-panel/90 shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-[box-shadow,border-color,transform] duration-500 hover:border-luxury-gold/30 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5)] motion-safe:hover:-translate-y-1 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg',
          isGrid ? 'flex h-full min-h-0 flex-col' : '',
        ].join(' ')}
      >
        <div className={isGrid ? 'relative aspect-[4/3] w-full shrink-0' : 'relative aspect-4/3 w-full'}>
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[1.05]"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(197,160,89,0.08),transparent_55%),linear-gradient(160deg,var(--theme-luxury-panel),var(--theme-luxury-bg))]"
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 bg-linear-to-t from-luxury-bg via-luxury-bg/65 to-luxury-bg/5 opacity-[0.96] transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div
            className={
              isGrid
                ? 'absolute inset-x-0 bottom-0 flex flex-col justify-end px-3 pb-4 pt-12 sm:px-4 sm:pb-5 sm:pt-16'
                : 'absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-5 pt-20 sm:px-5 sm:pb-6 sm:pt-24 md:px-7 md:pb-7 md:pt-28'
            }
          >
            <p className="m-0 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold/95 sm:text-[0.65rem]">
              {category}
            </p>
            <h2
              className={
                isGrid
                  ? 'm-0 mt-1 line-clamp-2 max-w-full text-balance font-serif text-base font-semibold leading-snug tracking-wide text-paper sm:mt-1.5 sm:text-lg md:text-xl'
                  : 'm-0 mt-2 max-w-[95%] text-balance font-serif text-xl font-semibold leading-snug tracking-wide text-paper md:max-w-[90%] md:text-2xl'
              }
            >
              {title}
            </h2>
            {!isGrid ? (
              <p className="mt-2 line-clamp-2 max-w-xl text-[0.8125rem] leading-relaxed text-paper/80 md:text-sm">
                {excerpt}
              </p>
            ) : (
              <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-paper/75 sm:mt-2 sm:text-[0.75rem]">
                {excerpt}
              </p>
            )}
            <p
              className={
                isGrid
                  ? 'mt-2 inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-luxury-gold sm:mt-3 sm:text-[0.65rem]'
                  : 'mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-luxury-gold'
              }
            >
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
