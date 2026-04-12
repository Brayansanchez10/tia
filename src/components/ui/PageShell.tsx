import type { ReactNode } from 'react'
import { AccentPageTitle } from '@/components/ui/AccentPageTitle'
import { Eyebrow } from '@/components/ui/Eyebrow'

/** Contenedor estándar de página (fondo papel + ancho máximo + ritmo vertical). */
export function PageSection({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[50vh] w-full bg-paper">
      <div className="mx-auto max-w-[65rem] px-5 pb-16 pt-10 md:px-6 md:pb-20 md:pt-12">{children}</div>
    </div>
  )
}

type PageHeaderProps = {
  eyebrow: string
  title: string
  /** Línea secundaria bajo el título (ej. fecha en detalle de trabajo). */
  meta?: string
  intro?: string
}

/** Cabecera alineada con la home: eyebrow dorado + título con barra lateral. */
export function PageHeader({ eyebrow, title, meta, intro }: PageHeaderProps) {
  return (
    <header className="mb-10 md:mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <AccentPageTitle>{title}</AccentPageTitle>
      {meta ? <p className="mt-2 text-sm font-medium tracking-wide text-wood">{meta}</p> : null}
      {intro ? (
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-wood-dark/85 md:text-lg">
          {intro}
        </p>
      ) : null}
    </header>
  )
}
