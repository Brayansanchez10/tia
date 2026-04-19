import type { TrabajoPortfolioKind } from '@/content/site'

export function trabajoPortfolioHref(kind: TrabajoPortfolioKind): string {
  return `/trabajos/portafolio/${kind}`
}

export function IconBuilding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M6 12h4v10H6zM14 12h4v10h-4zM2 22h20" />
      <path d="M9 6h2M13 6h2M9 9h2M13 9h2" />
    </svg>
  )
}

export function IconHome({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" />
    </svg>
  )
}

export const TRABAJO_CATEGORY_META: Record<
  TrabajoPortfolioKind,
  {
    title: string
    blurb: string
    label: string
    icon: typeof IconBuilding
    /** Barra superior decorativa (gradiente). */
    accentBarClass: string
    /** Tono del icono decorativo de fondo. */
    decoGlowClass: string
  }
> = {
  corporativo: {
    title: 'Proyectos corporativos y comerciales',
    blurb: 'Muebles y exhibición para empresas, retail y puntos de venta.',
    label: 'Empresa & retail',
    icon: IconBuilding,
    accentBarClass: 'from-luxury-gold via-luxury-gold/50 to-transparent',
    decoGlowClass: 'bg-luxury-gold/[0.12]',
  },
  residencial: {
    title: 'Proyectos residenciales',
    blurb: 'Piezas a medida para hogar: cocinas, salas, dormitorios y más.',
    label: 'Hogar',
    icon: IconHome,
    accentBarClass: 'from-luxury-gold/80 via-amber-200/40 to-transparent',
    decoGlowClass: 'bg-amber-50/[0.06]',
  },
}

export function parseTrabajoPortfolioKindParam(param: string | undefined): TrabajoPortfolioKind | undefined {
  if (param === 'corporativo' || param === 'residencial') return param
  return undefined
}

/** Pasa esto en `Link state` para que el detalle sepa a dónde «volver». */
export type TrabajosVolverState = {
  trabajosVolver?: string
}

export function resolveTrabajosVolverHref(state: unknown, fallbackHref: string): string {
  const s = state as TrabajosVolverState | null | undefined
  if (s?.trabajosVolver && typeof s.trabajosVolver === 'string' && s.trabajosVolver.startsWith('/')) {
    return s.trabajosVolver
  }
  return fallbackHref
}

export function trabajosVolverBackLineLabel(href: string): string {
  if (href.includes('/portafolio/')) return '← Volver al portafolio'
  if (href === '/trabajos') return '← Volver a trabajos'
  return '← Volver'
}

export function trabajosVolverCrumbLabel(href: string): string {
  if (href.includes('/portafolio/')) return 'Portafolio'
  return 'Trabajos'
}
