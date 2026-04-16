import type { ReactNode } from 'react'
import { site } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader } from '@/components/ui/PageShell'

function ContactBlock({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="group border-b border-white/10 pb-8 motion-safe:transition-colors motion-safe:duration-300 last:border-b-0 last:pb-0 motion-safe:hover:border-luxury-gold/15 sm:pb-10 md:pb-12">
      <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-luxury-gold/95">{label}</p>
      <div className="mt-3 text-xl font-medium leading-snug tracking-tight text-paper sm:text-2xl md:text-3xl">
        {children}
      </div>
    </div>
  )
}

export function ContactoPage() {
  const { contact } = site

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pb-20 md:pt-12">
        <RevealOnView>
          <PageHeader eyebrow={contact.pageEyebrow} title={contact.title} intro={contact.intro} />
          <GrowLine className="mt-5" />
        </RevealOnView>

        <RevealOnView delayMs={100} variant="scale">
          <div className="relative mt-10 overflow-hidden border border-white/10 bg-luxury-panel shadow-[0_28px_80px_rgba(0,0,0,0.5)] motion-safe:transition-[border-color,box-shadow] motion-safe:duration-500 motion-safe:hover:border-luxury-gold/20 motion-safe:hover:shadow-[0_32px_90px_rgba(197,160,89,0.06)] md:mt-12">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-luxury-gold/8 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-luxury-gold/5 blur-3xl"
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
                        className="text-paper no-underline motion-safe:transition-colors motion-safe:duration-300 hover:text-luxury-gold"
                      >
                        {line.display}
                      </a>
                    ))}
                  </div>
                </ContactBlock>
                <ContactBlock label="Correo">
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-words text-paper no-underline motion-safe:transition-colors motion-safe:duration-300 hover:text-luxury-gold"
                  >
                    {contact.email}
                  </a>
                </ContactBlock>
                <ContactBlock label="Dirección">
                  <span className="text-pretty text-xl font-normal leading-relaxed text-paper/88 md:text-2xl">
                    {contact.address}
                  </span>
                </ContactBlock>
                <ContactBlock label="Horario">
                  <span className="text-xl font-normal text-paper/90 md:text-2xl">{contact.hours}</span>
                </ContactBlock>
              </div>

              <aside className="flex flex-col justify-between gap-8 border-t border-white/10 pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-4">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Taller</p>
                  <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
                    Coordinamos visita o llamada, contactanos para mas información.
                  </p>
                </div>
                <div className="space-y-3">
                  <div
                    className="h-px w-full bg-gradient-to-r from-luxury-gold/50 via-luxury-gold/20 to-transparent"
                    aria-hidden
                  />
                  <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-paper/45">
                    Marketing — Pop · Dejando huella
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </RevealOnView>
      </div>
    </div>
  )
}
