import type { ReactNode } from 'react'
import { site } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
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
    <article className="group rounded-xl border border-divider bg-surface/45 px-4 py-4 motion-safe:transition-[border-color,background-color] motion-safe:duration-300 motion-safe:hover:border-luxury-gold/25 motion-safe:hover:bg-surface/60 sm:px-5 sm:py-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/[0.08] text-brand/90 motion-safe:transition-colors motion-safe:duration-300 group-hover:border-brand/40 group-hover:bg-brand/[0.12]">
          {icon}
        </span>
        <p className="m-0 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-luxury-gold/95">{label}</p>
      </div>
      <div className="mt-3 pl-[2.625rem] text-lg font-medium leading-snug tracking-tight text-paper sm:text-xl md:text-2xl">
        {children}
      </div>
    </article>
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
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-luxury-panel shadow-[0_28px_80px_rgba(0,0,0,0.5)] motion-safe:transition-[border-color,box-shadow] motion-safe:duration-500 motion-safe:hover:border-luxury-gold/20 motion-safe:hover:shadow-[0_32px_90px_rgba(197,160,89,0.06)] md:mt-12">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/12 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-luxury-gold/5 blur-3xl"
              aria-hidden
            />

            <div className="relative grid gap-7 p-5 sm:gap-8 sm:p-8 md:gap-9 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,16.5rem)] lg:gap-10 lg:p-12">
              <div className="min-w-0 space-y-3.5 sm:space-y-4">
                <ContactBlock label="WhatsApp" icon={<IconWhatsapp className="h-4 w-4" />}>
                  <div className="flex flex-col gap-2.5">
                    {contact.whatsappLines.map((line) => (
                      <a
                        key={line.href}
                        href={line.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-paper no-underline motion-safe:transition-colors motion-safe:duration-300 hover:text-brand"
                      >
                        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand/85" aria-hidden />
                        {line.display}
                      </a>
                    ))}
                  </div>
                </ContactBlock>
                <ContactBlock label="Correo" icon={<IconMail className="h-4 w-4" />}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-words text-paper no-underline motion-safe:transition-colors motion-safe:duration-300 hover:text-brand"
                  >
                    {contact.email}
                  </a>
                </ContactBlock>
                <ContactBlock label="Dirección" icon={<IconMapPin className="h-4 w-4" />}>
                  <span className="text-pretty text-base font-normal leading-relaxed text-paper/88 sm:text-lg md:text-xl">
                    {contact.address}
                  </span>
                </ContactBlock>
                <ContactBlock label="Horario" icon={<IconClock className="h-4 w-4" />}>
                  <span className="text-base font-normal text-paper/90 sm:text-lg md:text-xl">{contact.hours}</span>
                </ContactBlock>
              </div>

              <aside className="flex flex-col justify-between gap-7 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5 lg:min-h-full lg:gap-8">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Atención</p>
                  <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
                    Coordinamos visita o llamada. Escribenos y te respondemos para avanzar con tu proyecto.
                  </p>
                </div>
                <div className="space-y-3">
                  <div
                    className="h-px w-full bg-gradient-to-r from-brand/55 via-luxury-gold/35 to-transparent"
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
