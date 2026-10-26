import { adminRequestPassword } from '@/lib/admin/adminPassword'

const SIGN_URL = '/api/cloudinary/sign'
const MAX_IMAGE_BYTES = 15 * 1024 * 1024
const MAX_VIDEO_BYTES = 100 * 1024 * 1024

type Ticket = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

type CloudinaryError = { error?: { message?: string } | string }

export async function uploadPortfolioMedia(file: File): Promise<string> {
  const video = file.type.startsWith('video/')
  const image = file.type.startsWith('image/')
  if (!video && !image) throw new Error('Solo se permiten imágenes o videos.')
  const limit = video ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
  if (file.size > limit) {
    throw new Error(video ? 'El video supera 100 MB.' : 'La imagen supera 15 MB.')
  }

  const headers = new Headers({ 'x-admin-password': adminRequestPassword() })
  const signed = await fetch(SIGN_URL, { method: 'POST', headers })
  const ticket = (await signed.json().catch(() => null)) as (Ticket & { error?: string }) | null
  if (!signed.ok || !ticket?.signature || !ticket.cloudName) {
    throw new Error(ticket?.error || 'No se pudo autorizar la subida.')
  }

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', ticket.apiKey)
  body.append('timestamp', String(ticket.timestamp))
  body.append('signature', ticket.signature)
  body.append('folder', ticket.folder)

  const resource = video ? 'video' : 'image'
  const uploaded = await fetch(
    `https://api.cloudinary.com/v1_1/${ticket.cloudName}/${resource}/upload`,
    { method: 'POST', body },
  )
  const json = (await uploaded.json().catch(() => null)) as (CloudinaryError & { secure_url?: string }) | null
  if (!uploaded.ok || !json?.secure_url) {
    const detail = json?.error
    const message = typeof detail === 'string' ? detail : detail?.message
    throw new Error(message || 'Cloudinary no devolvió la URL.')
  }
  return json.secure_url
}
