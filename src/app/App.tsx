import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { ContactoPage } from '@/pages/ContactoPage'
import { HomePage } from '@/pages/HomePage'
import { NosotrosPage } from '@/pages/NosotrosPage'
import { ServiciosPage } from '@/pages/ServiciosPage'
import { TrabajoDetailPage } from '@/pages/TrabajoDetailPage'
import { TrabajosPage } from '@/pages/TrabajosPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="trabajos" element={<TrabajosPage />} />
          <Route path="trabajos/:slug" element={<TrabajoDetailPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="nosotros" element={<NosotrosPage />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
