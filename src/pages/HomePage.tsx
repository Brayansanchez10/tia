import { useEffect, useRef, type RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HeroHomeVisual } from '@/components/home/HeroHomeVisual'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { site, trabajoCoverSrc, trabajoExcerptText, type TrabajoPost } from '@/content/site'
import { usePortfolio } from '@/lib/portfolio/PortfolioProvider'
import { TRABAJO_CATEGORY_META } from '@/pages/trabajosCategoryShared'

/** Render 3D del hero (fondo negro integrado). */
const HERO_VISUAL = '/img/fondoHome.png'
const MARKETING_IMAGE = '/img/homeMarketing.jpeg'
const MARKETING_POINTS = [
  'Pensado en tu cliente final',
  'Instalado con personal asegurado',
  'Entregado con garantía real',
] as const

function useHeroDrift(target: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const node = target.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fine = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    if (!fine.matches) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 520) * 0.07
        node.style.transform = `translate3d(0, ${y}px, 0)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      node.style.transform = ''
    }
  }, [target])
}

function SamplePhoto({
  src,
  eager,
  ratio = 'aspect-[4/3]',
}: {
  src?: string
  eager?: boolean
  ratio?: string
}) {
  return (
    <div className={['relative overflow-hidden bg-luxury-panel', ratio].join(' ')}>
      {src ? (
        <img
          src={src}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
        />
      ) : null}
    </div>
  )
}

function SampleCard({ post, index }: { post: TrabajoPost; index: number }) {
  const cover = trabajoCoverSrc(post)
  const excerpt = trabajoExcerptText(post.excerpt)

  return (
    <li className="min-w-0">
      <RevealOnView delayMs={Math.min(index * 60, 240)} variant="fadeUp" className="h-full">
        <Link
          to={`/trabajos/${post.slug}`}
          state={{ trabajosVolver: '/' }}
          className="group flex h-full flex-col no-underline outline-none hover:no-underline focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-4 focus-visible:ring-offset-luxury-bg"
          aria-label={`Ver proyecto: ${post.title}`}
        >
          <SamplePhoto src={cover} />
          <div className="flex flex-1 flex-col border-t border-white/12 pt-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-luxury-gold">
                {post.category}
              </p>
              <span className="font-mono text-[0.65rem] tabular-nums text-paper/40">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="m-0 mt-1.5 font-serif text-lg font-semibold leading-snug text-paper transition-colors duration-300 group-hover:text-brand sm:text-xl">
              {post.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-luxury-muted">{excerpt}</p>
          </div>
        </Link>
      </RevealOnView>
    </li>
  )
}

function LeadSample({ post }: { post: TrabajoPost }) {
  const cover = trabajoCoverSrc(post)
  const excerpt = trabajoExcerptText(post.excerpt)
  const highlights = post.highlights?.slice(0, 3)

  return (
    <RevealOnView variant="fadeUp">
      <Link
        to={`/trabajos/${post.slug}`}
        state={{ trabajosVolver: '/' }}
        className="group grid no-underline outline-none hover:no-underline focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-4 focus-visible:ring-offset-luxury-bg lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.72fr)] lg:items-stretch lg:gap-10"
        aria-label={`Ver proyecto: ${post.title}`}
      >
        <SamplePhoto src={cover} eager ratio="aspect-[4/3] sm:aspect-[16/10]" />
        <div className="flex flex-col justify-center border-white/12 pt-4 lg:border-l lg:py-2 lg:pl-8">
          <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
            {post.category} · {post.dateLabel}
          </p>
          <h3 className="m-0 mt-3 font-serif text-2xl font-semibold leading-tight text-paper transition-colors duration-300 group-hover:text-brand sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-luxury-muted">{excerpt}</p>
          {highlights && highlights.length > 0 ? (
            <ul className="m-0 mt-5 list-none space-y-2 p-0">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-paper/88">
                  <span className="mt-2 h-px w-4 shrink-0 bg-brand" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <span className="mt-6 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-brand">
            Ver proyecto
            <span aria-hidden className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </RevealOnView>
  )
}

function SampleGroup({
  label,
  posts,
  startIndex,
  withLead,
  columns = 3,
}: {
  label: string
  posts: readonly TrabajoPost[]
  startIndex: number
  withLead?: boolean
  columns?: 2 | 3
}) {
  if (posts.length === 0) return null
  const lead = withLead ? posts[0] : undefined
  const cards = withLead ? posts.slice(1) : posts

  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <p className="m-0 shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper/80">{label}</p>
        <span className="h-px flex-1 bg-white/12" aria-hidden />
      </div>
      {lead ? <LeadSample post={lead} /> : null}
      {cards.length > 0 ? (
        <ul
          className={[
            'm-0 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 sm:grid-cols-2',
            columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3',
            lead ? 'mt-8 sm:mt-10' : '',
          ].join(' ')}
        >
          {cards.map((post, i) => (
            <SampleCard key={post.slug} post={post} index={startIndex + i} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function HomePage() {
  const { home, services, about, footer } = site
  const { items, featuredSlugs } = usePortfolio()
  const location = useLocation()
  const driftRef = useRef<HTMLDivElement>(null)
  useHeroDrift(driftRef)

  const featured = featuredSlugs
    .map((slug) => items.find((p) => p.slug === slug))
    .filter((p): p is TrabajoPost => Boolean(p))

  const commercial = featured.filter((post) => post.portfolioKind === 'corporativo')
  const residential = featured.filter((post) => post.portfolioKind === 'residencial')
  const closeCover = trabajoCoverSrc(featured[2] ?? featured[0])

  useEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash, location.pathname, location.key])

  return (
    <div className="bg-luxury-bg pt-0">
      <section
        id="inicio"
        aria-label="Presentación"
        className="relative flex flex-col overflow-hidden bg-black md:min-h-svh"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 78% 42%, rgb(154 0 32 / 0.2), transparent 60%), radial-gradient(ellipse 40% 30% at 12% 88%, rgb(184 149 108 / 0.12), transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[90rem] flex-1 items-center gap-5 px-4 pb-8 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] md:grid-rows-[auto_auto] md:gap-x-6 md:gap-y-8 md:px-8 md:pb-10 md:pt-24 lg:px-12">
          <div className="home-hero-reveal relative z-20 max-w-xl md:col-start-1 md:row-start-1">
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold sm:tracking-[0.34em]">
              {site.tagline}
            </p>
            <h1 className="mt-3 font-serif text-[clamp(2.45rem,10vw,7.1rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-paper md:mt-4 md:leading-[0.86]">
              <span className="block">Marketing</span>
              <span className="mt-1 block md:pl-[0.55em]">— Pop</span>
            </h1>
          </div>

          <div ref={driftRef} className="relative z-10 min-w-0 md:col-start-2 md:row-span-2 md:row-start-1 md:-mr-6 lg:-mr-10">
            <HeroHomeVisual
              src={HERO_VISUAL}
              alt="Mostrador comercial de madera, pieza de Marketing — Pop"
              presentation="float"
              interactive
            />
          </div>

          <div className="home-hero-reveal relative z-20 max-w-xl md:col-start-1 md:row-start-2 md:pb-6">
            <p className="max-w-[22ch] text-balance font-sans text-[1.05rem] font-semibold leading-snug text-paper/95 sm:text-[clamp(1.15rem,2vw+0.35rem,1.55rem)]">
              {home.heroTitle}
            </p>
            <p className="mt-3 max-w-md text-pretty text-[0.98rem] leading-relaxed text-paper/78 sm:mt-4 sm:text-lg">
              {home.heroLead}
            </p>
            <div className="home-hero-cta-group mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
              <ButtonLink
                variant="primary"
                to={home.ctaPrimary.to}
                className="min-h-12 w-full justify-center rounded-md px-7 text-sm font-semibold uppercase tracking-[0.14em] sm:w-auto"
              >
                {home.ctaPrimary.label}
              </ButtonLink>
              <ButtonLink
                variant="luxuryOutline"
                to={home.ctaSecondary.to}
                className="min-h-12 w-full justify-center rounded-md px-7 text-sm tracking-[0.14em] sm:w-auto"
              >
                {home.ctaSecondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-featured-heading"
        className="relative overflow-hidden bg-luxury-bg px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 md:px-8 md:pb-24 md:pt-20 lg:px-10"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-linear-to-b from-black to-transparent"
          aria-hidden
        />
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="flex flex-col gap-5 border-b border-white/12 pb-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <RevealOnView variant="fadeUp">
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                Portafolio
              </p>
              <h2
                id="home-featured-heading"
                className="mt-3 max-w-[18ch] scroll-mt-28 text-balance font-serif text-[clamp(1.85rem,7vw,3.15rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper sm:max-w-none"
              >
                {home.featuredHeading}
              </h2>
            </RevealOnView>
            <RevealOnView delayMs={80} variant="fadeUp" className="md:max-w-sm md:pb-1 md:text-right">
              <p className="text-base leading-relaxed text-luxury-muted">{home.featuredLead}</p>
              <Link
                to={home.featuredCta.to}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.16em] text-brand no-underline hover:text-paper"
              >
                {home.featuredCta.label} →
              </Link>
            </RevealOnView>
          </div>

          <div className="mt-10 space-y-14 md:mt-12">
            <SampleGroup
              label={TRABAJO_CATEGORY_META.corporativo.title}
              posts={commercial}
              startIndex={0}
              withLead
            />
            <SampleGroup
              label={TRABAJO_CATEGORY_META.residencial.title}
              posts={residential}
              startIndex={0}
              columns={2}
            />
          </div>
        </div>
      </section>

      <section
        id="servicios"
        aria-labelledby="servicios-heading"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] border-t border-white/10 bg-luxury-panel px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24 lg:px-10"
      >
        <div className="mx-auto grid w-full max-w-[90rem] gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <RevealOnView variant="fadeRight" className="lg:sticky lg:top-28 lg:self-start">
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {services.pageEyebrow}
            </p>
            <h2
              id="servicios-heading"
              className="mt-3 max-w-[16ch] font-serif text-[clamp(2rem,8vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-paper sm:max-w-[12ch] lg:max-w-[10ch]"
            >
              Del plano al punto de venta
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-luxury-muted md:text-lg">{services.intro}</p>
          </RevealOnView>

          <ol className="m-0 list-none p-0">
            {services.items.map((item, i) => (
              <li key={item.name} className="last:border-b last:border-white/12">
                <RevealOnView delayMs={Math.min(i * 50, 200)} variant="fadeUp">
                  <article className="home-service-row group border-t border-white/12 py-6 sm:py-7">
                    <div className="grid grid-cols-[3.2rem_minmax(0,1fr)] gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-5">
                      <span className="home-service-num pt-1 font-serif text-2xl font-semibold tabular-nums tracking-tight text-luxury-gold transition-colors duration-300 sm:text-3xl">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h3 className="m-0 font-serif text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                          {item.name}
                        </h3>
                        <p className="mt-1.5 text-base font-medium text-paper/88">{item.tagline}</p>
                        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-luxury-muted sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </RevealOnView>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="nosotros"
        aria-labelledby="nosotros-heading"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24 lg:px-10"
      >
        <div className="mx-auto grid w-full max-w-[90rem] items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.8fr)] lg:gap-8">
          <div>
            <RevealOnView variant="fadeUp">
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                {about.pageEyebrow}
              </p>
              <h2
                id="nosotros-heading"
                className="mt-3 max-w-[16ch] font-serif text-[clamp(1.9rem,7.5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-paper sm:max-w-[14ch]"
              >
                {about.title}
              </h2>
            </RevealOnView>
            <div className="mt-8 max-w-2xl space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <RevealOnView key={paragraph.slice(0, 24)} delayMs={i * 60} variant="fadeUp">
                  <p
                    className={
                      i === 0
                        ? 'font-serif text-[clamp(1.35rem,2vw+0.6rem,1.85rem)] font-medium leading-snug text-paper'
                        : 'text-base leading-relaxed text-luxury-muted md:text-lg'
                    }
                  >
                    {paragraph}
                  </p>
                </RevealOnView>
              ))}
            </div>

            <ul className="m-0 mt-10 list-none space-y-3 p-0">
              {MARKETING_POINTS.map((point, i) => (
                <li key={point}>
                  <RevealOnView delayMs={80 + i * 70} variant="fadeRight">
                    <p
                      className={[
                        'm-0 font-serif text-[clamp(1.2rem,5vw,2.15rem)] font-semibold leading-tight tracking-[-0.02em] text-paper',
                        i === 1 ? 'sm:pl-5' : '',
                        i === 2 ? 'sm:pl-10' : '',
                      ].join(' ')}
                    >
                      <span className="mr-3 text-brand" aria-hidden>
                        —
                      </span>
                      {point}
                    </p>
                  </RevealOnView>
                </li>
              ))}
            </ul>
            <RevealOnView delayMs={120} variant="fadeUp">
              <p className="mt-8 max-w-md text-lg font-medium text-paper/90">
                Trabajos bien hechos, a precio justo. Así de simple.
              </p>
            </RevealOnView>
          </div>

          <RevealOnView variant="clip" className="lg:mt-24">
            <figure className="relative m-0 lg:-mr-6">
              <img
                src={MARKETING_IMAGE}
                alt="Mostrador comercial fabricado e instalado por Marketing — Pop"
                className="aspect-[16/11] w-full object-cover sm:aspect-[5/4] lg:aspect-[3/4]"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 max-w-[22ch] text-sm leading-snug text-luxury-muted">
                Mobiliario comercial para espacios que venden mejor
              </figcaption>
            </figure>
          </RevealOnView>
        </div>
      </section>

      <section aria-labelledby="home-close-heading" className="relative min-h-[28rem] overflow-hidden sm:min-h-[70svh]">
        {closeCover ? (
          <img
            src={closeCover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/72" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgb(154_0_32_/_0.35),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-[90rem] flex-col justify-end px-4 py-10 sm:min-h-[70svh] sm:px-6 sm:py-16 md:px-10 md:py-20">
          <RevealOnView variant="fadeUp">
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {site.tagline}
            </p>
            <h2
              id="home-close-heading"
              className="mt-4 max-w-[16ch] text-balance font-serif text-[clamp(2.05rem,8vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:max-w-[12ch] sm:leading-[0.9]"
            >
              {footer.ctaEyebrow}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/82 sm:text-lg">{footer.ctaLead}</p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
              <ButtonLink
                variant="primary"
                to="/contacto"
                className="min-h-12 w-full justify-center rounded-md px-7 text-sm font-semibold uppercase tracking-[0.14em] sm:w-auto"
              >
                Solicitar cotización
              </ButtonLink>
              <ButtonLink
                variant="luxuryOutline"
                to="/trabajos"
                className="min-h-12 w-full justify-center rounded-md px-7 text-sm tracking-[0.14em] sm:w-auto"
              >
                Ver proyectos
              </ButtonLink>
            </div>
          </RevealOnView>
        </div>
      </section>
    </div>
  )
}
