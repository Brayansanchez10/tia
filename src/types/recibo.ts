import type { CotizacionBranding } from '@/types/cotizacion'

/** Línea de concepto con importe (recibo). */
export type ReciboLine = {
  id: string
  description: string
  /** Monto en COP (entero). */
  amount: number
}

/** Datos del recibo (plantilla alineada al flujo de cotización, distinta solo en tabla e impuestos). */
export type ReciboData = {
  /** Número visible bajo «RECIBO». */
  receiptNumber: string
  /** Misma paleta y logo que la cotización (`logoUrl`, colores, etc.). */
  branding: CotizacionBranding
  /** Texto multilínea emisor (columna «De»). */
  fromAddress: string
  /** Texto multilínea cliente (columna «A»). */
  toAddress: string
  /** Fecha en barra superior (texto libre, ej. DD/MM/AAAA). */
  dateDisplay: string
  lines: ReciboLine[]
  /** Porcentaje de impuesto (0 = no se muestra línea de impuestos). */
  taxRatePercent: number
  footerTermsTitle: string
  footerTermsBody: string
  signerName: string
  signerPhone: string
}
