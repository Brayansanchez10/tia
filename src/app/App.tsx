import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { RequireAuth } from '@/auth/RequireAuth'
import { AdminLayout } from '@/layouts/AdminLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminRecibosPage } from '@/pages/admin/AdminRecibosPage'
import { ContactoPage } from '@/pages/ContactoPage'
import { HomePage } from '@/pages/HomePage'
import { HomePageMovil } from '@/pages/movil/homePageMovil'
import { TrabajoChildDetailPage } from '@/pages/TrabajoChildDetailPage'
import { TrabajoEntryPage } from '@/pages/TrabajoEntryPage'
import { TrabajosPage } from '@/pages/TrabajosPage'
import { TrabajosPortfolioPage } from '@/pages/TrabajosPortfolioPage'

function ResponsiveHomePage() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [renderMobile, setRenderMobile] = useState(isMobile)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isMobile === renderMobile) return
    setIsVisible(false)
    const timeoutId = window.setTimeout(() => {
      setRenderMobile(isMobile)
      setIsVisible(true)
    }, 140)
    return () => window.clearTimeout(timeoutId)
  }, [isMobile, renderMobile])

  return (
    <div className={`motion-safe:transition-opacity motion-safe:duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {renderMobile ? <HomePageMovil /> : <HomePage />}
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<RequireAuth />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="recibos" element={<AdminRecibosPage />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<ResponsiveHomePage />} />
          <Route path="trabajos" element={<TrabajosPage />} />
          <Route path="trabajos/portafolio/:kind" element={<TrabajosPortfolioPage />} />
          <Route path="trabajos/:parentSlug/:childSlug" element={<TrabajoChildDetailPage />} />
          <Route path="trabajos/:slug" element={<TrabajoEntryPage />} />
          <Route path="servicios" element={<Navigate to="/#servicios" replace />} />
          <Route path="nosotros" element={<Navigate to="/#nosotros" replace />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
