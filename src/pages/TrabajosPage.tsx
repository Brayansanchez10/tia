import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { site, trabajoCoverSrc, type TrabajoPortfolioKind } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader } from '@/components/ui/PageShell'
import { TRABAJO_CATEGORY_META, trabajoPortfolioHref } from '@/pages/trabajosCategoryShared'

const KIND_ORDER: TrabajoPortfolioKind[] = ['corporativo', 'residencial']

function CategoryPortalCard({
  kind,
  count,
  coverSrc,
  delayMs,
}: {
  kind: TrabajoPortfolioKind
  count: number
  coverSrc?: string
  delayMs: number
}) {
  const { title, blurb, label } = TRABAJO_CATEGORY_META[kind]
  const href = trabajoPortfolioHref(kind)

  return (
    <RevealOnView delayMs={delayMs} variant="fadeUp" className="h-full min-h-0">
      <Link
        to={href}
        className={[
          'category-portal-card group relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-md border border-white/10 bg-luxury-panel outline-none',
          'no-underline hover:no-underline',
          'transition-[border-color,transform] motion-safe:duration-300',
          'motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand/40',
          'focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg',
        ].join(' ')}
        aria-label={
          count === 0
            ? `${title}, entrar (aún sin proyectos)`
            : `${title}, ver ${count === 1 ? 'un proyecto' : `${count} proyectos`}`
        }
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[5/3]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" aria-hidden />
          )}
          <div
            className="absolute inset-0 bg-linear-to-t from-luxury-bg via-luxury-bg/45 to-luxury-bg/10"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-luxury-gold">
              {label}
            </p>
            <h2 className="mt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-paper sm:text-2xl">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5">
          <p className="flex-1 text-sm leading-relaxed text-luxury-muted">{blurb}</p>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-paper/75">
              {count === 0 ? 'Sin proyectos' : `${count} ${count === 1 ? 'proyecto' : 'proyectos'}`}
            </span>
            <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand transition-transform motion-safe:duration-300 group-hover:translate-x-0.5">
              Ver galería
              <span aria-hidden>→</span>
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

  const covers = useMemo(() => {
    const result: Record<TrabajoPortfolioKind, string | undefined> = {
      corporativo: undefined,
      residencial: undefined,
    }
    for (const kind of KIND_ORDER) {
      const first = trabajos.items.find((p) => p.portfolioKind === kind)
      result[kind] = first ? trabajoCoverSrc(first) : undefined
    }
    return result
  }, [trabajos.items])

  const total = trabajos.items.length

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <PageHeader
            eyebrow={trabajos.pageEyebrow}
            title={trabajos.title}
            intro={trabajos.intro}
          />
          <div className="section-rule mt-5" aria-hidden />
          <p className="mt-4 text-sm text-luxury-muted/90" aria-live="polite">
            {total === 0
              ? 'Aún no hay proyectos en el portafolio.'
              : `${total} ${total === 1 ? 'proyecto' : 'proyectos'} en total`}
          </p>
        </RevealOnView>

        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 md:gap-7 md:items-stretch">
          {KIND_ORDER.map((kind, i) => (
            <li key={kind} className="flex min-h-0 h-full">
              <CategoryPortalCard
                kind={kind}
                count={counts[kind]}
                coverSrc={covers[kind]}
                delayMs={i * 70}
              />
            </li>
          ))}
        </ul>

        {total > 0 ? (
          <RevealOnView delayMs={100} variant="fadeUp" className="mt-14 md:mt-16">
            <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-luxury-gold">
              Vista rápida
            </p>
            <h2 className="m-0 mt-3 font-serif text-xl font-semibold tracking-tight text-paper sm:text-2xl">
              Todos los proyectos
            </h2>
            <p className="mt-2 max-w-xl text-sm text-luxury-muted">
              Toca una imagen para abrir la galería completa del proyecto.
            </p>
            <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-2.5 p-0 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
              {trabajos.items.map((post, i) => {
                const cover = trabajoCoverSrc(post)
                return (
                  <li key={post.slug} className="min-w-0">
                    <RevealOnView delayMs={Math.min(i * 30, 240)} variant="fadeUp">
                      <Link
                        to={`/trabajos/${post.slug}`}
                        state={{ trabajosVolver: '/trabajos' }}
                        className="group/img relative block aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-luxury-panel outline-none transition-[border-color,transform] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand/35 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg"
                        aria-label={`${post.title}, ver galería`}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform motion-safe:duration-500 motion-safe:group-hover/img:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-surface" aria-hidden />
                        )}
                        <div
                          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent"
                          aria-hidden
                        />
                        <span className="absolute inset-x-0 bottom-0 px-2 pb-2.5 pt-8 text-center text-[0.65rem] font-semibold leading-tight text-white/95 sm:text-xs">
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
