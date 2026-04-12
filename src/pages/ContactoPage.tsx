import type { ReactNode } from 'react'
import { site } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader, PageSection } from '@/components/ui/PageShell'

function ContactBlock({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="group border-b border-paper/10 pb-10 last:border-b-0 last:pb-0 md:pb-12">
      <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">{label}</p>
      <div className="mt-3 text-2xl font-medium leading-snug tracking-tight text-paper md:text-3xl">{children}</div>
    </div>
  )
}

export function ContactoPage() {
  const { contact } = site

  return (
    <PageSection>
      <RevealOnView>
        <PageHeader eyebrow={contact.pageEyebrow} title={contact.title} intro={contact.intro} />
      </RevealOnView>

      <RevealOnView delayMs={100}>
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-wood-dark via-[#2a1a0d] to-ink shadow-[0_28px_90px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-gold/15">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-gold/8 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-10 top-1/2 hidden h-48 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold/35 to-transparent lg:block"
            aria-hidden
          />

          <div className="relative grid gap-12 p-8 md:gap-14 md:p-12 lg:grid-cols-[1fr_minmax(0,14rem)] lg:gap-16 lg:p-14">
            <div className="min-w-0 space-y-0">
              <ContactBlock label="Teléfono">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-paper no-underline transition-colors duration-200 hover:text-gold"
                >
                  {contact.phone}
                </a>
              </ContactBlock>
              <ContactBlock label="Correo">
                <a
                  href={`mailto:${contact.email}`}
                  className="break-words text-paper no-underline transition-colors duration-200 hover:text-gold"
                >
                  {contact.email}
                </a>
              </ContactBlock>
              <ContactBlock label="Dirección">
                <span className="text-pretty text-xl font-normal leading-relaxed text-paper/85 md:text-2xl">
                  {contact.address}
                </span>
              </ContactBlock>
              <ContactBlock label="Horario">
                <span className="text-xl font-normal text-paper/90 md:text-2xl">{contact.hours}</span>
              </ContactBlock>
            </div>

            <aside className="flex flex-col justify-between gap-8 border-t border-gold/20 pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-4">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-gold/90">Taller</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  Coordinamos visita o llamada cuando te venga bien. Sustituye este texto por cómo trabajáis en
                  la realidad.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-px w-full bg-gradient-to-r from-gold/50 via-gold/25 to-transparent" aria-hidden />
                <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-paper/40">
                  Carpintería · calidad · cercanía
                </p>
              </div>
            </aside>
          </div>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
