import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { site, trabajoCoverSrc, type TrabajoPortfolioKind } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader } from '@/components/ui/PageShell'
import { TRABAJO_CATEGORY_META, trabajoPortfolioHref } from '@/pages/trabajosCategoryShared'

const KIND_ORDER: TrabajoPortfolioKind[] = ['corporativo', 'residencial']

function CategoryPortalCard({
  kind,
  count,
  delayMs,
}: {
  kind: TrabajoPortfolioKind
  count: number
  delayMs: number
}) {
  const { title, blurb, label, icon: Icon, accentBarClass, decoGlowClass } = TRABAJO_CATEGORY_META[kind]
  const href = trabajoPortfolioHref(kind)

  return (
    <RevealOnView delayMs={delayMs} variant="scale" className="h-full min-h-0">
      <Link
        to={href}
        className={[
          'category-portal-card group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-luxury-panel/95 via-black/60 to-black/80 shadow-[0_16px_48px_rgba(0,0,0,0.35)] outline-none ring-0',
          'no-underline hover:no-underline focus:no-underline',
          'transition-[border-color,box-shadow,transform] motion-safe:duration-300',
          'motion-safe:hover:-translate-y-1 motion-safe:hover:border-luxury-gold/35 motion-safe:hover:shadow-[0_24px_56px_rgba(0,0,0,0.45)]',
          'focus-visible:ring-2 focus-visible:ring-luxury-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg',
        ].join(' ')}
        aria-label={
          count === 0
            ? `${title}, entrar (aún sin proyectos)`
            : `${title}, ver ${count === 1 ? 'un proyecto' : `${count} proyectos`}`
        }
      >
        {/* Barra superior */}
        <div
          className={`h-1 w-full bg-gradient-to-r ${accentBarClass}`}
          aria-hidden
        />

        {/* Glow decorativo + icono watermark */}
        <div
          className={`pointer-events-none absolute -right-8 top-10 h-48 w-48 rounded-full blur-3xl ${decoGlowClass}`}
          aria-hidden
        />
        <div className="pointer-events-none absolute -bottom-6 -left-12 size-40 opacity-[0.07] text-luxury-gold" aria-hidden>
          <Icon className="size-full" />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
          <div className="flex items-start gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-luxury-gold/35 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 text-luxury-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/5 transition-[transform,box-shadow] motion-safe:duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_32px_rgba(197,160,89,0.15)]">
              <Icon className="size-8" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold/90">{label}</p>
              <h2 className="mt-2 min-h-[3.5rem] font-serif text-lg font-semibold leading-snug tracking-tight text-paper sm:min-h-[3.75rem] sm:text-xl">
                {title}
              </h2>
            </div>
          </div>

          {/* flex-1: en grid ambas tarjetas comparten altura; el texto ocupa el espacio y alinea el pie */}
          <p className="mt-5 flex-1 text-sm leading-relaxed text-luxury-muted">{blurb}</p>

          <div className="mt-6 flex shrink-0 items-center justify-between gap-3 border-t border-white/10 pt-5">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/80">
              {count === 0 ? 'Sin proyectos' : `${count} ${count === 1 ? 'proyecto' : 'proyectos'}`}
            </span>
            <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-luxury-gold transition-[transform,color] motion-safe:duration-300 group-hover:translate-x-0.5 group-hover:text-paper/90">
              Ver galería
              <span aria-hidden className="inline-block transition-transform motion-safe:duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </RevealOnView>
  )
}

export function TrabajosPage() {
  const { trabajos } = site

  const counts = useMemo(() => {
    const c: Record<TrabajoPortfolioKind, number> = { corporativo: 0, residencial: 0 }
    for (const p of trabajos.items) {
      c[p.portfolioKind] += 1
    }
    return c
  }, [trabajos.items])

  const total = trabajos.items.length

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <PageHeader eyebrow={trabajos.pageEyebrow} title={trabajos.title} />
          <GrowLine align="center" className="mt-5" />
        </RevealOnView>

        <div className="mx-auto mt-6 max-w-2xl text-center md:mt-8">
          <p className="text-sm leading-relaxed text-luxury-muted">
            Elige una categoría para ver la galería de proyectos.
          </p>
          <p className="mt-2 text-sm text-luxury-muted/90" aria-live="polite">
            {total === 0
              ? 'Aún no hay proyectos en el portafolio.'
              : `${total} ${total === 1 ? 'proyecto' : 'proyectos'} en total`}
          </p>
        </div>

        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-8 md:items-stretch">
          {KIND_ORDER.map((kind, i) => (
            <li key={kind} className="flex min-h-0 h-full">
              <CategoryPortalCard kind={kind} count={counts[kind]} delayMs={i * 80} />
            </li>
          ))}
        </ul>

        {total > 0 ? (
          <RevealOnView delayMs={120} variant="fadeUp" className="mt-14 md:mt-16">
            <p className="m-0 text-center text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold/90">
              Vista rápida
            </p>
            <h2 className="m-0 mt-3 text-center font-serif text-xl font-semibold tracking-tight text-paper sm:text-2xl">
              Todos los proyectos
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-luxury-muted">
              Pulsa una imagen para abrir la galería completa.
            </p>
            <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
              {trabajos.items.map((post, i) => {
                const cover = trabajoCoverSrc(post)
                return (
                  <li key={post.slug} className="min-w-0">
                    <RevealOnView delayMs={Math.min(i * 35, 280)} variant="scale">
                      <Link
                        to={`/trabajos/${post.slug}`}
                        state={{ trabajosVolver: '/trabajos' }}
                        className="group/img relative block aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-luxury-panel/80 outline-none ring-0 transition-[border-color,box-shadow,transform] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-luxury-gold/30 motion-safe:hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)] focus-visible:ring-2 focus-visible:ring-luxury-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg"
                        aria-label={`${post.title}, ver galería`}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] motion-safe:duration-500 motion-safe:group-hover/img:scale-105 motion-safe:group-hover/img:brightness-105"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(197,160,89,0.12),transparent_55%),linear-gradient(160deg,var(--theme-luxury-panel),var(--theme-luxury-bg))]"
                            aria-hidden
                          />
                        )}
                        <div
                          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent opacity-95 transition-opacity motion-safe:duration-300 motion-safe:group-hover/img:opacity-100"
                          aria-hidden
                        />
                        <span className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-10 text-center text-[0.65rem] font-semibold leading-tight text-white/95 sm:px-2.5 sm:pb-2.5 sm:text-xs">
                          <span className="line-clamp-2">{post.title}</span>
                        </span>
                      </Link>
                    </RevealOnView>
                  </li>
                )
              })}
            </ul>
          </RevealOnView>
        ) : null}
      </div>
    </div>
  )
}
