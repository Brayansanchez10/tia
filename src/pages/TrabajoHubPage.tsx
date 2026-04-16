import { Link } from 'react-router-dom'
import type { TrabajoChild, TrabajoPost } from '@/content/site'
import { trabajoChildCoverSrc } from '@/content/site'
import { PortfolioWorkCard } from '@/components/trabajos/PortfolioWorkCard'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'

function HubChildCard({ parentSlug, child }: { parentSlug: string; child: TrabajoChild }) {
  const cover = trabajoChildCoverSrc(child)
  return (
    <PortfolioWorkCard
      to={`/trabajos/${parentSlug}/${child.slug}`}
      coverSrc={cover}
      category={child.category}
      title={child.title}
      excerpt={child.excerpt}
      ctaLabel="Ver exhibición"
      ariaLabel={`Ver exhibición: ${child.title}`}
      layout="grid"
    />
  )
}

const backLinkClass =
  'inline-flex text-sm font-medium text-luxury-muted no-underline transition-colors hover:text-luxury-gold hover:underline'

export function TrabajoHubPage({ post }: { post: TrabajoPost }) {
  const children = post.children!

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pt-12">
        <RevealOnView>
          <nav className="mb-8" aria-label="Ruta">
            <Link to="/trabajos" className={backLinkClass}>
              ← Trabajos
            </Link>
          </nav>
        </RevealOnView>

        <RevealOnView delayMs={40} variant="fadeUp">
          <header className="mx-auto max-w-2xl text-center md:text-left">
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">{post.category}</p>
            <h1 className="m-0 mt-3 font-serif text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold leading-tight tracking-wide text-paper md:text-4xl">
              {post.title}
            </h1>
            <GrowLine className="mt-5 mx-auto md:mx-0" />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-luxury-muted">{post.dateLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-paper/85 md:text-[0.95rem]">{post.excerpt}</p>
            {post.paragraphs.length > 0 ? (
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-luxury-muted">
                {post.paragraphs.map((p, i) => (
                  <p key={i} className="m-0">
                    {p}
                  </p>
                ))}
              </div>
            ) : null}
          </header>
        </RevealOnView>

        <RevealOnView delayMs={80} variant="fadeDown">
          <p className="mx-auto mb-8 mt-14 max-w-2xl text-center text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-luxury-gold md:mt-16 md:text-left">
            Exhibiciones en este proyecto
          </p>
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:gap-7 md:grid-cols-2 md:gap-8 lg:gap-10">
            {children.map((child, i) => (
              <li key={child.slug} className="min-w-0">
                <RevealOnView delayMs={Math.min(i * 70, 280)} variant="scale">
                  <HubChildCard parentSlug={post.slug} child={child} />
                </RevealOnView>
              </li>
            ))}
          </ul>
        </RevealOnView>

        <RevealOnView delayMs={100}>
          <div className="mx-auto mt-14 max-w-2xl border-t border-white/10 pt-10 text-center md:text-left">
            <Link to="/trabajos" className={backLinkClass}>
              ← Volver a todos los trabajos
            </Link>
          </div>
        </RevealOnView>
      </div>
    </div>
  )
}
