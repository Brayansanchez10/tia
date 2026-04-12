import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'

export function SiteFooter() {
  const year = new Date().getFullYear()
  const { footer } = site

  return (
    <footer className="relative z-10 mt-auto bg-wood-dark text-paper">
      <div className="border-b border-wood/20">
        <div className="mx-auto max-w-[65rem] px-4 py-12 text-center sm:px-5 sm:py-14 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{footer.ctaEyebrow}</p>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-paper/90 md:text-lg">
            {footer.ctaLead}
          </p>
          <div className="mt-8 flex justify-center px-1 sm:px-0">
            <ButtonLink
              variant="primary"
              to={footer.ctaButton.to}
              className="w-full max-w-sm justify-center rounded-sm px-10 py-3 text-sm uppercase tracking-wide sm:w-auto sm:max-w-none"
            >
              {footer.ctaButton.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-center text-sm text-paper/65 sm:px-5 md:py-6">
        <p className="mx-auto max-w-[65rem] text-pretty leading-snug">
          © {year} {site.brand}. {footer.note}
        </p>
      </div>
    </footer>
  )
}
