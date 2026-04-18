import { HeroHomeVisual } from '@/components/home/HeroHomeVisual'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'

const HERO_VISUAL = '/img/fondoHome.png'

const MOBILE_GALLERY = [
  '/img/Fondo.jpg',
  '/img/cruzverde/Exibidor.jpeg',
  '/img/Exibidor Jugos/Jugos2.jpeg',
  '/img/cruzverde/exibidor1.jpeg',
] as const

export function HomePageMovil() {
  const { home, services, about } = site

  return (
    <main className="overflow-x-hidden bg-luxury-bg pb-4 text-paper md:hidden">
      <section className="relative isolate overflow-x-hidden overflow-y-visible bg-black px-4 pb-8 pt-[calc(env(safe-area-inset-top,0px)+5rem)] sm:pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_100%,rgb(0_0_0_/_0),rgb(0_0_0_/_0.88)_100%)] opacity-90" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 22%, rgb(154 0 32 / 0.12), transparent 50%), radial-gradient(ellipse 85% 55% at 50% 28%, rgb(197 160 89 / 0.12), transparent 52%), radial-gradient(ellipse 60% 45% at 10% 85%, rgb(56 189 248 / 0.05), transparent 48%)',
          }}
        />

        <RevealOnView variant="fadeUp">
          <div className="relative z-10">
            <p className="text-center text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-white/72">{site.tagline}</p>
            <div className="mt-2 flex justify-center">
              <GrowLine align="center" className="w-14" />
            </div>
            <h1 className="mx-auto mt-4 max-w-[16ch] text-balance text-center font-serif text-[clamp(1.9rem,6.5vw,2.35rem)] leading-[1.08] text-luxury-gold">
              {home.heroTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-center text-sm leading-relaxed text-white/86">{home.heroLead}</p>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-2.5">
              <ButtonLink
                variant="primary"
                to={home.ctaPrimary.to}
                className="w-full justify-center rounded-sm py-3 text-[0.78rem] uppercase tracking-[0.18em]"
              >
                {home.ctaPrimary.label}
              </ButtonLink>
              <ButtonLink variant="luxuryOutline" to={home.ctaSecondary.to} className="w-full justify-center py-3">
                {home.ctaSecondary.label}
              </ButtonLink>
            </div>

            <div className="relative left-1/2 mt-5 w-screen max-w-[100vw] -translate-x-1/2 px-2 sm:mt-6 sm:px-4">
              <HeroHomeVisual src={HERO_VISUAL} interactive={false} />
            </div>
          </div>
        </RevealOnView>
      </section>

      <section className="theme-section-soft mt-3 border-t border-white/10 px-4 py-10">
        <RevealOnView variant="fadeUp">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">{about.pageEyebrow}</p>
          <h2 className="mt-2 font-serif text-[1.55rem]">{about.title}</h2>
          <div className="mt-3 space-y-3">
            {about.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-luxury-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {MOBILE_GALLERY.slice(0, 2).map((src) => (
              <div key={src} className="overflow-hidden border border-white/10">
                <img src={src} alt="" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      <section className="theme-section-alt mt-3 border-t border-white/10 bg-luxury-panel/70 px-4 py-10">
        <RevealOnView variant="fadeUp">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">{services.pageEyebrow}</p>
          <h2 className="mt-2 font-serif text-[1.55rem]">{services.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-luxury-muted">{services.intro}</p>
          <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {services.items.slice(0, 4).map((item, index) => (
              <article
                key={item.name}
                className="min-w-[84%] snap-center overflow-hidden rounded-xl border border-white/12 bg-luxury-bg/85 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
                  <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-luxury-gold/85">SERVICIO {String(index + 1).padStart(2, '0')}</p>
                  <span className="rounded-full border border-luxury-gold/35 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-paper/80">POP</span>
                </div>
                <div className="px-4 py-3.5">
                  <h3 className="font-serif text-lg text-paper">{item.name}</h3>
                  <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.06em] text-paper/78">{item.tagline}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-luxury-muted">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </RevealOnView>

      </section>

      <section className="theme-section-soft mt-3 border-t border-white/10 px-4 py-10">
        <RevealOnView variant="fadeUp">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">Referencias visuales</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {MOBILE_GALLERY.map((src, i) => (
              <div key={src} className={`overflow-hidden border border-white/10 ${i === 0 ? 'col-span-2' : ''}`}>
                <img
                  src={src}
                  alt=""
                  className={`h-full w-full object-cover ${i === 0 ? 'aspect-[16/8]' : 'aspect-[4/4]'}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </RevealOnView>
      </section>

      <section className="theme-section-alt mt-3 border-t border-white/10 px-4 py-10 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)]">
        <RevealOnView variant="fadeUp">
          <div className="overflow-hidden border border-luxury-gold/40 bg-luxury-bg/90">
          <div className="px-4 py-5">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-luxury-gold">{site.tagline}</p>
            <h2 className="mt-2 font-serif text-2xl text-paper">{services.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/85">{services.intro}</p>
            <div className="mt-5 grid grid-cols-1 gap-2.5">
              <ButtonLink variant="primary" to={home.ctaPrimary.to} className="w-full justify-center uppercase tracking-[0.14em]">
                {home.ctaPrimary.label}
              </ButtonLink>
              <ButtonLink variant="luxuryOutline" to={home.ctaSecondary.to} className="w-full justify-center">
                {home.ctaSecondary.label}
              </ButtonLink>
            </div>
          </div>
          </div>
        </RevealOnView>
      </section>
    </main>
  )
}
