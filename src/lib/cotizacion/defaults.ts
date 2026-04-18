import type { CotizacionBranding, CotizacionData } from '@/types/cotizacion'

function id(): string {
  return crypto.randomUUID()
}

export const defaultBranding = (): CotizacionBranding => ({
  logoUrl: '',
  accentColor: '#c5a059',
  headerBgColor: '#141414',
  paperBgColor: '#ffffff',
  textColor: '#1a1a1a',
  mutedColor: '#5a5650',
  panelBgColor: '#f5f1e8',
  tagline: 'Calidad y compromiso — dejando huella',
  documentTitle: 'COTIZACIÓN',
})

/** Valores iniciales inspirados en el PDF de ejemplo OG Publicidad. */
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
    clientName: 'OG publicidad',
    conceptSummary: '10 muebles',
    totalAmount: 9_950_000,
    descriptionBlocks: [
      {
        id: id(),
        title: 'Cuerpo central',
        body: [
          'Fabricado en MDF de 9 y 12 mm enchapado en formica blanco brillante',
          'Con ranura en parte superior y lateral izquierdo',
        ].join('\n'),
      },
      {
        id: id(),
        title: 'Glorificador',
        body: [
          '01 unidad por mueble',
          'Fabricado en MDF de 9 y 12 mm',
          'Se entrega ensamblado en crudo para revestimiento en acrílico',
        ].join('\n'),
      },
      {
        id: id(),
        title: 'Pódiums',
        body: [
          '01 unidad por mueble',
          'Fabricado en MDF de 3 y 12 mm',
          'Enchapado en formica blanca brillante',
          'Canteado en madecanto blanco brillante',
        ].join('\n'),
      },
      {
        id: id(),
        title: 'Entrepaños',
        body: [
          '03 unidades por mueble',
          'Fabricados en 15 y 12 mm',
          'Enchapados en formica blanca brillante',
        ].join('\n'),
      },
    ],
    closingSectionTitle: 'Base',
    closingSectionBody: [
      'Fabricado en MDF 12 y 9 mm enchapado en formica blanca brillante',
      'Lleva tuerca de uña para nivelador 5/16',
      '04 por mueble',
    ].join('\n'),
    unitCost: 995_000,
    unitCostSuffix: 'por mueble',
    footerNotes: [
      'Nota incluye transporte entrega en OG Publicidad',
      'No incluye acrílicos',
      'Se inicia trabajo con el 70% y el restante 30% se cancelará al entregar producción',
    ].join('\n'),
    signerName: 'MARY LUZ CORTES RIVERA',
    signerPhone: '323 201 99 74 (Nequi/Daviplata)',
    branding: defaultBranding(),
  }
}
