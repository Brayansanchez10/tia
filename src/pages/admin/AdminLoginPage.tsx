import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

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
    <div className="flex min-h-svh flex-col bg-luxury-bg text-paper">
      <div className="flex flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-md rounded-sm border border-luxury-gold/25 bg-luxury-panel/90 p-8 shadow-xl backdrop-blur-sm">
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
                className="mt-2 w-full rounded-sm border border-luxury-gold/30 bg-luxury-bg px-3 py-2.5 text-sm text-paper outline-none ring-luxury-gold/40 placeholder:text-luxury-muted/60 focus:border-luxury-gold focus:ring-2"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-sm border border-luxury-gold/50 bg-luxury-gold/15 py-2.5 text-sm font-medium text-luxury-gold transition-colors hover:bg-luxury-gold/25"
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
