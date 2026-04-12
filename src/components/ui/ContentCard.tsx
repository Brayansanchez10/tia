import type { ReactNode } from 'react'

/** Clases para el `<ul>` que envuelve varias `ContentCard` en retícula fluida. */
export const contentCardGridClass =
  'm-0 grid list-none gap-5 p-0 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] md:gap-6'

const shellClass =
  'rounded-sm border border-wood/15 bg-cream/90 p-6 shadow-card motion-safe:transition-[box-shadow,border-color] motion-safe:duration-300 motion-safe:hover:border-gold/45 motion-safe:hover:shadow-card-hover md:p-7'

export type ContentCardProps = {
  title: string
  headingLevel?: 2 | 3
  children?: ReactNode
}

export function ContentCard({ title, headingLevel = 3, children }: ContentCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <li className={shellClass}>
      <Heading>{title}</Heading>
      {children}
    </li>
  )
}
