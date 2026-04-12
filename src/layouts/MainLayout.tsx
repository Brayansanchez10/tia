import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 w-full bg-ink pb-0 pt-[calc(env(safe-area-inset-top,0px)+5rem)]">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
