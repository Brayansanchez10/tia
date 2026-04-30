import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroHomeVisual } from '@/components/home/HeroHomeVisual'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'

const HERO_BG = '/img/Fondo.jpg'
/** Hero principal (render 3D con fondo negro integrado). */
const HERO_VISUAL = '/img/fondoHome.png'
const MARKETING_IMAGE = '/img/homeMarketing.jpeg'
const MARKETING_POINTS = [
  'Pensado en tu cliente final',
  'Instalado con personal asegurado',
  'Entregado con garantia real',
] as const

/** Solo imágenes (sin repetir textos de servicios): taller + proyectos. */
const VISUAL_STRIP_IMAGES = [
  '/img/trabajos/comerciales/Lorel/M3.jpeg',
  '/img/trabajos/comerciales/popsy/M1.jpeg',
  '/img/trabajos/comerciales/Estanterias/m2.jpeg',
  '/img/trabajos/comerciales/Cali/M1.jpeg',
  '/img/trabajos/residenciales/cocinaIntegral/M7.jpeg',
  '/img/trabajos/residenciales/cocinaIntegralNegra/m4.png',
] as const

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function HomePage() {
  const { home, services, about } = site
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.add('home-scroll-snap')
    return () => document.documentElement.classList.remove('home-scroll-snap')
  }, [])

  useEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [location.hash, location.pathname, location.key])

  return (
    <div className="bg-luxury-bg pt-0">
      {/* Hero */}
      <section
        id="inicio"
        aria-label="Presentación"
        className="relative flex min-h-svh w-full snap-center snap-always flex-col justify-center overflow-hidden bg-black px-4 pb-16 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] sm:px-6 md:px-8 md:pb-20 md:pt-24 lg:px-12 xl:px-16 2xl:px-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,rgb(0_0_0_/_0),rgb(0_0_0_/_0.85)_100%)] opacity-90" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 70% 52% at 78% 36%, rgb(154 0 32 / 0.14), transparent 52%), radial-gradient(ellipse 72% 58% at 82% 38%, rgb(197 160 89 / 0.14), transparent 55%), radial-gradient(ellipse 48% 42% at 12% 72%, rgb(56 189 248 / 0.06), transparent 48%)',
          }}
        />

        <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-none flex-1 items-center gap-10 md:min-h-0 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.42fr)] md:gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.48fr)] lg:gap-14 xl:gap-20">
          <div className="home-hero-reveal flex min-w-0 max-w-xl flex-col items-center text-center md:max-w-none md:items-start md:justify-center md:pr-2 md:text-left lg:pr-6">
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/72">{site.tagline}</p>
            <div className="mb-5 flex w-full justify-center md:justify-start">
              <GrowLine align="left" className="w-14" />
            </div>
            <h1 className="mb-5 max-w-[min(100%,20rem)] text-balance font-serif text-[clamp(1.85rem,4.5vw+0.5rem,3.25rem)] font-semibold leading-[1.12] tracking-[0.02em] text-luxury-gold sm:max-w-2xl md:max-w-[20ch]">
              {home.heroTitle}
            </h1>
            <p className="mb-10 max-w-xl text-pretty text-base leading-relaxed text-white/86 sm:text-lg md:text-xl">{home.heroLead}</p>
            <div className="home-hero-cta-group flex w-full min-w-0 max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
              <ButtonLink
                variant="luxuryOutline"
                to={home.ctaSecondary.to}
                className="w-full justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02] sm:w-auto"
              >
                {home.ctaSecondary.label}
              </ButtonLink>
              <ButtonLink
                variant="primary"
                to={home.ctaPrimary.to}
                className="w-full justify-center rounded-sm px-8 text-sm uppercase tracking-[0.18em] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02] sm:w-auto"
              >
                {home.ctaPrimary.label}
              </ButtonLink>
            </div>
          </div>

          <HeroHomeVisual src={HERO_VISUAL} interactive />
        </div>
      </section>

      {/* Marketing */}
      <section
        aria-labelledby="home-marketing-heading"
        className="theme-section-alt scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] flex min-h-svh snap-center snap-always flex-col justify-center border-t border-white/5 bg-luxury-panel px-4 py-16 sm:px-6 md:px-10 md:py-24"
      >
        <div className="mx-auto grid w-full max-w-[72rem] items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <RevealOnView variant="fadeRight">
            <div className="border-l border-luxury-gold/45 pl-5 sm:pl-7 md:pl-9">
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">Nuestro compromiso</p>
              <h2 id="home-marketing-heading" className="mt-3 max-w-[24ch] font-serif text-3xl font-semibold leading-tight text-paper md:text-4xl">
                CS Carpinteria: Fabricamos muebles que trabajan pa&apos; ti
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/88 md:text-[1.2rem]">
                Sabemos que tu local es tu vitrina. Por eso cada proyecto lo hacemos para que se vea bien, funcione mejor y te ayude a vender.
              </p>
              <ul className="m-0 mt-6 list-none space-y-3 p-0">
                {MARKETING_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base text-paper/92 md:text-lg">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-luxury-gold/45 bg-luxury-gold/20 text-sm text-luxury-gold">
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xl font-medium leading-snug text-paper md:text-[1.42rem]">
                Trabajos bien hechos, a precio justo. Asi de simple.
              </p>
              <div className="mt-8">
                <ButtonLink variant="primary" to="/contacto" className="rounded-sm px-8 text-sm uppercase tracking-[0.16em]">
                  Quiero cotizar mi proyecto
                </ButtonLink>
              </div>
            </div>
          </RevealOnView>

          <RevealOnView delayMs={100} variant="fadeUp">
            <figure className="group/marketing relative m-0 overflow-hidden border border-white/15 bg-black/20 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
              <img
                src={MARKETING_IMAGE}
                alt="Mostrador de carpinteria comercial instalado por CS Carpinteria"
                className="aspect-[4/5] w-full object-cover motion-safe:transition-transform motion-safe:duration-[1.3s] motion-safe:ease-out motion-safe:group-hover/marketing:scale-[1.03] lg:aspect-[4/4.4]"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" aria-hidden />
              <figcaption className="absolute bottom-4 left-4 right-4 m-0 border border-white/20 bg-black/45 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white/88 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[20rem]">
                Muebles comerciales para espacios que venden mejor
              </figcaption>
            </figure>
          </RevealOnView>
        </div>
      </section>

      {/* Nosotros */}
      <section
        id="nosotros"
        aria-labelledby="nosotros-heading"
        className="theme-section-soft scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] flex min-h-svh snap-center snap-always flex-col justify-center border-t border-white/5 px-4 py-16 sm:px-6 md:px-10 md:py-24"
      >
        <div className="mx-auto w-full max-w-[72rem]">
          <RevealOnView variant="fadeRight">
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-luxury-gold">{about.pageEyebrow}</p>
            <h2 id="nosotros-heading" className="mt-3 font-serif text-3xl font-semibold tracking-wide text-paper md:text-4xl">
              {about.title}
            </h2>
            <GrowLine className="mt-5" />
          </RevealOnView>

          <RevealOnView delayMs={90} variant="fadeUp">
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.62fr)] lg:items-start lg:gap-16">
              <div className="min-w-0 border-l border-luxury-gold/50 pl-5 sm:pl-8 md:pl-10">
                <div className="flex flex-col gap-7 md:gap-9">
                  {about.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? 'm-0 text-lg leading-relaxed text-paper/92 md:text-xl'
                          : 'm-0 text-[1.05rem] leading-relaxed text-luxury-muted'
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <figure className="group/fig relative m-0 overflow-hidden lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+6rem)]">
                <img
                  src={HERO_BG}
                  alt=""
                  className="aspect-[4/5] h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1.4s] motion-safe:ease-out group-hover/fig:scale-[1.03] lg:aspect-auto lg:min-h-[22rem]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent motion-safe:transition-opacity motion-safe:duration-500 group-hover/fig:opacity-95" aria-hidden />
                <figcaption className="absolute bottom-5 left-5 right-5 m-0 translate-y-0 text-sm leading-snug text-white/90 motion-safe:transition-transform motion-safe:duration-500 group-hover/fig:-translate-y-1 md:bottom-6 md:left-6 md:right-6">
                  Madera, medida y oficio. Calidad y compromiso en cada instalación.
                </figcaption>
              </figure>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* Servicios: un solo bloque — intro, fotos (solo visual), CTA, listado detallado */}
      <section
        id="servicios"
        aria-labelledby="servicios-heading"
        className="theme-section-alt scroll-mt-[calc(env(safe-area-inset-top,0px)+5rem)] snap-start border-t border-white/5 bg-luxury-panel px-4 py-16 sm:px-6 md:px-10 md:py-24"
      >
        <div className="mx-auto w-full max-w-[72rem]">
          <RevealOnView variant="fadeDown">
            <p className="m-0 text-center text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-luxury-gold">
              {services.pageEyebrow}
            </p>
            <h2 id="servicios-heading" className="mt-3 text-center font-serif text-3xl font-semibold tracking-wide text-paper md:text-4xl">
              {services.title}
            </h2>
            <GrowLine align="center" className="mt-5" />
            <p className="mx-auto mt-8 max-w-2xl text-center text-[1.02rem] leading-relaxed text-luxury-muted">{services.intro}</p>
          </RevealOnView>

          <RevealOnView delayMs={80} variant="fadeUp">
            <div className="mt-14">
              <p className="m-0 text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-luxury-muted">
                Referencias visuales
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {VISUAL_STRIP_IMAGES.map((src, i) => (
                  <div
                    key={src}
                    className="group/img relative aspect-[4/3] overflow-hidden bg-luxury-bg sm:aspect-[16/10]"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1.1s] motion-safe:ease-out motion-safe:group-hover/img:scale-105"
                      loading={i < 3 ? 'eager' : 'lazy'}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-70 motion-safe:transition-opacity group-hover/img:opacity-90"
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            </div>
          </RevealOnView>

          <RevealOnView delayMs={100} variant="scale">
            <div className="mt-14 flex flex-col gap-4 border border-white/10 bg-luxury-bg/80 px-4 py-4 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-500 motion-safe:hover:border-luxury-gold/25 motion-safe:hover:shadow-[0_20px_48px_rgba(197,160,89,0.06)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 md:mt-16">
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex items-center gap-3 text-paper/85">
                  <IconCalendar className="h-5 w-5 shrink-0 text-luxury-gold" />
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-luxury-muted">Disponibilidad</p>
                    <p className="text-sm text-paper/90">Agenda una visita o llamada</p>
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
                <div className="flex items-center gap-3 text-paper/85">
                  <IconUser className="h-5 w-5 shrink-0 text-luxury-gold" />
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-luxury-muted">Proyecto</p>
                    <p className="text-sm text-paper/90">Retail, POP o a medida</p>
                  </div>
                </div>
              </div>
              <ButtonLink
                variant="luxuryOutline"
                to="/contacto"
                className="w-full shrink-0 justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.03] sm:w-auto sm:min-w-[11rem]"
              >
                Pedir cotización
              </ButtonLink>
            </div>
          </RevealOnView>

          <ul className="m-0 mt-16 list-none border-t border-white/10 p-0 md:mt-20">
            {services.items.map((item, i) => (
              <li
                key={`${i}-${item.name}`}
                className="group border-b border-white/10 py-10 motion-safe:transition-colors motion-safe:duration-500 last:border-b-0 motion-safe:hover:bg-white/[0.02] md:py-12"
              >
                <RevealOnView delayMs={Math.min(i * 55, 420)} variant="fadeLeft">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10 lg:gap-14">
                    <span
                      className="shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums tracking-[0.22em] text-luxury-gold/90 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1 md:min-w-[2.75rem] md:pt-1.5"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="m-0 font-serif text-2xl font-semibold tracking-wide text-paper motion-safe:transition-colors motion-safe:duration-300 motion-safe:group-hover:text-luxury-gold md:text-[1.65rem]">
                        {item.name}
                      </h3>
                      <p className="mt-2 max-w-2xl text-base font-medium leading-snug text-paper/85 md:text-lg">{item.tagline}</p>
                      <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-luxury-muted md:text-lg">{item.description}</p>
                    </div>
                    <div
                      className="hidden shrink-0 self-start text-luxury-gold/40 motion-safe:transition-[transform,color] motion-safe:duration-500 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:text-luxury-gold md:flex md:h-11 md:w-11 md:items-center md:justify-center md:rounded-full md:border md:border-luxury-gold/35"
                      aria-hidden
                    >
                      <span className="text-lg leading-none">→</span>
                    </div>
                  </div>
                </RevealOnView>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
