import type { ReactNode } from 'react'
import { AccentPageTitle } from '@/components/ui/AccentPageTitle'
import { Eyebrow } from '@/components/ui/Eyebrow'

type PageSectionProps = {
  children: ReactNode
  /** Sin caja central: útil para galerías a todo el ancho del viewport. */
  edgeToEdge?: boolean
}

/** Contenedor estándar de página (fondo oscuro alineado con la marca). */
export function PageSection({ children, edgeToEdge }: PageSectionProps) {
  if (edgeToEdge) {
    return (
      <div className="min-h-[50vh] w-full bg-transparent pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-24 md:pt-10">{children}</div>
    )
  }
  return (
    <div className="min-h-[50vh] w-full bg-transparent">
      <div className="mx-auto max-w-[65rem] px-4 pb-12 pt-8 sm:px-5 sm:pb-16 sm:pt-10 md:px-6 md:pb-20 md:pt-12">
        {children}
      </div>
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

/** Cabecera alineada con la home: eyebrow en azul + título con barra lateral. */
export function PageHeader({ eyebrow, title, meta, intro }: PageHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10 md:mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <AccentPageTitle>{title}</AccentPageTitle>
      {meta ? <p className="mt-2 text-sm font-medium tracking-wide text-wood">{meta}</p> : null}
      {intro ? (
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-paper/80 md:text-lg">
          {intro}
        </p>
      ) : null}
    </header>
  )
}
