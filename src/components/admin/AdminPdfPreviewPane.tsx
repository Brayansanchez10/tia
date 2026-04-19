import { PDFViewer } from '@react-pdf/renderer'
import { useEffect, useRef, useState, type ReactElement } from 'react'

type Props = {
  title: string
  /** Mismo documento que se descarga (`<CotizacionPdfDocument />` o `<ReciboPdfDocument />`). */
  document: ReactElement<Record<string, unknown>>
}

/**
 * Vista previa PDF en admin: en desktop queda fija al hacer scroll (sticky) y ocupa el alto útil
 * del viewport; el visor hace scroll interno cuando el PDF tiene varias páginas.
 */
export function AdminPdfPreviewPane({ title, document }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [viewerHeight, setViewerHeight] = useState(720)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const apply = () => {
      const h = shell.clientHeight
      setViewerHeight(Math.max(280, Math.floor(h)))
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
        className="h-[min(58dvh,520px)] min-h-[240px] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-sm border border-luxury-gold/20 bg-zinc-900 shadow-lg sm:h-[min(62dvh,560px)] sm:min-h-[300px] lg:h-auto lg:min-h-0 lg:flex-1"
      >
        <PDFViewer
          width="100%"
          height={viewerHeight}
          showToolbar={false}
          className="[&_iframe]:block [&_iframe]:w-full [&_iframe]:max-w-full"
        >
          {document}
        </PDFViewer>
      </div>
    </div>
  )
}
