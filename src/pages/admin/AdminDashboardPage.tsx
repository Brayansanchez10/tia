import { PDFViewer } from '@react-pdf/renderer'
import { useCallback, useState, type ReactNode } from 'react'
import { CotizacionPdfDocument } from '@/components/admin/CotizacionPdfDocument'
import { createDefaultCotizacion, defaultBranding } from '@/lib/cotizacion/defaults'
import { downloadCotizacionPdf } from '@/lib/cotizacion/downloadCotizacionPdf'
import { formatCOP } from '@/lib/cotizacion/format'
import type { CotizacionBranding, CotizacionData } from '@/types/cotizacion'

function newBlockId(): string {
  return crypto.randomUUID()
}

export function AdminDashboardPage() {
  const [data, setData] = useState<CotizacionData>(() => createDefaultCotizacion())
  const [exporting, setExporting] = useState(false)

  const update = useCallback((patch: Partial<CotizacionData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const patchBranding = useCallback((patch: Partial<CotizacionBranding>) => {
    setData((d) => ({ ...d, branding: { ...d.branding, ...patch } }))
  }, [])

  const downloadPdf = useCallback(async () => {
    setExporting(true)
    try {
      const safe =
        data.clientName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'cotizacion'
      await downloadCotizacionPdf(data, `COTIZACION-${safe}.pdf`)
    } finally {
      setExporting(false)
    }
  }, [data])

  return (
    <div className="mx-auto max-w-[72rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-2 border-b border-luxury-gold/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-paper sm:text-3xl">
            Cotizaciones
          </h1>
          <p className="mt-1 text-sm text-luxury-muted">
            PDF vectorial con <strong className="font-medium text-paper/90">@react-pdf/renderer</strong>.
            Ajusta la marca abajo; la vista previa es el mismo documento que se descarga. Total:{' '}
            <span className="tabular-nums text-luxury-gold">{formatCOP(data.totalAmount)}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setData(createDefaultCotizacion())}
            className="rounded-sm border border-luxury-gold/35 px-4 py-2 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper"
          >
            Restaurar ejemplo
          </button>
          <button
            type="button"
            onClick={() => {
              patchBranding(defaultBranding())
            }}
            className="rounded-sm border border-luxury-gold/25 px-4 py-2 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper"
          >
            Reset diseño
          </button>
          <button
            type="button"
            disabled={exporting}
            onClick={() => void downloadPdf()}
            className="rounded-sm border border-luxury-gold/50 bg-luxury-gold/15 px-4 py-2 text-sm font-medium text-luxury-gold transition-colors hover:bg-luxury-gold/25 disabled:opacity-50"
          >
            {exporting ? 'Generando…' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="space-y-6 text-sm">
          <FieldGroup title="Encabezado">
            <label className="block text-luxury-muted">
              Ciudad
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.city}
                onChange={(e) => update({ city: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Fecha (texto libre)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.dateLabel}
                onChange={(e) => update({ dateLabel: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Empresa / emisor
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.issuerName}
                onChange={(e) => update({ issuerName: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              NIT
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.issuerNit}
                onChange={(e) => update({ issuerNit: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Cliente (nombre en la cotización)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.clientName}
                onChange={(e) => update({ clientName: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Marca y diseño del PDF">
            <p className="text-xs text-luxury-muted">
              Coloca tu logo en <code className="text-luxury-gold/90">public/img/</code> y usa la ruta{' '}
              <code className="text-luxury-gold/90">/img/marca.png</code>, o pega una URL https.
            </p>
            <label className="block text-luxury-muted">
              Logo (ruta o URL)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 font-mono text-xs text-paper outline-none focus:border-luxury-gold"
                value={data.branding.logoUrl}
                onChange={(e) => patchBranding({ logoUrl: e.target.value })}
                placeholder="/img/logo.png"
              />
            </label>
            <label className="block text-luxury-muted">
              Título del documento
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.branding.documentTitle}
                onChange={(e) => patchBranding({ documentTitle: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Línea de marca (opcional, bajo el NIT en el encabezado)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.branding.tagline}
                onChange={(e) => patchBranding({ tagline: e.target.value })}
              />
            </label>
            <ColorField
              label="Color de acento (dorado, marca)"
              value={data.branding.accentColor}
              onChange={(v) => patchBranding({ accentColor: v })}
            />
            <ColorField
              label="Fondo barra superior"
              value={data.branding.headerBgColor}
              onChange={(v) => patchBranding({ headerBgColor: v })}
            />
            <ColorField
              label="Fondo de la hoja"
              value={data.branding.paperBgColor}
              onChange={(v) => patchBranding({ paperBgColor: v })}
            />
            <ColorField
              label="Texto principal"
              value={data.branding.textColor}
              onChange={(v) => patchBranding({ textColor: v })}
            />
            <ColorField
              label="Texto secundario"
              value={data.branding.mutedColor}
              onChange={(v) => patchBranding({ mutedColor: v })}
            />
            <ColorField
              label="Fondo de cajas (valor, cliente)"
              value={data.branding.panelBgColor}
              onChange={(v) => patchBranding({ panelBgColor: v })}
            />
          </FieldGroup>

          <FieldGroup title="Totales">
            <label className="block text-luxury-muted">
              Valor total (COP, número)
              <input
                type="number"
                min={0}
                step={1000}
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={Number.isFinite(data.totalAmount) ? data.totalAmount : 0}
                onChange={(e) => update({ totalAmount: Number(e.target.value) || 0 })}
              />
            </label>
            <label className="block text-luxury-muted">
              Resumen del concepto (ej. &quot;10 muebles&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.conceptSummary}
                onChange={(e) => update({ conceptSummary: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Descripción (bloques)">
            {data.descriptionBlocks.map((block, index) => (
              <div
                key={block.id}
                className="rounded-sm border border-luxury-gold/20 bg-luxury-panel/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-luxury-gold">Bloque {index + 1}</span>
                  <button
                    type="button"
                    className="text-xs text-red-300/90 hover:text-red-200"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        descriptionBlocks: d.descriptionBlocks.filter((b) => b.id !== block.id),
                      }))
                    }
                  >
                    Quitar
                  </button>
                </div>
                <label className="mt-2 block text-luxury-muted">
                  Título
                  <input
                    className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-bg px-2 py-1.5 text-sm text-paper outline-none focus:border-luxury-gold"
                    value={block.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setData((d) => ({
                        ...d,
                        descriptionBlocks: d.descriptionBlocks.map((b) =>
                          b.id === block.id ? { ...b, title } : b,
                        ),
                      }))
                    }}
                  />
                </label>
                <label className="mt-2 block text-luxury-muted">
                  Detalle (una línea por ítem)
                  <textarea
                    rows={5}
                    className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-bg px-2 py-1.5 text-sm text-paper outline-none focus:border-luxury-gold"
                    value={block.body}
                    onChange={(e) => {
                      const body = e.target.value
                      setData((d) => ({
                        ...d,
                        descriptionBlocks: d.descriptionBlocks.map((b) =>
                          b.id === block.id ? { ...b, body } : b,
                        ),
                      }))
                    }}
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              className="w-full rounded-sm border border-dashed border-luxury-gold/35 py-2 text-sm text-luxury-muted hover:border-luxury-gold/50 hover:text-paper"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  descriptionBlocks: [
                    ...d.descriptionBlocks,
                    { id: newBlockId(), title: 'Nuevo ítem', body: '' },
                  ],
                }))
              }
            >
              + Añadir bloque
            </button>
          </FieldGroup>

          <FieldGroup title="Cierre (Base / costo unitario)">
            <label className="block text-luxury-muted">
              Título de la sección final
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.closingSectionTitle}
                onChange={(e) => update({ closingSectionTitle: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Detalle
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.closingSectionBody}
                onChange={(e) => update({ closingSectionBody: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Costo unitario (COP, vacío = ocultar)
              <input
                type="number"
                min={0}
                step={1000}
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.unitCost ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  update({ unitCost: v === '' ? null : Number(v) || null })
                }}
              />
            </label>
            <label className="block text-luxury-muted">
              Texto tras el monto (ej. &quot;por mueble&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.unitCostSuffix}
                onChange={(e) => update({ unitCostSuffix: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Notas y firma">
            <label className="block text-luxury-muted">
              Notas (una por línea)
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.footerNotes}
                onChange={(e) => update({ footerNotes: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Nombre (firma)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerName}
                onChange={(e) => update({ signerName: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Teléfono
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerPhone}
                onChange={(e) => update({ signerPhone: e.target.value })}
              />
            </label>
          </FieldGroup>
        </div>

        <div>
          <p className="mb-3 text-xs tracking-wide text-luxury-muted uppercase">
            Vista previa (mismo PDF)
          </p>
          <div className="overflow-hidden rounded-sm border border-luxury-gold/20 bg-luxury-panel/20">
            <PDFViewer
              width="100%"
              height={720}
              showToolbar={false}
              className="[&_iframe]:min-h-[720px]"
            >
              <CotizacionPdfDocument data={data} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-sm border border-luxury-gold/15 bg-luxury-bg/40 p-4">
      <legend className="px-1 text-xs font-medium tracking-wide text-luxury-gold uppercase">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <label className="block text-luxury-muted">
      {label}
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded-sm border border-luxury-gold/30 bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[8rem] flex-1 rounded-sm border border-luxury-gold/25 bg-luxury-panel px-2 py-1.5 font-mono text-xs text-paper outline-none focus:border-luxury-gold"
          placeholder="#c5a059"
        />
      </div>
    </label>
  )
}
