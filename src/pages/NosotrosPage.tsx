import { site } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader, PageSection } from '@/components/ui/PageShell'

const ABOUT_IMAGE = '/img/Fondo.jpg'

export function NosotrosPage() {
  const { about } = site

  return (
    <PageSection>
      <RevealOnView>
        <PageHeader eyebrow={about.pageEyebrow} title={about.title} />
      </RevealOnView>

      <RevealOnView delayMs={100}>
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.62fr)] lg:items-start lg:gap-14">
          <div className="min-w-0 border-l-[3px] border-gold pl-4 sm:pl-6 md:pl-8">
            <div className="flex flex-col gap-6 md:gap-8">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'm-0 text-lg leading-relaxed text-paper/90 md:text-xl'
                      : 'm-0 text-[1.05rem] leading-relaxed text-paper/82'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <figure className="relative m-0 overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-wood/10 lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+6.5rem)]">
            <img
              src={ABOUT_IMAGE}
              alt="Detalle de madera y taller"
              className="aspect-[4/5] h-full w-full object-cover lg:aspect-auto lg:min-h-[22rem]"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
              aria-hidden
            />
            <figcaption className="absolute bottom-5 left-5 right-5 m-0 text-sm leading-snug text-paper/90 md:bottom-6 md:left-6 md:right-6">
              Madera, medida y oficio. Sustituye esta leyenda por una frase propia del taller.
            </figcaption>
          </figure>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
