import { pdf } from '@react-pdf/renderer'
import { ReciboPdfDocument } from '@/components/admin/ReciboPdfDocument'
import type { ReciboData } from '@/types/recibo'

export async function downloadReciboPdf(data: ReciboData, filename: string): Promise<void> {
  const blob = await pdf(<ReciboPdfDocument data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
