import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-luxury-gold">{children}</p>
  )
}
