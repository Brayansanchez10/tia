import { Link, Navigate, useParams } from 'react-router-dom'
import { findTrabajoChild, trabajoGallerySrcs } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { TrabajoGalleryList } from '@/components/trabajos/TrabajoGallery'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { PageSection } from '@/components/ui/PageShell'

export function TrabajoChildDetailPage() {
  const { parentSlug, childSlug } = useParams()
  const resolved =
    parentSlug && childSlug ? findTrabajoChild(parentSlug, childSlug) : undefined

  if (!resolved) {
    return <Navigate to="/trabajos" replace />
  }

  const { parent, child } = resolved
  const gallery = trabajoGallerySrcs(child)
  const hubHref = `/trabajos/${parent.slug}`

  return (
    <PageSection>
      <RevealOnView>
        <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper/70" aria-label="Ruta">
          <Link to="/trabajos" className="font-medium text-wood no-underline hover:text-gold hover:underline">
            Trabajos
          </Link>
          <span className="text-gold/80" aria-hidden>
            /
          </span>
          <Link to={hubHref} className="font-medium text-wood no-underline hover:text-gold hover:underline">
            {parent.title}
          </Link>
          <span className="text-gold/80" aria-hidden>
            /
          </span>
          <span className="min-w-0 truncate text-paper/75">{child.title}</span>
        </nav>
      </RevealOnView>

      <TrabajoGalleryList sources={gallery} title={child.title} />

      <RevealOnView delayMs={80}>
        <header className="mx-auto mt-12 max-w-2xl border-t border-wood/15 pt-10">
          <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-wood">{child.category}</p>
          <h1 className="m-0 mt-2 text-2xl font-semibold leading-tight tracking-tight text-paper md:text-3xl">
            {child.title}
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-paper/50">{child.dateLabel}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/78 md:text-[0.95rem]">{child.excerpt}</p>
        </header>
      </RevealOnView>

      <RevealOnView delayMs={120}>
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="space-y-4 text-sm leading-relaxed text-paper/75">
            {child.paragraphs.map((p, i) => (
              <p key={i} className="m-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink variant="ghost" to={hubHref} className="rounded-sm px-5 py-2.5 text-sm">
              ← {parent.title}
            </ButtonLink>
            <ButtonLink variant="ghost" to="/trabajos" className="rounded-sm px-5 py-2.5 text-sm">
              Todos los trabajos
            </ButtonLink>
          </div>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
