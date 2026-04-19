import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { trabajoMediaIsVideo } from '@/content/site'

const SWIPE_PX = 48

const defaultFrameClass =
  'relative aspect-[4/3] w-full max-w-full min-h-[min(40vh,440px)] overflow-hidden rounded-xl bg-[#050505] shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.04)] ring-1 ring-inset ring-white/[0.07] sm:min-h-[min(46vh,520px)] sm:rounded-2xl lg:min-h-[min(52vh,680px)]'

/** Marco 4:3 con suelo de altura para que el visor se sienta grande en pantalla. */
const detailFrameClass =
  'relative w-full aspect-[4/3] min-h-[min(42vh,480px)] overflow-hidden rounded-xl bg-[#060606] shadow-[0_20px_56px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.045)] ring-1 ring-inset ring-white/[0.08] max-lg:min-h-[min(48dvh,380px)] max-lg:rounded-none max-lg:shadow-[0_12px_40px_rgba(0,0,0,0.35)] max-lg:ring-0 sm:min-h-[min(48vh,560px)] sm:rounded-2xl sm:max-lg:rounded-xl sm:max-lg:ring-1 lg:min-h-[min(56vh,760px)]'

const detailInnerClass = 'absolute inset-0 flex flex-col p-1 sm:p-1.5'

const videoBarClass =
  'flex shrink-0 items-center gap-2 border-t border-white/10 bg-black/75 px-2 py-2 backdrop-blur-sm sm:gap-3 sm:px-3'

const imageBarClass = `${videoBarClass} justify-end`

function getFullscreenElement(): Element | null {
  const d = document as Document & { webkitFullscreenElement?: Element | null }
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

function exitDocumentFullscreen() {
  const d = document as Document & { webkitExitFullscreen?: () => void }
  void (document.exitFullscreen?.() ?? d.webkitExitFullscreen?.())
}

function toggleGalleryFullscreen(shell: HTMLElement | null, media: HTMLElement | null) {
  if (!shell) return
  if (getFullscreenElement()) {
    exitDocumentFullscreen()
    return
  }
  if (media instanceof HTMLVideoElement) {
    const v = media as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    if (typeof v.webkitEnterFullscreen === 'function') {
      v.webkitEnterFullscreen()
      return
    }
  }
  const el = shell as HTMLElement & { webkitRequestFullscreen?: () => void }
  void (shell.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())
}

function useShellFullscreen(shellRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const sync = () => {
      const shell = shellRef.current
      setIsFullscreen(!!shell && getFullscreenElement() === shell)
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    sync()
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [shellRef])

  const exitFullscreen = useCallback(() => {
    if (shellRef.current && getFullscreenElement() === shellRef.current) {
      exitDocumentFullscreen()
    }
  }, [shellRef])

  return { isFullscreen, exitFullscreen }
}

function FullscreenGlyphButton({ onClick, isFullscreen }: { onClick: () => void; isFullscreen?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/15 bg-white/5 text-paper transition-colors hover:border-luxury-gold/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/60"
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
    >
      {isFullscreen ? (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 14v4h4M14 18h4v-4M18 10V6h-4M10 6H6v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

function CloseFullscreenControl({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  if (!visible) return null
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-3 top-3 z-30 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/85 px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper shadow-lg backdrop-blur-md transition-colors hover:border-luxury-gold/45 hover:bg-black/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/60 sm:right-4 sm:top-4 sm:px-4"
      aria-label="Cerrar pantalla completa"
    >
      <span aria-hidden className="text-lg leading-none text-paper/90">
        ×
      </span>
      Cerrar
    </button>
  )
}

function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Sin controles nativos del navegador: sin icono de audio ni menú (descarga, etc.). Siempre silenciado. */
function GalleryVideo({
  src,
  mime,
  ariaLabel,
  layout,
}: {
  src: string
  mime: string
  ariaLabel: string
  layout: 'default' | 'detail'
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    setPlaying(false)
    setCurrent(0)
    setDuration(0)
    v.load()
  }, [src])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }, [])

  const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v) return
    const t = Number.parseFloat(e.target.value)
    if (Number.isFinite(t)) v.currentTime = t
  }, [])

  const requestFs = useCallback(() => {
    toggleGalleryFullscreen(shellRef.current, videoRef.current)
  }, [])

  const { isFullscreen, exitFullscreen } = useShellFullscreen(shellRef)

  const rootClass =
    layout === 'default'
      ? 'absolute inset-0 flex flex-col'
      : 'flex h-full w-full max-h-full max-w-full flex-col'

  return (
    <div
      ref={shellRef}
      className={`${rootClass} relative bg-transparent [:fullscreen]:bg-black [:fullscreen]:min-h-[100dvh]`}
    >
      <CloseFullscreenControl visible={isFullscreen} onClose={exitFullscreen} />
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <video
          ref={videoRef}
          className="max-h-full max-w-full cursor-pointer object-contain"
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label={ariaLabel}
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
          onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type={mime} />
        </video>
      </div>

      <div className={videoBarClass}>
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/15 bg-white/5 text-paper transition-colors hover:border-luxury-gold/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/60"
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? (
            <svg aria-hidden className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="3" height="10" rx="0.5" />
              <rect x="8" y="1" width="3" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg aria-hidden className="ml-0.5 h-4 w-4" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 1.5v9l7-4.5-7-4.5z" />
            </svg>
          )}
        </button>
        <span className="shrink-0 font-mono text-[0.65rem] tabular-nums text-paper/70 sm:text-xs">
          {formatVideoTime(current)} / {formatVideoTime(duration)}
        </span>
        <input
          type="range"
          min={0}
          max={Number.isFinite(duration) && duration > 0 ? duration : 0}
          step="any"
          value={Number.isFinite(current) ? Math.min(current, duration || 0) : 0}
          onChange={onSeek}
          className="min-w-0 flex-1 accent-luxury-gold"
          aria-label="Posición en el vídeo"
        />
        <FullscreenGlyphButton onClick={requestFs} isFullscreen={isFullscreen} />
      </div>
    </div>
  )
}

function GalleryImage({
  src,
  alt,
  layout,
}: {
  src: string
  alt: string
  layout: 'default' | 'detail'
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const requestFs = useCallback(() => {
    toggleGalleryFullscreen(shellRef.current, imgRef.current)
  }, [])

  const { isFullscreen, exitFullscreen } = useShellFullscreen(shellRef)

  const rootClass =
    layout === 'default'
      ? 'absolute inset-0 flex flex-col'
      : 'flex h-full w-full max-h-full max-w-full flex-col'

  return (
    <div
      ref={shellRef}
      className={`${rootClass} relative bg-transparent [:fullscreen]:bg-black [:fullscreen]:min-h-[100dvh]`}
    >
      <CloseFullscreenControl visible={isFullscreen} onClose={exitFullscreen} />
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="max-h-full max-w-full object-contain [:fullscreen]:max-h-[calc(100dvh-3.5rem)] [:fullscreen]:max-w-[100vw]"
        />
      </div>
      <div className={imageBarClass}>
        <FullscreenGlyphButton onClick={requestFs} isFullscreen={isFullscreen} />
      </div>
    </div>
  )
}

function GalleryThumbnailButton({
  src,
  isActive,
  onSelect,
  index,
  total,
}: {
  src: string
  isActive: boolean
  onSelect: () => void
  index: number
  total: number
}) {
  const isVideo = trabajoMediaIsVideo(src)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Ver pieza ${index + 1} de ${total}`}
      aria-current={isActive ? 'true' : undefined}
      className={[
        'group relative aspect-square w-[4.75rem] shrink-0 overflow-hidden rounded-lg border-2 motion-safe:transition-[border-color,box-shadow,opacity,transform] motion-safe:duration-300 max-lg:w-[5.25rem] sm:w-[5.25rem] lg:w-full',
        isActive
          ? 'z-[1] border-luxury-gold shadow-[0_0_0_1px_rgba(197,160,89,0.25),0_10px_28px_-8px_rgba(197,160,89,0.22)] motion-safe:scale-[1.03]'
          : 'border-transparent bg-black/35 opacity-90 ring-1 ring-inset ring-white/[0.07] motion-safe:hover:scale-[1.02] motion-safe:hover:opacity-100 motion-safe:hover:ring-white/12',
      ].join(' ')}
    >
      <span
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-white/[0.04] opacity-80 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      {isVideo ? (
        <>
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            className="pointer-events-none h-full w-full object-cover"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/25"
            aria-hidden
          >
            <span className="rounded-full border border-white/25 bg-black/60 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/95 shadow-sm backdrop-blur-[2px]">
              ▶
            </span>
          </span>
        </>
      ) : (
        <img
          src={src}
          alt=""
          className="relative z-0 h-full w-full object-cover"
          loading={index < 6 ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </button>
  )
}

/** Flechas debajo del visor, fuera de la card, alineadas a la derecha. */
function GalleryNavArrowsBottom({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const btnClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/18 bg-black/60 text-paper shadow-md backdrop-blur-sm transition-[border-color,background-color,color,transform] motion-safe:duration-200 hover:border-luxury-gold/45 hover:bg-black/80 hover:text-luxury-gold motion-safe:active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/55 sm:h-12 sm:w-12'

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5" role="group" aria-label="Anterior y siguiente">
      <button type="button" className={btnClass} onClick={onPrev} aria-label="Imagen anterior">
        <svg aria-hidden className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button type="button" className={btnClass} onClick={onNext} aria-label="Imagen siguiente">
        <svg aria-hidden className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  )
}

function GalleryDotPager({
  index,
  total,
  onSelect,
  className = '',
}: {
  index: number
  total: number
  onSelect: (i: number) => void
  className?: string
}) {
  if (total <= 1) return null
  return (
    <div
      className={`flex justify-center gap-2 py-1 ${className}`}
      role="tablist"
      aria-label="Seleccionar imagen"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Imagen ${i + 1} de ${total}`}
          onClick={() => onSelect(i)}
          className={[
            'h-2 rounded-full motion-safe:transition-all motion-safe:duration-200',
            i === index ? 'w-7 bg-luxury-gold' : 'w-2 bg-white/35 hover:bg-white/55',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

function GalleryIndexBadge({ index, total }: { index: number; total: number }) {
  return (
    <p className="m-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="font-mono text-[0.68rem] font-semibold tabular-nums text-luxury-gold">{index + 1}</span>
      <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-paper/40">de</span>
      <span className="font-mono text-[0.68rem] tabular-nums text-paper/55">{total}</span>
      <span className="sr-only"> — pieza {index + 1} de {total}</span>
    </p>
  )
}

function GallerySlide({
  src,
  index,
  total,
  title,
  variant,
}: {
  src: string
  index: number
  total: number
  title: string
  variant: 'default' | 'detail'
}) {
  const label =
    total > 1 ? `Pieza ${index + 1} de ${total} — ${title}` : `Proyecto: ${title}`

  if (trabajoMediaIsVideo(src)) {
    const ext = src.split('.').pop()?.toLowerCase()
    const mime =
      ext === 'webm' ? 'video/webm' : ext === 'ogg' || ext === 'ogv' ? 'video/ogg' : 'video/mp4'
    if (variant === 'detail') {
      return (
        <figure className="m-0 w-full min-w-0">
          <div className={detailFrameClass}>
            <div className={detailInnerClass}>
              <GalleryVideo
                src={src}
                mime={mime}
                layout="detail"
                ariaLabel={`Vídeo ${index + 1} de ${total} — ${title}`}
              />
            </div>
          </div>
        </figure>
      )
    }
    return (
      <figure className="m-0 w-full min-w-0">
        <div className={defaultFrameClass}>
          <GalleryVideo
            src={src}
            mime={mime}
            layout="default"
            ariaLabel={`Vídeo ${index + 1} de ${total} — ${title}`}
          />
        </div>
      </figure>
    )
  }

  if (variant === 'detail') {
    return (
      <figure className="m-0 w-full min-w-0">
        <div className={detailFrameClass}>
          <div className={detailInnerClass}>
            <GalleryImage src={src} alt={label} layout="detail" />
          </div>
        </div>
      </figure>
    )
  }

  return (
    <figure className="m-0 w-full min-w-0">
      <div className={defaultFrameClass}>
        <GalleryImage src={src} alt={label} layout="default" />
      </div>
    </figure>
  )
}

export function TrabajoGalleryList({
  sources,
  title,
  variant = 'default',
}: {
  sources: readonly string[]
  title: string
  /** `detail`: columna ancha en vista proyecto (imagen con más peso). */
  variant?: 'default' | 'detail'
}) {
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
        className={[
          'flex w-full items-center justify-center rounded-xl border border-wood/20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(225,29,50,0.15),transparent_55%),linear-gradient(145deg,#0f172a,#12151c)]',
          variant === 'detail'
            ? 'aspect-[4/3] w-full'
            : 'mx-auto aspect-[4/3] max-w-3xl',
        ].join(' ')}
        aria-hidden
      >
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-paper/45">
          Sin imágenes en este proyecto
        </span>
      </div>
    )
  }

  const currentSrc = sources[index]!

  const mainStage =
    total > 1 ? (
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3.5">
        <div
          className={[
            'rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-1.5',
            variant === 'detail'
              ? 'max-lg:rounded-none max-lg:border-x-0 max-lg:border-t-0 max-lg:border-b max-lg:border-white/10 max-lg:bg-transparent max-lg:p-0 max-lg:shadow-none'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className="relative min-w-0 touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <GallerySlide src={currentSrc} index={index} total={total} title={title} variant={variant} />
          </div>
        </div>
        {variant === 'detail' ? (
          <GalleryDotPager
            className="lg:hidden"
            index={index}
            total={total}
            onSelect={(i) => startTransition(() => setIndex(i))}
          />
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 px-0.5 max-lg:px-1">
          <GalleryIndexBadge index={index} total={total} />
          <GalleryNavArrowsBottom onPrev={goPrev} onNext={goNext} />
        </div>
      </div>
    ) : (
      <div
        className="relative min-w-0 flex-1 touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg"
        tabIndex={undefined}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <GallerySlide src={currentSrc} index={index} total={total} title={title} variant={variant} />
      </div>
    )

  return (
    <RevealOnView>
      <section
        className={variant === 'detail' ? 'w-full max-w-none' : 'mx-auto w-full max-w-4xl'}
        aria-roledescription="galería"
        aria-label={`Galería de ${title}`}
      >
        {total > 1 ? (
          <div
            className={[
              'flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6',
              variant === 'detail' ? 'max-lg:flex-col-reverse max-lg:gap-3' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="relative min-w-0 lg:w-24 lg:flex-shrink-0">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-luxury-bg to-transparent lg:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-luxury-bg to-transparent lg:hidden"
                aria-hidden
              />
              <nav
                className={[
                  'relative flex flex-row gap-2.5 overflow-x-auto overflow-y-hidden px-1 py-1 [scrollbar-width:thin] lg:flex-col lg:gap-3 lg:overflow-x-hidden lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-white/[0.08] lg:bg-gradient-to-b lg:from-luxury-panel/50 lg:to-black/50 lg:px-2 lg:py-3 lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:[scrollbar-gutter:stable] lg:sticky lg:top-0 lg:max-h-[min(72vh,680px)]',
                  variant === 'detail'
                    ? 'max-lg:rounded-none max-lg:border-0 max-lg:bg-black/20 max-lg:px-3 max-lg:py-2'
                    : 'rounded-2xl border border-white/[0.08] bg-gradient-to-b from-luxury-panel/50 to-black/50 px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label="Miniaturas"
              >
                {sources.map((src, i) => (
                  <GalleryThumbnailButton
                    key={`${src}-${i}`}
                    src={src}
                    index={i}
                    total={total}
                    isActive={i === index}
                    onSelect={() => setIndex(i)}
                  />
                ))}
              </nav>
            </div>
            {mainStage}
          </div>
        ) : (
          mainStage
        )}
      </section>
    </RevealOnView>
  )
}
