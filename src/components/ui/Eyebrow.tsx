import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-wood">{children}</p>
  )
}
