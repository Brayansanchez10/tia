import { v2 as cloudinary } from 'cloudinary'
import { applyCloudinaryConfig } from './cloudinaryEnv'

export const UPLOAD_FOLDER = 'tia/cotizaciones'
export const MAX_FILE_BYTES = 12 * 1024 * 1024

export const CLOUDINARY_ENV_HINT =
  'Añade CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env (local) o en Netlify → Environment variables.'

export async function uploadImageBuffer(buffer: Buffer, mimetype: string): Promise<string> {
  if (!applyCloudinaryConfig()) {
    throw new Error(`Cloudinary no configurado. ${CLOUDINARY_ENV_HINT}`)
  }
  if (!mimetype.startsWith('image/')) {
    throw new Error('Solo se permiten imágenes')
  }
  if (buffer.length > MAX_FILE_BYTES) {
    throw new Error('La imagen supera el tamaño máximo (12 MB)')
  }

  const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: UPLOAD_FOLDER,
    resource_type: 'image',
  })

  const secure_url = result.secure_url?.trim()
  if (!secure_url) throw new Error('Cloudinary no devolvió la URL')
  return secure_url
}
