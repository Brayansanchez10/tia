import { useMemo, useState } from 'react'
import { site, type TrabajoPost } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { WorkCard } from '@/components/trabajos/WorkCard'
import { PageHeader } from '@/components/ui/PageShell'

function uniqueCategories(items: readonly TrabajoPost[]): string[] {
  const set = new Set(items.map((p) => p.category.trim()).filter(Boolean))
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
}

export function TrabajosPage() {
  const { trabajos } = site
  const categories = useMemo(() => uniqueCategories(trabajos.items), [trabajos.items])
  const [filter, setFilter] = useState<string | 'all'>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return trabajos.items
    return trabajos.items.filter((p) => p.category === filter)
  }, [trabajos.items, filter])

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <PageHeader eyebrow={trabajos.pageEyebrow} title={trabajos.title} />
          <GrowLine align="center" className="mt-5" />
        </RevealOnView>

        {/* Filtro por categoría: reduce scroll cuando hay muchos trabajos */}
        <div className="sticky top-[calc(env(safe-area-inset-top,0px)+4.75rem)] z-20 -mx-4 border-b border-white/10 bg-luxury-bg/95 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5 md:mx-0 md:rounded-lg md:border md:border-white/10 md:py-3 md:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-luxury-muted md:sr-only">
            Filtrar por categoría
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:pb-0 [&::-webkit-scrollbar]:hidden"
            role="toolbar"
            aria-label="Filtrar trabajos por categoría"
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={[
                'shrink-0 rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors motion-safe:duration-200 sm:px-4',
                filter === 'all'
                  ? 'border-luxury-gold/70 bg-luxury-gold/15 text-luxury-gold'
                  : 'border-white/15 bg-luxury-panel/60 text-paper/85 hover:border-luxury-gold/35 hover:text-luxury-gold',
              ].join(' ')}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={[
                  'shrink-0 rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors motion-safe:duration-200 sm:px-4',
                  filter === cat
                    ? 'border-luxury-gold/70 bg-luxury-gold/15 text-luxury-gold'
                    : 'border-white/15 bg-luxury-panel/60 text-paper/85 hover:border-luxury-gold/35 hover:text-luxury-gold',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-luxury-muted" aria-live="polite">
          {filtered.length === trabajos.items.length
            ? `${filtered.length} ${filtered.length === 1 ? 'proyecto' : 'proyectos'}`
            : `${filtered.length} de ${trabajos.items.length} proyectos`}
        </p>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-paper/75">No hay proyectos en esta categoría.</p>
        ) : (
          <ul
            key={filter}
            className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:gap-7 md:grid-cols-2 md:gap-8 lg:gap-10"
          >
            {filtered.map((post, i) => (
              <li key={post.slug} className="min-w-0">
                <RevealOnView delayMs={Math.min(i * 70, 350)} variant="scale">
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
