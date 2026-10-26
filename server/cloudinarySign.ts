import { v2 as cloudinary } from 'cloudinary'
import { readCloudinaryEnv } from './cloudinaryEnv'

export const PORTFOLIO_UPLOAD_FOLDER = 'tia/proyectos'

export type CloudinaryUploadTicket = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

/** Firma una subida directa del navegador a Cloudinary. El secreto no sale del servidor. */
export function signPortfolioUpload(): CloudinaryUploadTicket | null {
  const creds = readCloudinaryEnv()
  if (!creds) return null
  const timestamp = Math.round(Date.now() / 1000)
  const folder = PORTFOLIO_UPLOAD_FOLDER
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, creds.apiSecret)
  return {
    cloudName: creds.cloudName,
    apiKey: creds.apiKey,
    timestamp,
    signature,
    folder,
  }
}
