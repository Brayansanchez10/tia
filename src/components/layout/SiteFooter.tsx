import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'

type Props = {
  /** En viewport menor a `lg`, oculta el bloque CTA “¿Listo para empezar?” (p. ej. detalle de trabajo con barra propia). */
  hideMobileLeadCta?: boolean
}

export function SiteFooter({ hideMobileLeadCta = false }: Props) {
  const year = new Date().getFullYear()
  const { footer } = site

  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-luxury-panel text-paper">
      <div
        className={[
          'border-b border-white/5',
          hideMobileLeadCta ? 'max-lg:hidden' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="mx-auto max-w-[72rem] px-4 py-12 text-center sm:px-5 sm:py-14 md:py-16">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-luxury-gold">
            {footer.ctaEyebrow}
          </p>
          <p className="mx-auto mt-4 max-w-lg text-pretty font-serif text-xl font-semibold leading-snug text-paper md:text-2xl">
            {footer.ctaLead}
          </p>
          <div className="mt-8 flex justify-center px-1 sm:px-0">
            <ButtonLink
              variant="primary"
              to={footer.ctaButton.to}
              className="min-h-12 w-full max-w-sm justify-center rounded-md px-10 py-3 text-sm uppercase tracking-[0.14em] sm:w-auto sm:max-w-none"
            >
              {footer.ctaButton.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-center text-sm text-luxury-muted sm:px-5 md:py-6">
        <p className="mx-auto max-w-[72rem] text-pretty leading-snug">
          © {year} {site.brand}. {footer.note}
        </p>
      </div>
    </footer>
  )
}
