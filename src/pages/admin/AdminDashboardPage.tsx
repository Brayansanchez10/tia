import { useCallback, useState, type ReactNode } from 'react'
import { AdminPdfPreviewPane } from '@/components/admin/AdminPdfPreviewPane'
import { CotizacionPdfDocument } from '@/components/admin/CotizacionPdfDocument'
import { COMPANY_LOGO_SRC } from '@/lib/branding'
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
    <div className="mx-auto min-w-0 max-w-[72rem] px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-4 border-b border-luxury-gold/20 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-serif)] text-xl text-paper sm:text-2xl lg:text-3xl">
            Cotizaciones
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-luxury-muted sm:mt-1">
            Generación de cotizaciones en PDF. Total: {}
            <span className="tabular-nums text-luxury-gold">{formatCOP(data.totalAmount)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setData(createDefaultCotizacion())}
            className="min-h-11 w-full rounded-sm border border-luxury-gold/35 px-4 py-2.5 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper sm:w-auto sm:py-2"
          >
            Restaurar plantilla
          </button>
          <button
            type="button"
            onClick={() => {
              patchBranding(defaultBranding())
            }}
            className="min-h-11 w-full rounded-sm border border-luxury-gold/25 px-4 py-2.5 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper sm:w-auto sm:py-2"
          >
            Reset diseño
          </button>
          <button
            type="button"
            disabled={exporting}
            onClick={() => void downloadPdf()}
            className="min-h-11 w-full rounded-sm border border-luxury-gold/50 bg-luxury-gold/15 px-4 py-2.5 text-sm font-medium text-luxury-gold transition-colors hover:bg-luxury-gold/25 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {exporting ? 'Generando…' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid min-w-0 items-start gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="min-w-0 space-y-5 text-sm sm:space-y-6">
          <FieldGroup title="Encabezado">
            <label className="block text-luxury-muted">
              Ciudad (ej. Medellín)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="Medellín"
              />
            </label>
            <label className="block text-luxury-muted">
              Fecha
              <input
                disabled
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
                disabled
              />
            </label>
            <label className="block text-luxury-muted">
              NIT
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.issuerNit}
                onChange={(e) => update({ issuerNit: e.target.value })}
                disabled
              />
            </label>
            <label className="block text-luxury-muted">
              Cliente (nombre en la cotización) (ej. &quot;Inversiones del Valle S.A.S.&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.clientName}
                onChange={(e) => update({ clientName: e.target.value })}
                placeholder="Razón social o nombre del cliente"
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Marca y diseño del PDF">
            <label className="block text-luxury-muted">
              Logo
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 font-mono text-xs text-paper outline-none focus:border-luxury-gold"
                value={data.branding.logoUrl}
                onChange={(e) => patchBranding({ logoUrl: e.target.value })}
                placeholder={COMPANY_LOGO_SRC}
                disabled
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
              Valor total (COP, número sin puntos ni comas; ej. 12500000)
              <input
                type="number"
                min={0}
                step={1000}
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={Number.isFinite(data.totalAmount) ? data.totalAmount : 0}
                onChange={(e) => update({ totalAmount: Number(e.target.value) || 0 })}
                placeholder="12500000"
              />
            </label>
            <label className="block text-luxury-muted">
              Resumen del concepto (ej. &quot;10 muebles a medida&quot;, &quot;remodelación integral cocina&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.conceptSummary}
                onChange={(e) => update({ conceptSummary: e.target.value })}
                placeholder="10 muebles a medida"
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
                  Título (ej. &quot;Alcance&quot;, &quot;Materiales&quot;, &quot;Tiempos de entrega&quot;)
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
                    placeholder="Alcance del proyecto"
                  />
                </label>
                <label className="mt-2 block text-luxury-muted">
                  Detalle (una línea por ítem; ej. &quot;Cocina integral roble — 4,2 m&quot;)
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
                    placeholder={"Cocina integral en roble\nClóset principal 3 puertas\nEscritorio flotante 1,4 m"}
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
              Título de la sección final (ej. &quot;Inversión por unidad&quot;, &quot;Referencia de costo&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.closingSectionTitle}
                onChange={(e) => update({ closingSectionTitle: e.target.value })}
                placeholder="Inversión por unidad"
              />
            </label>
            <label className="block text-luxury-muted">
              Detalle (ej. condiciones comerciales, forma de pago o aclaraciones finales)
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.closingSectionBody}
                onChange={(e) => update({ closingSectionBody: e.target.value })}
                placeholder="Valores antes de impuestos. Incluye instalación en sitio."
              />
            </label>
            <label className="block text-luxury-muted">
              Costo unitario (COP, sin puntos; vacío = ocultar; ej. 850000)
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
                placeholder="850000"
              />
            </label>
            <label className="block text-luxury-muted">
              Texto tras el monto (ej. &quot;por mueble&quot;, &quot;por m²&quot;, &quot;más IVA&quot;)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.unitCostSuffix}
                onChange={(e) => update({ unitCostSuffix: e.target.value })}
                placeholder="por mueble"
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Notas y firma">
            <label className="block text-luxury-muted">
              Notas (una por línea; ej. vigencia, visita técnica, exclusiones)
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.footerNotes}
                onChange={(e) => update({ footerNotes: e.target.value })}
                placeholder={"Vigencia de la oferta: 15 días calendario\nIncluye una visita de medición previa"}
              />
            </label>
            <label className="block text-luxury-muted">
              Nombre (firma) (ej. nombre y cargo quien representa a la empresa)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerName}
                onChange={(e) => update({ signerName: e.target.value })}
                placeholder="Laura Gómez — Directora comercial"
              />
            </label>
            <label className="block text-luxury-muted">
              Teléfono (ej. +57 300 123 4567)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerPhone}
                onChange={(e) => update({ signerPhone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </label>
          </FieldGroup>
        </div>

        <AdminPdfPreviewPane
          title="Vista previa (mismo PDF)"
          document={<CotizacionPdfDocument data={data} />}
        />
      </div>
    </div>
  )
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 space-y-3 rounded-sm border border-luxury-gold/15 bg-luxury-bg/40 p-3 sm:p-4">
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
