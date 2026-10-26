import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { site, type TrabajoPost } from '@/content/site'
import { fetchPublicCatalog, type PublicCatalog } from '@/lib/portfolio/portfolioClient'

const CACHE_KEY = 'tia-portfolio-v1'

const fallback: PublicCatalog = {
  items: [...site.trabajos.items],
  featuredSlugs: [...site.home.featuredSlugs],
}

type PortfolioContextValue = PublicCatalog & { ready: boolean }

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

function readCache(): PublicCatalog | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { items?: unknown; featuredSlugs?: unknown }
    if (!Array.isArray(parsed.items)) return null
    return {
      items: parsed.items as TrabajoPost[],
      featuredSlugs: Array.isArray(parsed.featuredSlugs)
        ? parsed.featuredSlugs.filter((slug): slug is string => typeof slug === 'string')
        : [],
    }
  } catch {
    return null
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<PublicCatalog>(() => readCache() ?? fallback)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchPublicCatalog()
      .then((next) => {
        if (cancelled) return
        setCatalog(next)
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* Si Neon no responde, se queda la copia de site.ts o la última caché. */
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <PortfolioContext.Provider value={{ ...catalog, ready }}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioContextValue {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio debe usarse dentro de PortfolioProvider')
  return value
}
