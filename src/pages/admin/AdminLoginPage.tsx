import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'
import { COMPANY_LOGO_SRC } from '@/lib/branding'

export function AdminLoginPage() {
  const { login, isAuthenticated, isMisconfigured } = useAdminAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!login(password)) {
      setError('Contraseña incorrecta.')
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-luxury-bg bg-[radial-gradient(ellipse_at_50%_0%,rgba(197,160,89,0.12),transparent_55%)] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-paper">
      <div className="flex flex-1 flex-col justify-center py-10 sm:px-6 sm:py-16">
        <div className="mx-auto mb-8 flex w-full max-w-md justify-center">
          {/* Fondo opaco (sin blur / sin panel translúcido): si no, el canal alpha del PNG se mezcla y parece gris. */}
          <div className="rounded-sm border border-luxury-gold/25 bg-luxury-bg px-6 py-4 shadow-lg">
            <img
              src={COMPANY_LOGO_SRC}
              alt="CS Marketing-Pop — Dejando huella"
              className="mx-auto max-h-16 w-auto max-w-[min(100%,18rem)] object-contain"
              width={288}
              height={64}
              decoding="async"
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md rounded-sm border border-luxury-gold/25 bg-luxury-panel/90 p-5 shadow-xl shadow-black/25 backdrop-blur-sm sm:p-8">
          <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.25em] text-luxury-gold uppercase">
            Acceso
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-serif)] text-2xl text-paper sm:text-3xl">
            Panel administrador
          </h1>
          <p className="mt-2 text-sm text-luxury-muted">
            Introduce la contraseña para gestionar cotizaciones y exportar PDF.
          </p>

          {isMisconfigured && (
            <p className="mt-4 rounded-sm border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              Falta <code className="text-amber-50">VITE_ADMIN_PASSWORD</code> en el entorno de
              producción. Configúrala al construir el sitio.
            </p>
          )}

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block text-xs font-medium tracking-wide text-luxury-muted uppercase">
              Contraseña
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 min-h-11 w-full rounded-sm border border-luxury-gold/30 bg-luxury-bg px-3 py-2.5 text-base text-paper outline-none ring-luxury-gold/40 placeholder:text-luxury-muted/60 focus:border-luxury-gold focus:ring-2 sm:text-sm"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              className="min-h-11 w-full rounded-sm border border-luxury-gold/50 bg-luxury-gold/15 py-3 text-sm font-medium text-luxury-gold transition-colors hover:bg-luxury-gold/25 sm:py-2.5"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-luxury-muted">
            <Link to="/" className="text-luxury-gold/90 hover:text-luxury-gold">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
