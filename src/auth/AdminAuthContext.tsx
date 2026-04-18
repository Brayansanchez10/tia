import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'

const STORAGE_KEY = 'tia-admin-session'

function getExpectedPassword(): string {
  const env = import.meta.env.VITE_ADMIN_PASSWORD
  if (typeof env === 'string' && env.length > 0) return env
  if (import.meta.env.DEV) return 'admin'
  return ''
}

function readStored(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function setStored(ok: boolean): void {
  try {
    if (ok) sessionStorage.setItem(STORAGE_KEY, '1')
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn())
}

const listeners = new Set<() => void>()

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot(): boolean {
  return readStored()
}

function getServerSnapshot(): boolean {
  return false
}

type AdminAuthContextValue = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  /** True si falta configurar contraseña en build de producción. */
  isMisconfigured: boolean
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const login = useCallback((password: string) => {
    const expected = getExpectedPassword()
    if (!expected) return false
    const ok = password === expected
    setStored(ok)
    return ok
  }, [])

  const logout = useCallback(() => {
    setStored(false)
  }, [])

  const isMisconfigured = !import.meta.env.DEV && getExpectedPassword() === ''

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, isMisconfigured }),
    [isAuthenticated, login, logout, isMisconfigured],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
