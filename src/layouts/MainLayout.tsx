import { Outlet, useLocation } from 'react-router-dom'
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

/** Detalle de proyecto bajo `/trabajos/...` (no listados ni portafolio): el CTA genérico del pie en móvil no aporta y rompe el flujo tipo app. */
function hideFooterLeadCtaOnMobile(pathname: string): boolean {
  if (!pathname.startsWith('/trabajos/')) return false
  if (pathname.startsWith('/trabajos/portafolio/')) return false
  return true
}

export function MainLayout() {
  const { pathname } = useLocation()
  const hideMobileFooterLead = hideFooterLeadCtaOnMobile(pathname)

  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden">
      <AmbientBackdrop />
      <SiteHeader />
      <main className="relative z-10 w-full flex-1 bg-transparent pb-[env(safe-area-inset-bottom,0px)] pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
        <Outlet />
      </main>
      <SiteFooter hideMobileLeadCta={hideMobileFooterLead} />
    </div>
  )
}
