import { Link } from 'react-router-dom'
import type { TrabajoPost } from '@/content/site'
import { trabajoGallerySrcs } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { TrabajoGalleryList } from '@/components/trabajos/TrabajoGallery'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { PageSection } from '@/components/ui/PageShell'

export function TrabajoDetailPage({ post }: { post: TrabajoPost }) {
  const gallery = trabajoGallerySrcs(post)

  return (
    <PageSection>
      <RevealOnView>
        <nav className="mb-8" aria-label="Ruta">
          <Link
            to="/trabajos"
            className="inline-flex text-sm font-medium text-wood no-underline transition-colors hover:text-gold hover:underline"
          >
            ← Volver a trabajos
          </Link>
        </nav>
      </RevealOnView>

      <TrabajoGalleryList sources={gallery} title={post.title} />

      <RevealOnView delayMs={80}>
        <header className="mx-auto mt-12 max-w-2xl border-t border-wood/15 pt-10">
          <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-wood">{post.category}</p>
          <h1 className="m-0 mt-2 text-2xl font-semibold leading-tight tracking-tight text-paper md:text-3xl">
            {post.title}
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-paper/50">{post.dateLabel}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/78 md:text-[0.95rem]">{post.excerpt}</p>
        </header>
      </RevealOnView>

      <RevealOnView delayMs={120}>
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="space-y-4 text-sm leading-relaxed text-paper/75">
            {post.paragraphs.map((p, i) => (
              <p key={i} className="m-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink variant="ghost" to="/trabajos" className="rounded-sm px-5 py-2.5 text-sm">
              ← Trabajos
            </ButtonLink>
          </div>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
