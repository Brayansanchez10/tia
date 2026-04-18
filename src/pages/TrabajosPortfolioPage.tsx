import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { site } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { WorkCard } from '@/components/trabajos/WorkCard'
import {
  parseTrabajoPortfolioKindParam,
  TRABAJO_CATEGORY_META,
} from '@/pages/trabajosCategoryShared'

const backLinkClass =
  'inline-flex text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-luxury-muted no-underline transition-colors hover:text-luxury-gold hover:no-underline motion-safe:duration-200'

export function TrabajosPortfolioPage() {
  const { kind: kindParam } = useParams()
  const kind = parseTrabajoPortfolioKindParam(kindParam)

  if (!kind) {
    return <Navigate to="/trabajos" replace />
  }

  const { trabajos } = site
  const { title, blurb, icon: Icon } = TRABAJO_CATEGORY_META[kind]

  const items = useMemo(
    () => trabajos.items.filter((p) => p.portfolioKind === kind),
    [trabajos.items, kind],
  )

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <Link to="/trabajos" className={backLinkClass}>
            ← Trabajos · categorías
          </Link>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold">
              <Icon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-paper sm:text-3xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-luxury-muted">{blurb}</p>
              <GrowLine align="left" className="mt-5 max-w-xs" />
              <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-luxury-muted/90">
                {items.length === 0
                  ? 'Sin proyectos aún'
                  : `${items.length} ${items.length === 1 ? 'proyecto' : 'proyectos'}`}
              </p>
            </div>
          </div>
        </RevealOnView>

        {items.length === 0 ? (
          <p className="mt-12 rounded-lg border border-dashed border-white/15 bg-luxury-panel/40 px-4 py-8 text-center text-sm text-paper/75">
            Cuando añadas trabajos con{' '}
            <code className="text-luxury-gold/90">portfolioKind: &apos;{kind}&apos;</code> en{' '}
            <code className="text-paper/80">src/content/site.ts</code>, aparecerán aquí.
          </p>
        ) : (
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:gap-7 md:grid-cols-2 md:gap-8 lg:gap-10">
            {items.map((post, i) => (
              <li key={post.slug} className="min-w-0">
                <RevealOnView delayMs={Math.min(i * 70, 420)} variant="scale">
                  <WorkCard post={post} layout="grid" />
                </RevealOnView>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
