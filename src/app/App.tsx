import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/auth/RequireAuth'
import { AdminLayout } from '@/layouts/AdminLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { ContactoPage } from '@/pages/ContactoPage'
import { HomePage } from '@/pages/HomePage'
import { TrabajoChildDetailPage } from '@/pages/TrabajoChildDetailPage'
import { TrabajoEntryPage } from '@/pages/TrabajoEntryPage'
import { TrabajosPage } from '@/pages/TrabajosPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<RequireAuth />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="trabajos" element={<TrabajosPage />} />
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
