import type { ReactNode } from 'react'
import { site } from '@/content/site'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { PageHeader } from '@/components/ui/PageShell'

function IconWhatsapp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 9.5h.01M12 9.5h.01M14.5 9.5h.01" />
    </svg>
  )
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      <path d="M4 6h16v12H4V6Z" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.25" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.25l2.75 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ContactBlock({
  label,
  icon,
  children,
}: {
  label: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <article className="rounded-md border border-divider bg-surface/40 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-brand/25 bg-brand/[0.08] text-brand">
          {icon}
        </span>
        <p className="m-0 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold">{label}</p>
      </div>
      <div className="mt-3 pl-[2.85rem] text-lg font-medium leading-snug tracking-tight text-paper sm:text-xl">
        {children}
      </div>
    </article>
  )
}

export function ContactoPage() {
  const { contact } = site
  const primaryWhatsapp = contact.whatsappLines[0]

  return (
    <div className="min-h-[50vh] w-full bg-luxury-bg">
      <div className="mx-auto max-w-[72rem] px-4 pb-16 pt-8 sm:px-5 sm:pb-20 sm:pt-10 md:px-6 md:pb-20 md:pt-12">
        <RevealOnView>
          <PageHeader eyebrow={contact.pageEyebrow} title={contact.title} intro={contact.intro} />
          <div className="section-rule mt-5" aria-hidden />
        </RevealOnView>

        {primaryWhatsapp ? (
          <RevealOnView delayMs={60} variant="fadeUp">
            <a
              href={primaryWhatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-md bg-brand px-5 text-base font-semibold text-white no-underline transition hover:brightness-110 hover:no-underline sm:hidden"
            >
              <IconWhatsapp className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
          </RevealOnView>
        ) : null}

        <RevealOnView delayMs={90} variant="fadeUp">
          <div className="relative mt-8 overflow-hidden rounded-md border border-white/10 bg-luxury-panel md:mt-10">
            <div className="relative grid gap-4 p-4 sm:gap-5 sm:p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-8 lg:p-10">
              <div className="min-w-0 space-y-3">
                <ContactBlock label="WhatsApp" icon={<IconWhatsapp className="h-4 w-4" />}>
                  <div className="flex flex-col gap-2.5">
                    {contact.whatsappLines.map((line) => (
                      <a
                        key={line.href}
                        href={line.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2.5 text-paper no-underline transition-colors hover:text-brand hover:no-underline"
                      >
                        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                        {line.display}
                      </a>
                    ))}
                  </div>
                </ContactBlock>
                <ContactBlock label="Correo" icon={<IconMail className="h-4 w-4" />}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-words text-paper no-underline transition-colors hover:text-brand hover:no-underline"
                  >
                    {contact.email}
                  </a>
                </ContactBlock>
                <ContactBlock label="Dirección" icon={<IconMapPin className="h-4 w-4" />}>
                  <span className="text-pretty text-base font-normal leading-relaxed text-paper/88 sm:text-lg">
                    {contact.address}
                  </span>
                </ContactBlock>
                <ContactBlock label="Horario" icon={<IconClock className="h-4 w-4" />}>
                  <span className="text-base font-normal text-paper/90 sm:text-lg">{contact.hours}</span>
                </ContactBlock>
              </div>

              <aside className="flex flex-col justify-between gap-6 rounded-md border border-white/10 bg-black/15 p-4 sm:p-5">
                <div>
                  <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-luxury-gold">
                    Atención
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
                    Coordinamos visita o llamada. Escríbenos y te respondemos para avanzar con tu proyecto.
                  </p>
                </div>
                {primaryWhatsapp ? (
                  <a
                    href={primaryWhatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden min-h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white no-underline transition hover:brightness-110 hover:no-underline sm:inline-flex"
                  >
                    Abrir WhatsApp
                  </a>
                ) : null}
                <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-paper/45">
                  Marketing — Pop · Dejando huella
                </p>
              </aside>
            </div>
          </div>
        </RevealOnView>
      </div>
    </div>
  )
}
