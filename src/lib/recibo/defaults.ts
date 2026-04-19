import { defaultBranding } from '@/lib/cotizacion/defaults'
import type { CotizacionBranding } from '@/types/cotizacion'
import type { ReciboData } from '@/types/recibo'

/** Colores/logo iguales a cotización; título interno acorde al recibo. */
export function defaultReciboBranding(): CotizacionBranding {
  return { ...defaultBranding(), documentTitle: 'RECIBO' }
}

function id(): string {
  return crypto.randomUUID()
}

export function createDefaultRecibo(): ReciboData {
  const dateDisplay = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())

  return {
    receiptNumber: '',
    branding: defaultReciboBranding(),
    fromAddress: 'CS MARKETING POP DEJANDO HUELLA\nBogotá, Colombia',
    toAddress: '',
    dateDisplay,
    lines: [{ id: id(), description: '', amount: 0 }],
    taxRatePercent: 0,
    footerTermsTitle: 'Condiciones y forma de pago',
    footerTermsBody: 'El pago debe realizarse en un plazo de 15 días hábiles.',
    signerName: 'MARY LUZ CORTES RIVERA',
    signerPhone: '323 201 99 74 (Nequi/Daviplata)',
  }
}
