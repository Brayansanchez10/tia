import { site } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader, PageSection } from '@/components/ui/PageShell'

export function ServiciosPage() {
  const { services } = site

  return (
    <PageSection>
      <RevealOnView>
        <PageHeader eyebrow={services.pageEyebrow} title={services.title} intro={services.intro} />
      </RevealOnView>

      <RevealOnView delayMs={100}>
        <ul className="m-0 list-none p-0">
          {services.items.map((item, i) => (
            <li
              key={item.name}
              className="group relative border-t border-wood/12 py-10 first:border-t-0 first:pt-0 md:py-12"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10 lg:gap-14">
                <span
                  className="shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-gold/80 md:min-w-[2.5rem] md:pt-1.5"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="m-0 text-2xl font-medium tracking-tight text-ink lowercase md:text-3xl lg:text-[2rem]">
                    {item.name}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-wood-dark/88 md:text-lg">
                    {item.description}
                  </p>
                </div>
                <div
                  className="hidden shrink-0 self-start md:flex md:h-11 md:w-11 md:items-center md:justify-center md:rounded-full md:border md:border-gold/35 md:text-gold/50 transition-[background-color,border-color,color] duration-300 group-hover:border-gold/55 group-hover:bg-gold/10 group-hover:text-gold"
                  aria-hidden
                >
                  <span className="text-lg leading-none">→</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </RevealOnView>
    </PageSection>
  )
}
