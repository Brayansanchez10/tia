import { v2 as cloudinary } from 'cloudinary'

export function readCloudinaryEnv(
  source: Record<string, string | undefined> = process.env,
): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const cloudName = source.CLOUDINARY_CLOUD_NAME?.trim() ?? ''
  const apiKey = source.CLOUDINARY_API_KEY?.trim() ?? ''
  const apiSecret = source.CLOUDINARY_API_SECRET?.trim() ?? ''
  if (!cloudName || !apiKey || !apiSecret) return null
  return { cloudName, apiKey, apiSecret }
}

export function applyCloudinaryConfig(
  source: Record<string, string | undefined> = process.env,
): boolean {
  const creds = readCloudinaryEnv(source)
  if (!creds) return false
  cloudinary.config({
    cloud_name: creds.cloudName,
    api_key: creds.apiKey,
    api_secret: creds.apiSecret,
    secure: true,
  })
  return true
}
