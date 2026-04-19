import type { ReciboData } from '@/types/recibo'

export type ReciboTotals = {
  subtotal: number
  tax: number
  total: number
}

/** Subtotal = suma de líneas; impuesto sobre subtotal (COP enteros). */
export function computeReciboTotals(data: ReciboData): ReciboTotals {
  const subtotal = data.lines.reduce((sum, line) => {
    const n = line.amount
    return sum + (Number.isFinite(n) ? Math.round(n) : 0)
  }, 0)
  const rate = Number.isFinite(data.taxRatePercent) ? Math.max(0, data.taxRatePercent) : 0
  const tax = rate > 0 ? Math.round((subtotal * rate) / 100) : 0
  const total = subtotal + tax
  return { subtotal, tax, total }
}
