import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'

export function SiteFooter() {
  const year = new Date().getFullYear()
  const { footer } = site

  return (
    <footer className="mt-auto bg-wood-dark text-paper">
      <div className="border-b border-gold/20">
        <div className="mx-auto max-w-[65rem] px-5 py-14 text-center md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{footer.ctaEyebrow}</p>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-paper/90 md:text-lg">
            {footer.ctaLead}
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink
              variant="primary"
              to={footer.ctaButton.to}
              className="rounded-sm px-10 py-3 text-sm uppercase tracking-wide"
            >
              {footer.ctaButton.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 text-center text-sm text-paper/65 md:py-6">
        <p className="mx-auto max-w-[65rem] leading-snug">
          © {year} {site.brand}. {footer.note}
        </p>
      </div>
    </footer>
  )
}
