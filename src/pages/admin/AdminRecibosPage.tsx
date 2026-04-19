import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AdminPdfPreviewPane } from '@/components/admin/AdminPdfPreviewPane'
import { ReciboPdfDocument } from '@/components/admin/ReciboPdfDocument'
import { COMPANY_LOGO_SRC } from '@/lib/branding'
import { defaultReciboBranding } from '@/lib/recibo/defaults'
import { formatCOP } from '@/lib/cotizacion/format'
import { createDefaultRecibo } from '@/lib/recibo/defaults'
import { downloadReciboPdf } from '@/lib/recibo/downloadReciboPdf'
import { computeReciboTotals } from '@/lib/recibo/reciboTotals'
import type { CotizacionBranding } from '@/types/cotizacion'
import type { ReciboData, ReciboLine } from '@/types/recibo'

function newLineId(): string {
  return crypto.randomUUID()
}

export function AdminRecibosPage() {
  const [data, setData] = useState<ReciboData>(() => createDefaultRecibo())
  const [exporting, setExporting] = useState(false)

  const totals = useMemo(() => computeReciboTotals(data), [data])

  const update = useCallback((patch: Partial<ReciboData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const patchBranding = useCallback((patch: Partial<CotizacionBranding>) => {
    setData((d) => ({ ...d, branding: { ...d.branding, ...patch } }))
  }, [])

  const downloadPdf = useCallback(async () => {
    setExporting(true)
    try {
      const safe =
        (data.receiptNumber || data.toAddress || 'recibo')
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .slice(0, 40) || 'recibo'
      await downloadReciboPdf(data, `RECIBO-${safe}.pdf`)
    } finally {
      setExporting(false)
    }
  }, [data])

  return (
    <div className="mx-auto min-w-0 max-w-[72rem] px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-4 border-b border-luxury-gold/20 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-serif)] text-xl text-paper sm:text-2xl lg:text-3xl">Recibos</h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-luxury-muted sm:mt-1">
            <strong className="font-medium text-paper/90">Marca y colores</strong> iguales que en cotizaciones. Tabla
            descripción + importe; total:{' '}
            <span className="tabular-nums text-luxury-gold">{formatCOP(totals.total)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setData(createDefaultRecibo())}
            className="min-h-11 w-full rounded-sm border border-luxury-gold/35 px-4 py-2.5 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper sm:w-auto sm:py-2"
          >
            Restaurar plantilla
          </button>
          <button
            type="button"
            onClick={() => patchBranding(defaultReciboBranding())}
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
          <FieldGroup title="Documento">
            <label className="block text-luxury-muted">
              N.º de recibo
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.receiptNumber}
                onChange={(e) => update({ receiptNumber: e.target.value })}
                placeholder="Ej. 1993"
              />
            </label>
            <label className="block text-luxury-muted">
              Fecha (texto en la barra oscura)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.dateDisplay}
                onChange={(e) => update({ dateDisplay: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Marca y diseño del PDF">
            <p className="text-xs text-luxury-muted">
              Igual que en cotizaciones: logo en <code className="text-luxury-gold/90">public/img/</code> como{' '}
              <code className="text-luxury-gold/90">/img/…</code> o URL https. Los colores se aplican al recibo en vivo.
            </p>
            <label className="block text-luxury-muted">
              Logo (ruta o URL)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 font-mono text-xs text-paper outline-none focus:border-luxury-gold"
                value={data.branding.logoUrl}
                onChange={(e) => patchBranding({ logoUrl: e.target.value })}
                placeholder={COMPANY_LOGO_SRC}
              />
            </label>
            <label className="block text-luxury-muted">
              Título del documento (metadatos PDF / referencia interna)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.branding.documentTitle}
                onChange={(e) => patchBranding({ documentTitle: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Línea de marca (opcional, bajo el n.º de recibo en la franja oscura)
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
              label="Fondo de cajas (cabecera tabla, pie)"
              value={data.branding.panelBgColor}
              onChange={(v) => patchBranding({ panelBgColor: v })}
            />
          </FieldGroup>

          <FieldGroup title="De / A">
            <label className="block text-luxury-muted">
              De (emisor, una línea por renglón)
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.fromAddress}
                onChange={(e) => update({ fromAddress: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              A (cliente, una línea por renglón)
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.toAddress}
                onChange={(e) => update({ toAddress: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Conceptos (descripción + importe)">
            {data.lines.map((line, index) => (
              <div
                key={line.id}
                className="rounded-sm border border-luxury-gold/20 bg-luxury-panel/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-luxury-gold">Línea {index + 1}</span>
                  <button
                    type="button"
                    className="text-xs text-red-300/90 hover:text-red-200"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        lines: d.lines.length > 1 ? d.lines.filter((l) => l.id !== line.id) : d.lines,
                      }))
                    }
                  >
                    Quitar
                  </button>
                </div>
                <label className="mt-2 block text-luxury-muted">
                  Descripción
                  <input
                    className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-bg px-2 py-1.5 text-sm text-paper outline-none focus:border-luxury-gold"
                    value={line.description}
                    onChange={(e) => {
                      const description = e.target.value
                      setData((d) => ({
                        ...d,
                        lines: d.lines.map((l) => (l.id === line.id ? { ...l, description } : l)),
                      }))
                    }}
                  />
                </label>
                <label className="mt-2 block text-luxury-muted">
                  Importe (COP)
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-bg px-2 py-1.5 text-sm text-paper outline-none focus:border-luxury-gold"
                    value={Number.isFinite(line.amount) ? line.amount : 0}
                    onChange={(e) => {
                      const amount = Number(e.target.value) || 0
                      setData((d) => ({
                        ...d,
                        lines: d.lines.map((l) => (l.id === line.id ? { ...l, amount } : l)),
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
                  lines: [...d.lines, { id: newLineId(), description: '', amount: 0 } satisfies ReciboLine],
                }))
              }
            >
              + Añadir línea
            </button>
          </FieldGroup>

          <FieldGroup title="Impuestos">
            <label className="block text-luxury-muted">
              Porcentaje (0 = ocultar línea de impuestos en el PDF)
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.taxRatePercent}
                onChange={(e) => update({ taxRatePercent: Number(e.target.value) || 0 })}
              />
            </label>
            <p className="text-xs text-luxury-muted">
              Subtotal: <span className="tabular-nums text-paper/90">{formatCOP(totals.subtotal)}</span>
              {data.taxRatePercent > 0 ? (
                <>
                  {' '}
                  · IVA: <span className="tabular-nums text-paper/90">{formatCOP(totals.tax)}</span>
                </>
              ) : null}
            </p>
          </FieldGroup>

          <FieldGroup title="Pie del recibo">
            <label className="block text-luxury-muted">
              Título (banda inferior, color «cajas»)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.footerTermsTitle}
                onChange={(e) => update({ footerTermsTitle: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Texto (una o varias líneas)
              <textarea
                rows={3}
                className="mt-1 w-full resize-y rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.footerTermsBody}
                onChange={(e) => update({ footerTermsBody: e.target.value })}
              />
            </label>
          </FieldGroup>

          <FieldGroup title="Firma">
            <label className="block text-luxury-muted">
              Nombre (aparece bajo la línea de firma)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerName}
                onChange={(e) => update({ signerName: e.target.value })}
              />
            </label>
            <label className="block text-luxury-muted">
              Teléfono (como en cotización)
              <input
                className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
                value={data.signerPhone}
                onChange={(e) => update({ signerPhone: e.target.value })}
              />
            </label>
          </FieldGroup>
        </div>

        <AdminPdfPreviewPane
          title="Vista previa (mismo PDF)"
          document={<ReciboPdfDocument data={data} />}
        />
      </div>
    </div>
  )
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 space-y-3 rounded-sm border border-luxury-gold/15 bg-luxury-bg/40 p-3 sm:p-4">
      <legend className="px-1 text-xs font-medium tracking-wide text-luxury-gold uppercase">{title}</legend>
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
