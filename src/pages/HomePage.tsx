import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { RevealOnView } from '@/components/motion/RevealOnView'

const HERO_BG = '/img/Fondo.jpg'

function HomeFeaturePanel({
  title,
  text,
  overlapLeft,
}: {
  title: string
  text: string
  overlapLeft: boolean
}) {
  return (
    <div
      className={[
        'relative flex flex-col justify-center border border-wood/12 bg-cream/95 p-8 shadow-card backdrop-blur-[2px] motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-card-hover md:max-w-lg md:p-10 lg:p-12',
        overlapLeft
          ? 'md:translate-x-4 lg:translate-x-10 xl:translate-x-14'
          : 'md:-translate-x-4 md:justify-self-end lg:-translate-x-10 xl:-translate-x-14',
      ].join(' ')}
    >
      <h2 className="m-0 text-2xl font-medium lowercase tracking-wide text-wood-dark md:text-3xl">
        {title.toLowerCase()}
      </h2>
      <p className="mt-5 text-[1.02rem] leading-relaxed text-wood-dark/85">{text}</p>
      <div className="mt-8">
        <ButtonLink
          variant="primary"
          to="/servicios"
          className="rounded-sm px-6 py-2.5 text-sm uppercase tracking-wide"
        >
          Saber más
        </ButtonLink>
      </div>
    </div>
  )
}

function HomeFeatureImage() {
  return (
    <div className="group relative min-h-[280px] overflow-hidden rounded-sm bg-wood-dark md:min-h-[360px] lg:min-h-[420px]">
      <img
        src={HERO_BG}
        alt=""
        className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1.1s] motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-wood-dark/55 via-ink/25 to-gold/10 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  )
}

export function HomePage() {
  const { home } = site

  return (
    <div className="pt-0">
      <section
        aria-label="Presentación"
        className="relative flex min-h-[min(88vh,820px)] w-full flex-col justify-end bg-ink pb-16 pt-32 md:justify-center md:pb-24 md:pt-28"
      >
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35 md:bg-gradient-to-r md:from-ink/90 md:via-ink/55 md:to-ink/25"
          aria-hidden
        />

        <div className="home-hero-reveal relative z-[1] mx-auto flex w-full max-w-[65rem] flex-col items-center px-6 text-center md:items-start md:px-10 md:text-left">
          <p className="mb-4 max-w-xl text-xs font-semibold uppercase tracking-[0.22em] text-gold md:text-sm">
            {home.heroEyebrow}
          </p>
          <h1 className="mb-5 max-w-[20ch] text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-paper md:max-w-[18ch] md:text-5xl lg:text-6xl">
            {home.heroTitle}
          </h1>
          <p className="mb-10 max-w-xl text-pretty text-lg leading-relaxed text-paper/90 md:text-xl">
            {home.heroLead}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <ButtonLink variant="primary" to={home.ctaPrimary.to} className="rounded-sm px-6 uppercase tracking-wide">
              {home.ctaPrimary.label}
            </ButtonLink>
            <ButtonLink variant="heroGhost" to={home.ctaSecondary.to}>
              {home.ctaSecondary.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        className="w-full bg-paper px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20"
        aria-labelledby="home-features-heading"
      >
        <div className="mx-auto max-w-[72rem]">
          <h2 id="home-features-heading" className="sr-only">
            Destacados
          </h2>
          <div className="flex flex-col gap-24 md:gap-32">
            {home.blocks.map((block, i) => {
              const isOdd = i % 2 === 1
              return (
                <RevealOnView key={block.title} delayMs={i * 100}>
                  <article className="isolate grid gap-10 md:grid-cols-2 md:items-center md:gap-8 lg:gap-12">
                    {isOdd ? (
                      <>
                        <HomeFeatureImage />
                        <HomeFeaturePanel title={block.title} text={block.text} overlapLeft={false} />
                      </>
                    ) : (
                      <>
                        <HomeFeaturePanel title={block.title} text={block.text} overlapLeft />
                        <HomeFeatureImage />
                      </>
                    )}
                  </article>
                </RevealOnView>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
