import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { trabajoMediaIsVideo } from '@/content/site'

const SWIPE_PX = 48

const mediaFrameClass =
  'relative aspect-4/3 w-full max-w-full overflow-hidden rounded-lg bg-black shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-inset ring-paper/8 sm:rounded-xl'

function GallerySlide({
  src,
  index,
  total,
  title,
}: {
  src: string
  index: number
  total: number
  title: string
}) {
  const label =
    total > 1 ? `Pieza ${index + 1} de ${total} — ${title}` : `Proyecto: ${title}`

  if (trabajoMediaIsVideo(src)) {
    const ext = src.split('.').pop()?.toLowerCase()
    const mime =
      ext === 'webm' ? 'video/webm' : ext === 'ogg' || ext === 'ogv' ? 'video/ogg' : 'video/mp4'
    return (
      <figure className="m-0">
        <div className={mediaFrameClass}>
          <video
            className="absolute inset-0 h-full w-full object-contain"
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={`Vídeo ${index + 1} de ${total} — ${title}`}
          >
            <source src={src} type={mime} />
          </video>
        </div>
      </figure>
    )
  }

  return (
    <figure className="m-0">
      <div className={mediaFrameClass}>
        <img
          src={src}
          alt={label}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </figure>
  )
}

export function TrabajoGalleryList({ sources, title }: { sources: readonly string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const sourcesKey = sources.join('|')

  useEffect(() => {
    startTransition(() => {
      setIndex(0)
    })
  }, [sourcesKey])

  const total = sources.length
  const last = total - 1

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? last : i - 1))
  }, [last])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= last ? 0 : i + 1))
  }, [last])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (total <= 1) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    },
    [goPrev, goNext, total],
  )

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || total <= 1) return
    const end = e.changedTouches[0]?.clientX
    if (end == null) {
      touchStartX.current = null
      return
    }
    const delta = end - touchStartX.current
    touchStartX.current = null
    if (delta > SWIPE_PX) goPrev()
    else if (delta < -SWIPE_PX) goNext()
  }

  if (total === 0) {
    return (
      <div
        className="mx-auto flex aspect-4/3 w-full max-w-3xl items-center justify-center rounded-xl border border-wood/20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(225,29,50,0.15),transparent_55%),linear-gradient(145deg,#0f172a,#12151c)]"
        aria-hidden
      >
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-paper/45">
          Sin imágenes en este proyecto
        </span>
      </div>
    )
  }

  const currentSrc = sources[index]!

  return (
    <RevealOnView>
      <section
        className="mx-auto w-full max-w-4xl"
        aria-roledescription="carrusel"
        aria-label={`Galería de ${title}`}
        onKeyDown={onKeyDown}
      >
        <div
          className="relative touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          tabIndex={total > 1 ? 0 : undefined}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <GallerySlide src={currentSrc} index={index} total={total} title={title} />

          {total > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-ink/65 text-paper shadow-lg backdrop-blur-sm transition-colors hover:border-wood/40 hover:bg-ink/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:left-2 sm:h-11 sm:w-11 md:left-3 md:h-12 md:w-12"
                onClick={goPrev}
                aria-label="Anterior"
              >
                <span className="sr-only">Anterior</span>
                <span aria-hidden className="text-lg leading-none">
                  ‹
                </span>
              </button>
              <button
                type="button"
                className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-ink/65 text-paper shadow-lg backdrop-blur-sm transition-colors hover:border-wood/40 hover:bg-ink/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:right-2 sm:h-11 sm:w-11 md:right-3 md:h-12 md:w-12"
                onClick={goNext}
                aria-label="Siguiente"
              >
                <span className="sr-only">Siguiente</span>
                <span aria-hidden className="text-lg leading-none">
                  ›
                </span>
              </button>
            </>
          ) : null}
        </div>

        {total > 1 ? (
          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="m-0 text-center text-[0.7rem] font-medium uppercase tracking-[0.14em] text-paper/50">
              {index + 1} / {total}
              <span className="sr-only"> — pieza {index + 1} de {total}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2" aria-label="Seleccionar pieza">
              {sources.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  aria-label={`Ir a la pieza ${i + 1} de ${total}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`h-2 rounded-full transition-[width,background-color] duration-200 ${
                    i === index ? 'w-8 bg-gold' : 'w-2 bg-paper/25 hover:bg-paper/40'
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </RevealOnView>
  )
}
