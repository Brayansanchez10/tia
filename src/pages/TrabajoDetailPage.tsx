import { Link } from 'react-router-dom'
import type { TrabajoPost } from '@/content/site'
import { trabajoGallerySrcs } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { TrabajoGalleryList } from '@/components/trabajos/TrabajoGallery'
import { ButtonLink } from '@/components/ui/ButtonLink'

const backLinkClass =
  'inline-flex text-sm font-medium text-luxury-muted no-underline transition-colors hover:text-luxury-gold hover:underline'

export function TrabajoDetailPage({ post }: { post: TrabajoPost }) {
  const gallery = trabajoGallerySrcs(post)

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <nav className="mb-8" aria-label="Ruta">
            <Link to="/trabajos" className={backLinkClass}>
              ← Volver a trabajos
            </Link>
          </nav>
        </RevealOnView>

        <TrabajoGalleryList sources={gallery} title={post.title} />

        <RevealOnView delayMs={80} variant="fadeUp">
          <header className="mx-auto mt-12 max-w-2xl border-t border-white/10 pt-10 text-center md:text-left">
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">{post.category}</p>
            <h1 className="m-0 mt-3 font-serif text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold leading-tight tracking-wide text-paper md:text-4xl">
              {post.title}
            </h1>
            <GrowLine className="mt-5 mx-auto md:mx-0" />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-luxury-muted">{post.dateLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-paper/85 md:text-[0.95rem]">{post.excerpt}</p>
          </header>
        </RevealOnView>

        <RevealOnView delayMs={120} variant="fadeUp">
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="space-y-4 text-sm leading-relaxed text-luxury-muted">
              {post.paragraphs.map((p, i) => (
                <p key={i} className="m-0">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10 border-t border-white/10 pt-8">
              <ButtonLink
                variant="luxuryOutline"
                to="/trabajos"
                className="rounded-sm px-6 py-2.5 text-xs uppercase tracking-[0.16em]"
              >
                ← Trabajos
              </ButtonLink>
            </div>
          </div>
        </RevealOnView>
      </div>
    </div>
  )
}
