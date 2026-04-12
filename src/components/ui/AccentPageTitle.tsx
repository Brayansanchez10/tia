import type { ReactNode } from 'react'

/** Título de página con barra lateral en degradado oro–madera. */
export function AccentPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="relative pl-4 before:absolute before:left-0 before:top-[0.15em] before:bottom-[0.15em] before:w-[3px] before:rounded-sm before:bg-gradient-to-b before:from-gold before:to-wood before:content-['']">
      {children}
    </h1>
  )
}
