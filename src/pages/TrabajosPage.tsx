import { site } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { WorkCard, workPortfolioGridClass } from '@/components/trabajos/WorkCard'
import { PageHeader, PageSection } from '@/components/ui/PageShell'

export function TrabajosPage() {
  const { trabajos } = site

  return (
    <PageSection>
      <RevealOnView>
        <PageHeader eyebrow={trabajos.pageEyebrow} title={trabajos.title} intro={trabajos.intro} />
      </RevealOnView>

      <RevealOnView delayMs={100}>
        <ul className={workPortfolioGridClass}>
          {trabajos.items.map((post, i) => (
            <li key={post.slug}>
              <RevealOnView delayMs={i * 90}>
                <WorkCard post={post} />
              </RevealOnView>
            </li>
          ))}
        </ul>
      </RevealOnView>
    </PageSection>
  )
}
