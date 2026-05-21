import { COMPANY_LOGO_SRC } from '@/lib/branding'
import type { CotizacionBranding, CotizacionData } from '@/types/cotizacion'

export const defaultBranding = (): CotizacionBranding => ({
  logoUrl: COMPANY_LOGO_SRC,
  accentColor: '#c5a059',
  headerBgColor: '#141414',
  paperBgColor: '#ffffff',
  textColor: '#1a1a1a',
  mutedColor: '#5a5650',
  panelBgColor: '#f5f1e8',
  tagline: 'Calidad y compromiso — dejando huella',
  documentTitle: 'COTIZACIÓN',
})

/**
 * Plantilla inicial: datos de empresa y contacto listos para usar;
 * totales, descripción por bloques y notas quedan vacíos para rellenar en cada caso.
 */
export function createDefaultCotizacion(): CotizacionData {
  return {
    city: 'Bogotá',
    dateLabel: new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
    issuerName: 'CS MARKETING POP DEJADO HUELLA',
    issuerNit: '52743809-9',
    clientName: 'Nombre del cliente',
    conceptSummary: '',
    totalAmount: 0,
    descriptionBlocks: [],
    closingSectionTitle: '',
    closingSectionBody: '',
    unitCost: null,
    unitCostHeading: '',
    unitCostSuffix: '',
    footerNotes: 'CS MARKETING no es responsable de iva segun Art 43 del Estado tributario, por tanto no se genera iva en esta operación. El valor cotizado corresponde al precio ante retencion de ley, el valor neto a Recibir por CS MARKETING estará sujeto a los descuentos y retención en la fuente y retención de iva que practique el pagador con forme a la norma tributaria vigente.',
    signerName: 'MARY LUZ CORTES RIVERA',
    signerTitle: 'Gerente general',
    signerPhone: '323 201 99 74',
    referenceImages: [],
    referenceSectionTitle: '',
    branding: defaultBranding(),
  }
}
