import { useEffect, useRef, useState } from 'react'

type GrowLineProps = {
  align?: 'left' | 'center'
  className?: string
}

/**
 * Línea dorada que crece al entrar en el viewport (una sola vez).
 */
export function GrowLine({ align = 'left', className = '' }: GrowLineProps) {
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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'h-0.5 w-14 bg-luxury-gold/90',
        align === 'center' ? 'mx-auto origin-center' : 'origin-left',
        'motion-safe:transition-transform motion-safe:duration-[1000ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
        shown ? 'motion-safe:scale-x-100' : 'motion-safe:scale-x-0',
        'motion-reduce:scale-x-100',
        className,
      ].join(' ')}
      aria-hidden
    />
  )
}
