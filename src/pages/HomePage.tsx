import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site, trabajoCoverSrc, trabajoExcerptText } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { RevealOnView } from '@/components/motion/RevealOnView'

const HERO_BG = '/img/Fondo.jpg'
const MARKETING_IMAGE = '/img/homeMarketing.jpeg'
const MARKETING_POINTS = [
  'Pensado en tu cliente final',
  'Instalado con personal asegurado',
  'Entregado con garantía real',
] as const

export function HomePage() {
  const { home, services, about, trabajos } = site
  const location = useLocation()

  const featured = home.featuredSlugs
    .map((slug) => trabajos.items.find((p) => p.slug === slug))
    .filter((p): p is (typeof trabajos.items)[number] => Boolean(p))

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
      {/* Hero full-bleed */}
      <section
        id="inicio"
        aria-label="Presentación"
        className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden"
      >
        <div className="absolute inset-0" aria-hidden>
          <img
            src={HERO_BG}
            alt=""
            className="home-hero-bg h-full w-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_18_16_/_0.55)_0%,rgb(20_18_16_/_0.72)_42%,rgb(20_18_16_/_0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_20%,rgb(154_0_32_/_0.22),transparent_58%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[72rem] px-4 pb-14 pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-10">
          <div className="home-hero-reveal max-w-2xl">
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-luxury-gold">
              {site.tagline}
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.35rem,8vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-paper">
              {home.heroBrand}
            </h1>
            <div className="section-rule mt-5" aria-hidden />
            <p className="mt-6 max-w-[22ch] text-balance font-sans text-[clamp(1.2rem,2.8vw+0.4rem,1.65rem)] font-semibold leading-snug tracking-tight text-paper/95">
              {home.heroTitle}
            </p>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-paper/82 sm:text-lg">
              {home.heroLead}
            </p>
            <div className="home-hero-cta-group mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
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

      {/* Proyectos destacados */}
      <section
        aria-labelledby="home-featured-heading"
        className="theme-section-alt border-t border-white/8 px-4 py-14 sm:px-6 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto w-full max-w-[72rem]">
          <RevealOnView variant="fadeUp">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
              <div className="min-w-0 max-w-2xl">
                <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                  Portafolio
                </p>
                <h2
                  id="home-featured-heading"
                  className="mt-3 font-serif text-[clamp(1.75rem,3vw+0.5rem,2.5rem)] font-semibold leading-tight tracking-tight text-paper"
                >
                  {home.featuredHeading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-luxury-muted md:text-lg">
                  {home.featuredLead}
                </p>
              </div>
              <ButtonLink
                variant="luxuryOutline"
                to={home.featuredCta.to}
                className="hidden shrink-0 justify-center rounded-md px-6 text-xs tracking-[0.16em] md:inline-flex"
              >
                {home.featuredCta.label}
              </ButtonLink>
            </div>
          </RevealOnView>

          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {featured.map((post, i) => {
              const cover = trabajoCoverSrc(post)
              const excerpt = trabajoExcerptText(post.excerpt)
              return (
                <li key={post.slug} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
                  <RevealOnView delayMs={Math.min(i * 60, 300)} variant="fadeUp">
                    <Link
                      to={`/trabajos/${post.slug}`}
                      state={{ trabajosVolver: '/' }}
                      className="group relative block overflow-hidden rounded-md border border-white/10 bg-luxury-panel no-underline outline-none transition-[border-color,transform] motion-safe:duration-300 hover:border-brand/40 hover:no-underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg motion-safe:hover:-translate-y-0.5"
                      aria-label={`Ver proyecto: ${post.title}`}
                    >
                      <div
                        className={[
                          'relative overflow-hidden bg-luxury-bg',
                          i === 0 ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]',
                        ].join(' ')}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            loading={i < 2 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-surface" aria-hidden />
                        )}
                        <div
                          className="absolute inset-0 bg-linear-to-t from-luxury-bg via-luxury-bg/25 to-transparent opacity-90"
                          aria-hidden
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                          <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
                            {post.category} · {post.dateLabel}
                          </p>
                          <h3
                            className={[
                              'm-0 mt-2 font-serif font-semibold leading-snug text-paper',
                              i === 0 ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl',
                            ].join(' ')}
                          >
                            {post.title}
                          </h3>
                          <p
                            className={[
                              'mt-2 line-clamp-2 text-sm leading-relaxed text-paper/78',
                              i === 0 ? 'max-w-xl sm:text-base' : '',
                            ].join(' ')}
                          >
                            {excerpt}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand">
                            Ver proyecto
                            <span aria-hidden className="transition-transform motion-safe:duration-200 group-hover:translate-x-0.5">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealOnView>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 md:hidden">
            <ButtonLink
              variant="luxuryOutline"
              to={home.featuredCta.to}
              className="min-h-12 w-full justify-center rounded-md text-xs tracking-[0.16em]"
            >
              {home.featuredCta.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Compromiso / valor */}
      <section
        aria-labelledby="home-marketing-heading"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] border-t border-white/8 px-4 py-14 sm:px-6 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto grid w-full max-w-[72rem] items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <RevealOnView variant="fadeUp">
            <div>
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
                Nuestro compromiso
              </p>
              <h2
                id="home-marketing-heading"
                className="mt-3 max-w-[22ch] font-serif text-[clamp(1.75rem,3vw+0.4rem,2.4rem)] font-semibold leading-tight text-paper"
              >
                Fabricamos muebles que trabajan para tu espacio
              </h2>
              <div className="section-rule mt-5" aria-hidden />
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/88">
                Sabemos que tu local es tu vitrina. Cada proyecto lo hacemos para que se vea bien, funcione mejor y te ayude a vender.
              </p>
              <ul className="m-0 mt-7 list-none space-y-3.5 p-0">
                {MARKETING_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base text-paper/90 md:text-lg">
                    <span
                      className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-brand/15 text-[0.7rem] font-bold text-brand"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-lg font-medium leading-snug text-paper md:text-xl">
                Trabajos bien hechos, a precio justo. Así de simple.
              </p>
              <div className="mt-8">
                <ButtonLink
                  variant="primary"
                  to="/contacto"
                  className="min-h-12 rounded-md px-7 text-sm uppercase tracking-[0.14em]"
                >
                  Quiero cotizar mi proyecto
                </ButtonLink>
              </div>
            </div>
          </RevealOnView>

          <RevealOnView delayMs={80} variant="fadeUp">
            <figure className="relative m-0 overflow-hidden rounded-md border border-white/10">
              <img
                src={MARKETING_IMAGE}
                alt="Mostrador comercial fabricado e instalado por Marketing — Pop"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] lg:aspect-[4/5]"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="absolute inset-x-0 bottom-0 m-0 bg-linear-to-t from-black/80 to-transparent px-4 pb-4 pt-16 text-sm text-white/90 sm:px-5 sm:pb-5">
                Mobiliario comercial para espacios que venden mejor
              </figcaption>
            </figure>
          </RevealOnView>
        </div>
      </section>

      {/* Nosotros */}
      <section
        id="nosotros"
        aria-labelledby="nosotros-heading"
        className="theme-section-alt scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] border-t border-white/8 px-4 py-14 sm:px-6 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto w-full max-w-[72rem]">
          <RevealOnView variant="fadeUp">
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {about.pageEyebrow}
            </p>
            <h2
              id="nosotros-heading"
              className="mt-3 max-w-[24ch] font-serif text-[clamp(1.75rem,3vw+0.4rem,2.4rem)] font-semibold leading-tight text-paper"
            >
              {about.title}
            </h2>
            <div className="section-rule mt-5" aria-hidden />
          </RevealOnView>

          <RevealOnView delayMs={70} variant="fadeUp">
            <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'text-base leading-relaxed text-paper/90 md:text-lg'
                      : 'text-base leading-relaxed text-luxury-muted md:text-[1.05rem]'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* Servicios */}
      <section
        id="servicios"
        aria-labelledby="servicios-heading"
        className="scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] border-t border-white/8 px-4 py-14 sm:px-6 md:px-8 md:py-20 lg:px-10"
      >
        <div className="mx-auto w-full max-w-[72rem]">
          <RevealOnView variant="fadeUp">
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              {services.pageEyebrow}
            </p>
            <h2
              id="servicios-heading"
              className="mt-3 font-serif text-[clamp(1.75rem,3vw+0.4rem,2.4rem)] font-semibold tracking-tight text-paper"
            >
              {services.title}
            </h2>
            <div className="section-rule mt-5" aria-hidden />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-luxury-muted md:text-lg">
              {services.intro}
            </p>
          </RevealOnView>

          <ul className="m-0 mt-12 list-none border-t border-white/10 p-0">
            {services.items.map((item, i) => (
              <li key={`${i}-${item.name}`} className="border-b border-white/10 py-8 md:py-10">
                <RevealOnView delayMs={Math.min(i * 40, 200)} variant="fadeUp">
                  <div className="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-8">
                    <span
                      className="font-mono text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-brand"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 font-serif text-xl font-semibold tracking-tight text-paper md:text-2xl">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-base font-medium text-paper/85">{item.tagline}</p>
                    </div>
                    <p className="text-[1.02rem] leading-relaxed text-luxury-muted md:pt-1">
                      {item.description}
                    </p>
                  </div>
                </RevealOnView>
              </li>
            ))}
          </ul>

          <RevealOnView delayMs={80} variant="fadeUp">
            <div className="mt-12 flex flex-col gap-4 rounded-md border border-white/10 bg-luxury-panel/80 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
              <div>
                <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
                  Siguiente paso
                </p>
                <p className="mt-2 text-base text-paper/90">
                  Agenda una visita o llamada para tu proyecto retail, POP o a medida.
                </p>
              </div>
              <ButtonLink
                variant="primary"
                to="/contacto"
                className="min-h-12 w-full shrink-0 justify-center rounded-md px-7 text-sm uppercase tracking-[0.14em] sm:w-auto"
              >
                Pedir cotización
              </ButtonLink>
            </div>
          </RevealOnView>
        </div>
      </section>
    </div>
  )
}
