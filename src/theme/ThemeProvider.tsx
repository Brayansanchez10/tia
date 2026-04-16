import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type SiteTheme = 'dark' | 'light'

const STORAGE_KEY = 'site-theme'

type ThemeContextValue = {
  theme: SiteTheme
  setTheme: (t: SiteTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): SiteTheme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

function getInitialTheme(): SiteTheme {
  if (typeof document !== 'undefined') {
    const d = document.documentElement.dataset.theme
    if (d === 'light' || d === 'dark') return d
  }
  return readStoredTheme()
}

function applyDomTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(() => getInitialTheme())

  useEffect(() => {
    applyDomTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((t: SiteTheme) => {
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
