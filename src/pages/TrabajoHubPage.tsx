import { Link } from 'react-router-dom'
import type { TrabajoChild, TrabajoPost } from '@/content/site'
import { trabajoChildCoverSrc } from '@/content/site'
import { PortfolioWorkCard } from '@/components/trabajos/PortfolioWorkCard'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageSection } from '@/components/ui/PageShell'

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
    />
  )
}

export function TrabajoHubPage({ post }: { post: TrabajoPost }) {
  const children = post.children!

  return (
    <PageSection>
      <RevealOnView>
        <nav className="mb-8" aria-label="Ruta">
          <Link
            to="/trabajos"
            className="inline-flex text-sm font-medium text-wood no-underline transition-colors hover:text-gold hover:underline"
          >
            ← Trabajos
          </Link>
        </nav>
      </RevealOnView>

      <RevealOnView delayMs={40}>
        <header className="mx-auto mb-12 max-w-2xl">
          <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-wood">{post.category}</p>
          <h1 className="m-0 mt-2 text-2xl font-semibold leading-tight tracking-tight text-paper md:text-3xl">
            {post.title}
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-paper/50">{post.dateLabel}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/78 md:text-[0.95rem]">{post.excerpt}</p>
          {post.paragraphs.length > 0 ? (
            <div className="mt-6 space-y-3 text-sm leading-relaxed text-paper/70">
              {post.paragraphs.map((p, i) => (
                <p key={i} className="m-0">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </header>
      </RevealOnView>

      <p className="mx-auto mb-6 max-w-2xl text-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-paper/45 md:text-left">
        Exhibiciones en este proyecto
      </p>
      <ul className="m-0 flex list-none flex-col gap-10 p-0 md:gap-12">
        {children.map((child, i) => (
          <li key={child.slug}>
            <RevealOnView delayMs={i * 80}>
              <HubChildCard parentSlug={post.slug} child={child} />
            </RevealOnView>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-12 max-w-2xl text-center md:text-left">
        <Link
          to="/trabajos"
          className="text-sm font-medium text-wood no-underline transition-colors hover:text-gold hover:underline"
        >
          ← Volver a todos los trabajos
        </Link>
      </div>
    </PageSection>
  )
}
