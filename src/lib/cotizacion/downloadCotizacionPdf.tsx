import { pdf } from '@react-pdf/renderer'
import { CotizacionPdfDocument } from '@/components/admin/CotizacionPdfDocument'
import type { CotizacionData } from '@/types/cotizacion'

export async function downloadCotizacionPdf(data: CotizacionData, filename: string): Promise<void> {
  const blob = await pdf(<CotizacionPdfDocument data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
