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
    <div className="group border-b border-paper/10 pb-8 last:border-b-0 last:pb-0 sm:pb-10 md:pb-12">
      <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">{label}</p>
      <div className="mt-3 text-xl font-medium leading-snug tracking-tight text-paper sm:text-2xl md:text-3xl">
        {children}
      </div>
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
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-wood-dark via-ink to-[#0c1220] shadow-[0_28px_90px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-wood/20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-wood/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-10 top-1/2 hidden h-48 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-wood/40 to-transparent lg:block"
            aria-hidden
          />

          <div className="relative grid gap-10 p-5 sm:gap-12 sm:p-8 md:gap-14 md:p-12 lg:grid-cols-[1fr_minmax(0,14rem)] lg:gap-16 lg:p-14">
            <div className="min-w-0 space-y-0">
              <ContactBlock label="WhatsApp">
                <div className="flex flex-col gap-3">
                  {contact.whatsappLines.map((line) => (
                    <a
                      key={line.href}
                      href={line.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper no-underline transition-colors duration-200 hover:text-wood"
                    >
                      {line.display}
                    </a>
                  ))}
                </div>
              </ContactBlock>
              <ContactBlock label="Correo">
                <a
                  href={`mailto:${contact.email}`}
                  className="break-words text-paper no-underline transition-colors duration-200 hover:text-wood"
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

            <aside className="flex flex-col justify-between gap-8 border-t border-wood/25 pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-4">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-wood/95">Taller</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  Coordinamos visita o llamada cuando te venga bien. Sustituye este texto por cómo trabajáis en la
                  realidad.
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="h-px w-full bg-gradient-to-r from-gold/60 via-wood/40 to-transparent"
                  aria-hidden
                />
                <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-paper/40">
                  Marketing — Pop · Dejando huella
                </p>
              </div>
            </aside>
          </div>
        </div>
      </RevealOnView>
    </PageSection>
  )
}
