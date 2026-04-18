import { useEffect, useRef, useState, type ReactNode } from 'react'

export type RevealVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'fadeDown'

type RevealOnViewProps = {
  children: ReactNode
  className?: string
  /** Retardo al activarse (ms), para escalonar varios bloques. */
  delayMs?: number
  /** Estilo de entrada al aparecer en viewport. */
  variant?: RevealVariant
}

const variantClasses: Record<
  RevealVariant,
  { hidden: string; shown: string; transition: string }
> = {
  fadeUp: {
    hidden: 'motion-safe:translate-y-10 motion-safe:opacity-0',
    shown: 'translate-y-0 opacity-100',
    transition: 'motion-safe:transition-[opacity,transform] motion-safe:duration-[850ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
  },
  fadeDown: {
    hidden: 'motion-safe:-translate-y-8 motion-safe:opacity-0',
    shown: 'translate-y-0 opacity-100',
    transition: 'motion-safe:transition-[opacity,transform] motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
  },
  fadeLeft: {
    hidden: 'motion-safe:translate-x-10 motion-safe:opacity-0',
    shown: 'translate-x-0 opacity-100',
    transition: 'motion-safe:transition-[opacity,transform] motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
  },
  fadeRight: {
    hidden: 'motion-safe:-translate-x-10 motion-safe:opacity-0',
    shown: 'translate-x-0 opacity-100',
    transition: 'motion-safe:transition-[opacity,transform] motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
  },
  scale: {
    hidden: 'motion-safe:translate-y-6 motion-safe:scale-[0.94] motion-safe:opacity-0',
    shown: 'translate-y-0 scale-100 opacity-100',
    transition:
      'motion-safe:transition-[opacity,transform] motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
  },
}

/**
 * Aplica entrada suave cuando el bloque entra en el viewport (una sola vez).
 */
export function RevealOnView({
  children,
  className = '',
  delayMs = 0,
  variant = 'fadeUp',
}: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const v = variantClasses[variant]

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
      { threshold: 0.06, rootMargin: '0px 0px -5% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'will-change-[transform,opacity]',
        shown ? v.shown : v.hidden,
        v.transition,
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
