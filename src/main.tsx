import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { AdminAuthProvider } from '@/auth/AdminAuthContext'
import { ThemeProvider } from '@/theme/ThemeProvider'
import '@/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
