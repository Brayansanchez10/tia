import { Outlet } from 'react-router-dom'
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export function MainLayout() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden">
      <AmbientBackdrop />
      <SiteHeader />
      <main className="relative z-10 w-full flex-1 bg-transparent pb-[env(safe-area-inset-bottom,0px)] pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
