import { useEffect, useRef } from 'react'

type HeroHomeVisualProps = {
  src: string
  /** En desktop con ratón: tilt siguiendo el cursor. En móvil debe ser false. */
  interactive?: boolean
  /** Modificadores del contenedor raíz (altura, alineación). */
  className?: string
}

export function HeroHomeVisual({ src, interactive = true, className = '' }: HeroHomeVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!interactive) return
    const root = rootRef.current
    if (!root) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tilt = root.querySelector<HTMLElement>('.home-hero-visual-tilt')
    if (!tilt) return

    const maxX = 5
    const maxY = 7

    const apply = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) return
      const x = ((e.clientX - r.left) / r.width) * 2 - 1
      const y = ((e.clientY - r.top) / r.height) * 2 - 1
      const clamp = (v: number) => Math.max(-1, Math.min(1, v))
      tilt.style.setProperty('--hero-tilt-x', `${clamp(y) * -maxX}deg`)
      tilt.style.setProperty('--hero-tilt-y', `${clamp(x) * maxY}deg`)
    }

    const reset = () => {
      tilt.style.setProperty('--hero-tilt-x', '0deg')
      tilt.style.setProperty('--hero-tilt-y', '0deg')
    }

    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')

    const sync = () => {
      root.removeEventListener('mousemove', apply)
      root.removeEventListener('mouseleave', reset)
      reset()
      if (mq.matches) {
        root.addEventListener('mousemove', apply)
        root.addEventListener('mouseleave', reset)
      }
    }

    sync()
    mq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      root.removeEventListener('mousemove', apply)
      root.removeEventListener('mouseleave', reset)
      reset()
    }
  }, [interactive])

  return (
    <div
      ref={rootRef}
      className={[
        'home-hero-visual-root w-full',
        interactive
          ? 'flex min-h-[min(62vw,20rem)] items-end justify-center md:min-h-[min(78vh,44rem)] md:items-center md:justify-end'
          : 'flex min-h-0 flex-col items-stretch justify-start',
        className,
      ].join(' ')}
    >
      <div className={`relative w-full ${interactive ? 'md:max-w-none md:pl-2 lg:pl-6 xl:pl-10' : ''}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_70%_40%,rgb(197_160_89_/_0.14),transparent_62%)] opacity-90 blur-2xl md:-inset-6 lg:-inset-10"
        />
        <div
          className={[
            'home-hero-visual-tilt relative mx-auto w-full max-w-none',
            interactive ? 'md:mx-0 md:w-[min(100%,min(96vw,72rem))] lg:w-[min(100%,min(98vw,80rem))] xl:w-[min(100%,min(98vw,88rem))]' : '',
          ].join(' ')}
        >
          <div
            className={[
              'home-hero-visual-plate relative overflow-hidden rounded-2xl border border-white/[0.12] bg-linear-to-b from-white/[0.07] to-white/[0.02] shadow-[0_24px_80px_rgb(0_0_0_/_0.55)] ring-1 ring-inset ring-white/[0.06]',
              interactive ? 'p-1.5 sm:p-2 md:rounded-3xl md:p-3 lg:p-4' : 'p-1 sm:p-1.5 md:rounded-3xl md:p-3 lg:p-4',
            ].join(' ')}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/[0.12] via-luxury-gold/[0.05] to-transparent opacity-90"
            />
            <img
              src={src}
              alt=""
              className={[
                'relative z-[1] h-auto w-full select-none object-contain drop-shadow-[0_20px_50px_rgb(0_0_0_/_0.5)]',
                interactive
                  ? 'max-h-[min(76dvh,34rem)] object-bottom object-center md:max-h-[min(92dvh,58rem)] md:object-right md:object-bottom md:scale-[1.08] lg:max-h-[min(94dvh,64rem)] lg:scale-[1.14] xl:scale-[1.18]'
                  : 'max-h-[min(92dvh,36rem)] object-center sm:max-h-[min(90dvh,40rem)] md:max-h-[min(92dvh,58rem)] md:object-right md:object-bottom md:scale-[1.08] lg:max-h-[min(94dvh,64rem)] lg:scale-[1.14] xl:scale-[1.18]',
              ].join(' ')}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
