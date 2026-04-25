import { createDefaultCotizacion } from '@/lib/cotizacion/defaults'
import { createDefaultRecibo } from '@/lib/recibo/defaults'
import type { CotizacionBranding, CotizacionData, CotizacionDescriptionBlock } from '@/types/cotizacion'
import type { ReciboData, ReciboLine } from '@/types/recibo'

const LEGACY_COTIZACION_KEY = 'tia-admin-cotizacion-draft'
const LEGACY_RECIBO_KEY = 'tia-admin-recibo-draft'
const LIB_COTIZACION_KEY = 'tia-admin-cotizaciones-saved'
const LIB_RECIBO_KEY = 'tia-admin-recibos-saved'

export type SavedCotizacionEntry = {
  id: string
  label: string
  updatedAt: string
  data: CotizacionData
}

export type SavedReciboEntry = {
  id: string
  label: string
  updatedAt: string
  data: ReciboData
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function reviveBranding(raw: unknown, base: CotizacionBranding): CotizacionBranding {
  if (!isRecord(raw)) return base
  const next: CotizacionBranding = { ...base }
  for (const k of Object.keys(base) as (keyof CotizacionBranding)[]) {
    const v = raw[k as string]
    if (typeof v === 'string') (next as Record<string, string>)[k] = v
  }
  return next
}

function reviveDescriptionBlocks(raw: unknown): CotizacionDescriptionBlock[] | null {
  if (!Array.isArray(raw)) return null
  const out: CotizacionDescriptionBlock[] = []
  for (const item of raw) {
    if (!isRecord(item)) continue
    out.push({
      id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
      title: typeof item.title === 'string' ? item.title : '',
      body: typeof item.body === 'string' ? item.body : '',
    })
  }
  return out
}

function reviveCotizacion(raw: unknown): CotizacionData | null {
  if (!isRecord(raw)) return null
  const base = createDefaultCotizacion()
  const blocks = reviveDescriptionBlocks(raw.descriptionBlocks)
  const unitRaw = raw.unitCost
  const unitCost =
    unitRaw === null || unitRaw === undefined
      ? null
      : typeof unitRaw === 'number' && Number.isFinite(unitRaw)
        ? unitRaw
        : base.unitCost

  return {
    city: typeof raw.city === 'string' ? raw.city : base.city,
    dateLabel: typeof raw.dateLabel === 'string' ? raw.dateLabel : base.dateLabel,
    issuerName: typeof raw.issuerName === 'string' ? raw.issuerName : base.issuerName,
    issuerNit: typeof raw.issuerNit === 'string' ? raw.issuerNit : base.issuerNit,
    clientName: typeof raw.clientName === 'string' ? raw.clientName : base.clientName,
    conceptSummary: typeof raw.conceptSummary === 'string' ? raw.conceptSummary : base.conceptSummary,
    totalAmount:
      typeof raw.totalAmount === 'number' && Number.isFinite(raw.totalAmount) ? raw.totalAmount : base.totalAmount,
    descriptionBlocks: blocks ?? base.descriptionBlocks,
    closingSectionTitle:
      typeof raw.closingSectionTitle === 'string' ? raw.closingSectionTitle : base.closingSectionTitle,
    closingSectionBody:
      typeof raw.closingSectionBody === 'string' ? raw.closingSectionBody : base.closingSectionBody,
    unitCost,
    unitCostHeading:
      typeof raw.unitCostHeading === 'string' ? raw.unitCostHeading : base.unitCostHeading,
    unitCostSuffix: typeof raw.unitCostSuffix === 'string' ? raw.unitCostSuffix : base.unitCostSuffix,
    footerNotes: typeof raw.footerNotes === 'string' ? raw.footerNotes : base.footerNotes,
    signerName: typeof raw.signerName === 'string' ? raw.signerName : base.signerName,
    signerPhone: typeof raw.signerPhone === 'string' ? raw.signerPhone : base.signerPhone,
    branding: reviveBranding(raw.branding, base.branding),
  }
}

function reviveReciboLines(raw: unknown): ReciboLine[] | null {
  if (!Array.isArray(raw)) return null
  const out: ReciboLine[] = []
  for (const item of raw) {
    if (!isRecord(item)) continue
    const amount = item.amount
    out.push({
      id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
      description: typeof item.description === 'string' ? item.description : '',
      amount: typeof amount === 'number' && Number.isFinite(amount) ? amount : 0,
    })
  }
  return out.length ? out : null
}

function reviveRecibo(raw: unknown): ReciboData | null {
  if (!isRecord(raw)) return null
  const base = createDefaultRecibo()
  const lines = reviveReciboLines(raw.lines)
  const tax = raw.taxRatePercent
  const taxRatePercent =
    typeof tax === 'number' && Number.isFinite(tax) ? Math.min(100, Math.max(0, tax)) : base.taxRatePercent

  return {
    receiptNumber: typeof raw.receiptNumber === 'string' ? raw.receiptNumber : base.receiptNumber,
    branding: reviveBranding(raw.branding, base.branding),
    fromAddress: typeof raw.fromAddress === 'string' ? raw.fromAddress : base.fromAddress,
    toAddress: typeof raw.toAddress === 'string' ? raw.toAddress : base.toAddress,
    dateDisplay: typeof raw.dateDisplay === 'string' ? raw.dateDisplay : base.dateDisplay,
    lines: lines ?? base.lines,
    taxRatePercent,
    footerTermsTitle:
      typeof raw.footerTermsTitle === 'string' ? raw.footerTermsTitle : base.footerTermsTitle,
    footerTermsBody:
      typeof raw.footerTermsBody === 'string' ? raw.footerTermsBody : base.footerTermsBody,
    signerName: typeof raw.signerName === 'string' ? raw.signerName : base.signerName,
    signerPhone: typeof raw.signerPhone === 'string' ? raw.signerPhone : base.signerPhone,
  }
}

function reviveSavedCotizacionEntry(raw: unknown): SavedCotizacionEntry | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  const label = typeof raw.label === 'string' ? raw.label : null
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null
  const data = reviveCotizacion(raw.data)
  if (!id || !label || !updatedAt || !data) return null
  return { id, label, updatedAt, data }
}

function reviveSavedReciboEntry(raw: unknown): SavedReciboEntry | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  const label = typeof raw.label === 'string' ? raw.label : null
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null
  const data = reviveRecibo(raw.data)
  if (!id || !label || !updatedAt || !data) return null
  return { id, label, updatedAt, data }
}

function parseCotizacionList(json: unknown): SavedCotizacionEntry[] {
  if (!Array.isArray(json)) return []
  return json.map(reviveSavedCotizacionEntry).filter((x): x is SavedCotizacionEntry => x !== null)
}

function parseReciboList(json: unknown): SavedReciboEntry[] {
  if (!Array.isArray(json)) return []
  return json.map(reviveSavedReciboEntry).filter((x): x is SavedReciboEntry => x !== null)
}

function readLegacyCotizacionDraft(): CotizacionData | null {
  if (typeof window === 'undefined') return null
  try {
    const s = localStorage.getItem(LEGACY_COTIZACION_KEY)
    if (!s) return null
    return reviveCotizacion(JSON.parse(s) as unknown)
  } catch {
    return null
  }
}

function readLegacyReciboDraft(): ReciboData | null {
  if (typeof window === 'undefined') return null
  try {
    const s = localStorage.getItem(LEGACY_RECIBO_KEY)
    if (!s) return null
    return reviveRecibo(JSON.parse(s) as unknown)
  } catch {
    return null
  }
}

export function readSavedCotizacionesLibrary(): SavedCotizacionEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const s = localStorage.getItem(LIB_COTIZACION_KEY)
    if (s) {
      const list = parseCotizacionList(JSON.parse(s) as unknown)
      if (list.length) return list
    }
    const legacy = readLegacyCotizacionDraft()
    if (legacy) {
      const migrated: SavedCotizacionEntry[] = [
        {
          id: crypto.randomUUID(),
          label: 'Importado (borrador anterior)',
          updatedAt: new Date().toISOString(),
          data: legacy,
        },
      ]
      localStorage.setItem(LIB_COTIZACION_KEY, JSON.stringify(migrated))
      localStorage.removeItem(LEGACY_COTIZACION_KEY)
      return migrated
    }
  } catch {
    /* ignore */
  }
  return []
}

export function writeSavedCotizacionesLibrary(items: SavedCotizacionEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LIB_COTIZACION_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

export function readSavedRecibosLibrary(): SavedReciboEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const s = localStorage.getItem(LIB_RECIBO_KEY)
    if (s) {
      const list = parseReciboList(JSON.parse(s) as unknown)
      if (list.length) return list
    }
    const legacy = readLegacyReciboDraft()
    if (legacy) {
      const migrated: SavedReciboEntry[] = [
        {
          id: crypto.randomUUID(),
          label: 'Importado (borrador anterior)',
          updatedAt: new Date().toISOString(),
          data: legacy,
        },
      ]
      localStorage.setItem(LIB_RECIBO_KEY, JSON.stringify(migrated))
      localStorage.removeItem(LEGACY_RECIBO_KEY)
      return migrated
    }
  } catch {
    /* ignore */
  }
  return []
}

export function writeSavedRecibosLibrary(items: SavedReciboEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LIB_RECIBO_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

/** Copia profunda para no mutar entradas guardadas al editar en el formulario. */
export function cloneCotizacionData(data: CotizacionData): CotizacionData {
  return structuredClone(data)
}

export function cloneReciboData(data: ReciboData): ReciboData {
  return structuredClone(data)
}
