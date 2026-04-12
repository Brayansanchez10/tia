import type { ServiceItem } from '@/content/site'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { RevealOnView } from '@/components/motion/RevealOnView'

const HERO_BG = '/img/Fondo.jpg'

function HomeFeaturePanel({
  index,
  title,
  tagline,
  text,
  overlapLeft,
}: {
  index: number
  title: string
  tagline: string
  text: string
  overlapLeft: boolean
}) {
  return (
    <div
      className={[
        'relative flex min-w-0 flex-col justify-center border border-wood/15 bg-cream/95 p-6 shadow-card backdrop-blur-[2px] motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:border-gold/25 motion-safe:hover:shadow-card-hover sm:p-8 md:max-w-lg md:p-10 lg:p-12',
        overlapLeft
          ? 'md:translate-x-4 lg:translate-x-10 xl:translate-x-14'
          : 'md:-translate-x-4 md:justify-self-end lg:-translate-x-10 xl:-translate-x-14',
      ].join(' ')}
    >
      <p className="m-0 font-mono text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-gold/85">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h2 className="m-0 mt-2 text-2xl font-medium tracking-tight text-paper md:text-3xl">{title}</h2>
      <p className="mt-2 text-base font-medium leading-snug text-wood/95 md:text-[1.05rem]">{tagline}</p>
      <p className="mt-4 text-[1.02rem] leading-relaxed text-paper/80">{text}</p>
      <div className="mt-8">
        <ButtonLink
          variant="primary"
          to="/servicios"
          className="w-full justify-center rounded-sm px-6 py-2.5 text-sm uppercase tracking-wide sm:w-auto"
        >
          Saber más
        </ButtonLink>
      </div>
    </div>
  )
}

function HomeFeatureImage({ layout = 'desktop' }: { layout?: 'desktop' | 'mobile' }) {
  if (layout === 'mobile') {
    return (
      <div className="group relative aspect-16/10 w-full max-h-[200px] overflow-hidden rounded-lg bg-wood-dark sm:max-h-[240px]">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-[1.1s] motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-linear-to-br from-wood-dark/60 via-ink/35 to-gold/10 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-90"
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className="group relative min-h-[min(52vw,280px)] overflow-hidden rounded-sm bg-wood-dark sm:min-h-[280px] md:min-h-[360px] lg:min-h-[420px]">
      <img
        src={HERO_BG}
        alt=""
        className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1.1s] motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-linear-to-br from-wood-dark/60 via-ink/35 to-gold/10 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  )
}

function HomeServiceSlideMobile({ item, index }: { item: ServiceItem; index: number }) {
  return (
    <article className="w-full min-w-0 shrink-0 grow-0 basis-full snap-center snap-always">
      <div className="flex min-w-0 flex-col gap-5">
        <HomeFeatureImage layout="mobile" />
        <HomeFeaturePanel
          index={index}
          title={item.name}
          tagline={item.tagline}
          text={item.description}
          overlapLeft={false}
        />
      </div>
    </article>
  )
}

function HomeServiceArticleDesktop({ item, index }: { item: ServiceItem; index: number }) {
  const isOdd = index % 2 === 1
  return (
    <RevealOnView delayMs={index * 100}>
      <article className="isolate grid min-w-0 gap-8 sm:gap-10 md:grid-cols-2 md:items-center md:gap-8 lg:gap-12">
        {isOdd ? (
          <>
            <HomeFeatureImage layout="desktop" />
            <HomeFeaturePanel
              index={index}
              title={item.name}
              tagline={item.tagline}
              text={item.description}
              overlapLeft={false}
            />
          </>
        ) : (
          <>
            <HomeFeaturePanel
              index={index}
              title={item.name}
              tagline={item.tagline}
              text={item.description}
              overlapLeft
            />
            <HomeFeatureImage layout="desktop" />
          </>
        )}
      </article>
    </RevealOnView>
  )
}

export function HomePage() {
  const { home, services } = site

  return (
    <div className="pt-0">
      <section
        aria-label="Presentación"
        className="relative flex min-h-[calc(100svh-env(safe-area-inset-top,0px)-5rem)] w-full flex-col justify-center bg-ink pt-10 pb-[max(2.75rem,env(safe-area-inset-bottom,0px)+1.25rem)] sm:pt-12 sm:pb-12 md:min-h-[min(88vh,820px)] md:justify-center md:pt-28 md:pb-24"
      >
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_42%] max-md:object-[center_40%]"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/80 to-ink/40 md:bg-linear-to-r md:from-ink/90 md:via-ink/55 md:to-ink/25"
          aria-hidden
        />

        <div className="home-hero-reveal relative z-1 mx-auto flex w-full min-w-0 max-w-[65rem] flex-col items-center px-4 text-center sm:px-6 md:items-start md:px-10 md:text-left">
          <h1 className="mb-4 w-full max-w-[min(100%,22rem)] text-balance text-[clamp(1.75rem,5.2vw+0.6rem,2.35rem)] font-semibold leading-[1.1] tracking-tight text-paper sm:mb-5 sm:max-w-xl sm:text-4xl md:max-w-[18ch] md:text-5xl lg:text-6xl">
            {home.heroTitle}
          </h1>
          <p className="mb-8 w-full max-w-xl text-pretty text-base leading-relaxed text-paper/90 sm:mb-10 sm:text-lg md:text-xl">
            {home.heroLead}
          </p>
          <div className="flex w-full min-w-0 max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center md:max-w-none md:justify-start">
            <ButtonLink
              variant="primary"
              to={home.ctaPrimary.to}
              className="w-full justify-center rounded-sm px-6 uppercase tracking-wide sm:w-auto"
            >
              {home.ctaPrimary.label}
            </ButtonLink>
            <ButtonLink variant="heroGhost" to={home.ctaSecondary.to} className="w-full justify-center sm:w-auto">
              {home.ctaSecondary.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        className="w-full bg-wood-dark px-4 pb-16 pt-12 sm:px-5 sm:pb-20 sm:pt-14 md:px-8 md:pb-28 md:pt-20"
        aria-labelledby="home-features-heading"
      >
        <div className="mx-auto min-w-0 max-w-[72rem]">
          <h2 id="home-features-heading" className="sr-only">
            Servicios
          </h2>

          {/* Móvil: un servicio por pantalla, deslizar horizontal (no afecta escritorio). */}
          <RevealOnView className="md:hidden">
            <div className="min-w-0">
              <div
                role="region"
                aria-roledescription="carrusel"
                aria-label="Servicios. Desliza a los lados para ver cada uno."
                tabIndex={0}
                className="-mx-4 flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth scroll-pl-4 scroll-pr-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {services.items.map((item, i) => (
                  <HomeServiceSlideMobile key={item.name} item={item} index={i} />
                ))}
              </div>
              <p className="mt-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper/45">
                Desliza para ver más servicios
              </p>
            </div>
          </RevealOnView>

          {/* Escritorio: mismo diseño en dos columnas y orden alterno. */}
          <div className="hidden flex-col gap-14 sm:gap-20 md:flex md:gap-32">
            {services.items.map((item, i) => (
              <HomeServiceArticleDesktop key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
