/** Datos editables de una cotización (plantilla tipo documento comercial). */

export type CotizacionDescriptionBlock = {
  id: string
  title: string
  /** Párrafos o líneas; se muestran separadas en el PDF. */
  body: string
}

/** Apariencia del PDF: logo y paleta de la empresa. */
export type CotizacionBranding = {
  /** Ruta bajo `public/` (ej. `/img/logo.png`) o URL `https://…`. Vacío = sin logo. */
  logoUrl: string
  /** Color de acento (líneas, títulos, barra). Ej. `#c5a059` */
  accentColor: string
  /** Franja superior del encabezado */
  headerBgColor: string
  /** Fondo de la hoja */
  paperBgColor: string
  /** Texto principal */
  textColor: string
  /** Texto secundario / notas */
  mutedColor: string
  /** Cajas de valor y bloques suaves */
  panelBgColor: string
  /** Subtítulo bajo el nombre comercial (opcional) */
  tagline: string
  /** Título grande del documento */
  documentTitle: string
}

export type CotizacionData = {
  city: string
  dateLabel: string
  issuerName: string
  issuerNit: string
  clientName: string
  conceptSummary: string
  totalAmount: number
  descriptionBlocks: CotizacionDescriptionBlock[]
  closingSectionTitle: string
  closingSectionBody: string
  /** Si es null, no se muestra el recuadro de costo unitario en el PDF. */
  unitCost: number | null
  /** Título visible encima del monto unitario en el PDF (ej. «Precio unitario»). Vacío = «Costo unitario». */
  unitCostHeading: string
  unitCostSuffix: string
  /** Notas finales (transporte, exclusiones, forma de pago…), una por línea en el textarea. */
  footerNotes: string
  signerName: string
  signerPhone: string
  branding: CotizacionBranding
}
