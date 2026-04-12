import { Link, Navigate, useParams } from 'react-router-dom'
import { site, trabajoGallerySrcs } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { PageHeader, PageSection } from '@/components/ui/PageShell'

export function TrabajoDetailPage() {
  const { slug } = useParams()
  const post = site.trabajos.items.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/trabajos" replace />
  }

  const gallery = trabajoGallerySrcs(post)

  return (
    <PageSection>
      <RevealOnView>
        <nav
          className="mb-8 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-wood/15 bg-cream/90 px-4 py-2.5 text-sm text-wood-dark/80 shadow-sm"
          aria-label="Ruta"
        >
          <Link to="/trabajos" className="font-semibold text-wood no-underline hover:text-gold hover:underline">
            Trabajos
          </Link>
          <span className="text-gold/90" aria-hidden>
            /
          </span>
          <span className="min-w-0 truncate text-wood-dark/75">{post.title}</span>
        </nav>
      </RevealOnView>

      <RevealOnView delayMs={60}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start lg:gap-12 xl:gap-14">
          <div className="order-2 flex min-w-0 flex-col gap-6 lg:order-1 lg:gap-7">
            {gallery.length > 0 ? (
              gallery.map((src, i) => (
                <figure
                  key={`${src}-${i}`}
                  className="m-0 overflow-hidden rounded-sm border border-wood/15 bg-ink shadow-[0_18px_50px_rgba(0,0,0,0.12)] ring-1 ring-inset ring-paper/5"
                >
                  <img
                    src={src}
                    alt={
                      gallery.length > 1
                        ? `Fotografía ${i + 1} de ${gallery.length} — ${post.title}`
                        : `Fotografía del proyecto: ${post.title}`
                    }
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="block w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-[1.015] max-h-[min(78vh,560px)] min-h-[12rem]"
                  />
                </figure>
              ))
            ) : (
              <div
                className="flex aspect-[4/5] min-h-[14rem] w-full items-end justify-start overflow-hidden rounded-sm border border-wood/15 bg-[radial-gradient(ellipse_at_30%_20%,rgba(203,161,75,0.35),transparent_55%),linear-gradient(120deg,#3c280d,#000000)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] md:aspect-[3/4] md:max-h-[min(72vh,520px)]"
                aria-hidden
              >
                <span className="max-w-[12rem] text-xs font-medium uppercase tracking-[0.15em] text-paper/45">
                  Añade image o images en site.ts
                </span>
              </div>
            )}
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+5.75rem)] lg:self-start">
            <PageHeader eyebrow={post.category} title={post.title} meta={post.dateLabel} />

            <p className="mb-8 text-pretty text-[1.08rem] leading-relaxed text-wood-dark/88 md:text-[1.12rem]">
              {post.excerpt}
            </p>

            <div className="border-l-[3px] border-gold/90 pl-6 md:pl-7">
              <div className="flex flex-col gap-5 text-[1.05rem] leading-relaxed text-wood-dark/86 md:gap-6 md:text-[1.06rem]">
                {post.paragraphs.map((p, i) => (
                  <p key={i} className="m-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-wood/12 pt-8">
              <ButtonLink variant="ghost" to="/trabajos" className="rounded-sm px-5">
                ← Volver a trabajos
              </ButtonLink>
            </div>
          </div>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
