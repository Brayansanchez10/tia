import { BlobProvider, Document } from '@react-pdf/renderer'
import { useEffect, useRef, useState, type ComponentProps, type ReactElement } from 'react'

type PdfDocumentElement = ReactElement<ComponentProps<typeof Document>>

type Props = {
  title: string
  /** Mismo documento que se descarga (`<CotizacionPdfDocument />` o `<ReciboPdfDocument />`). */
  document: PdfDocumentElement
}

/**
 * Móviles (sobre todo iOS Safari) suelen no pintar PDFs en blob dentro de `<iframe>` (como hace `PDFViewer`).
 * Usamos `<embed>` + enlace de respaldo cuando la pantalla es estrecha o el puntero es táctil.
 */
function usePreferPdfEmbed(): boolean {
  const [preferEmbed, setPreferEmbed] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return (
        window.matchMedia('(max-width: 1023px)').matches ||
        window.matchMedia('(pointer: coarse)').matches
      )
    } catch {
      return true
    }
  })

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 1023px)')
    const coarse = window.matchMedia('(pointer: coarse)')
    const apply = () => setPreferEmbed(narrow.matches || coarse.matches)
    apply()
    narrow.addEventListener('change', apply)
    coarse.addEventListener('change', apply)
    return () => {
      narrow.removeEventListener('change', apply)
      coarse.removeEventListener('change', apply)
    }
  }, [])

  return preferEmbed
}

/**
 * Vista previa PDF en admin: en desktop queda fija al hacer scroll (sticky) y ocupa el alto útil
 * del viewport; en móvil el visor usa `<embed>` por compatibilidad con Safari.
 */
export function AdminPdfPreviewPane({ title, document }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [viewerHeight, setViewerHeight] = useState(480)
  const preferEmbed = usePreferPdfEmbed()

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const apply = () => {
      const h = shell.clientHeight
      setViewerHeight(Math.max(320, Math.floor(h)))
    }
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(apply)
    })
    ro.observe(shell)
    requestAnimationFrame(() => requestAnimationFrame(apply))
    return () => ro.disconnect()
  }, [])

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-2 sm:gap-3 lg:sticky lg:top-20 lg:z-10 lg:self-start lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)]">
      <p className="shrink-0 text-xs tracking-wide text-luxury-muted uppercase">{title}</p>
      <div
        ref={shellRef}
        className="h-[min(58dvh,520px)] min-h-[260px] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-sm border border-luxury-gold/20 bg-zinc-900 shadow-lg sm:h-[min(62dvh,560px)] sm:min-h-[300px] lg:h-auto lg:min-h-0 lg:flex-1"
      >
        <BlobProvider document={document}>
          {({ url, loading, error }) => {
            if (error) {
              return (
                <p className="p-4 text-sm leading-relaxed text-red-300/95">
                  No se pudo generar la vista previa. {error.message}
                </p>
              )
            }
            if (loading || !url) {
              return (
                <div className="flex min-h-[240px] items-center justify-center px-4 py-8">
                  <p className="text-center text-sm text-luxury-muted">Generando vista previa…</p>
                </div>
              )
            }

            if (preferEmbed) {
              return (
                <div className="flex flex-col gap-2 pb-3">
                  <embed
                    type="application/pdf"
                    src={url}
                    title={title}
                    width="100%"
                    height={viewerHeight}
                    className="block w-full max-w-full min-h-[280px]"
                    style={{ minHeight: Math.max(280, viewerHeight) }}
                  />
                  <p className="px-2 text-center text-[0.7rem] leading-snug text-luxury-muted">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-luxury-gold underline decoration-luxury-gold/40 underline-offset-2"
                    >
                      Abrir PDF en pestaña nueva
                    </a>
                    <span className="max-sm:block max-sm:mt-1">
                      {' '}
                      — si no ves el documento arriba (p. ej. algunos navegadores en iPhone), usa este enlace.
                    </span>
                  </p>
                </div>
              )
            }

            return (
              <iframe
                title={title}
                src={`${url}#toolbar=0`}
                width="100%"
                height={viewerHeight}
                className="block w-full max-w-full border-0 bg-zinc-900"
              />
            )
          }}
        </BlobProvider>
      </div>
    </div>
  )
}
