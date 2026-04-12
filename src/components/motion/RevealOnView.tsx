import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealOnViewProps = {
  children: ReactNode
  className?: string
  /** Retardo al activarse (ms), para escalonar varios bloques. */
  delayMs?: number
}

/**
 * Aplica entrada suave cuando el bloque entra en el viewport (una sola vez).
 */
export function RevealOnView({ children, className = '', delayMs = 0 }: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'will-change-transform',
        'motion-reduce:translate-y-0 motion-reduce:opacity-100',
        shown
          ? 'translate-y-0 opacity-100'
          : 'motion-safe:translate-y-8 motion-safe:opacity-0',
        'motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
