import type { ReactNode } from 'react'

/** Título de página con barra lateral (estilo landing luxury). */
export function AccentPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="relative pl-3 font-serif text-[clamp(1.65rem,3vw+0.5rem,2.35rem)] font-semibold leading-tight tracking-wide text-paper before:absolute before:left-0 before:top-[0.12em] before:bottom-[0.12em] before:w-[3px] before:rounded-sm before:bg-brand before:content-[''] sm:pl-4">
      {children}
    </h1>
  )
}
