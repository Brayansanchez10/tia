import type { ReactNode } from 'react'

/** Título de página con marca lateral sutil. */
export function AccentPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="relative pl-3.5 font-serif text-[clamp(1.7rem,3.2vw+0.5rem,2.45rem)] font-semibold leading-tight tracking-tight text-paper before:absolute before:left-0 before:top-[0.18em] before:bottom-[0.18em] before:w-[3px] before:rounded-sm before:bg-brand before:content-[''] sm:pl-4">
      {children}
    </h1>
  )
}
