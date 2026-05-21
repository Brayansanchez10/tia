const UPLOAD_URL = '/api/cloudinary/upload'

type UploadOk = { secure_url: string }
type UploadErr = { error?: string }

/**
 * Sube la imagen al servidor de desarrollo/preview; allí se usa CLOUDINARY_API_SECRET.
 * Las variables deben estar en `.env` sin prefijo VITE_.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch(UPLOAD_URL, { method: 'POST', body })
  const json = (await res.json()) as UploadOk & UploadErr

  if (!res.ok) {
    throw new Error(
      json.error ??
        (res.status === 503
          ? 'Cloudinary no configurado en el servidor (revisa .env y reinicia npm run dev)'
          : `Error al subir (${res.status})`),
    )
  }

  const url = json.secure_url?.trim()
  if (!url) throw new Error('El servidor no devolvió la URL de la imagen')
  return url
}
