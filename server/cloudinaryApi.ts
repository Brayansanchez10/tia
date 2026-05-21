import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import formidable from 'formidable'
import { applyCloudinaryConfig } from './cloudinaryEnv'
import { CLOUDINARY_ENV_HINT, MAX_FILE_BYTES, uploadImageBuffer } from './cloudinaryUploadCore'
import { isPost, jsonResponse, methodNotAllowed } from './cloudinaryHttpJson'

export function handleCloudinaryStatus(
  _req: IncomingMessage,
  res: ServerResponse,
): void {
  jsonResponse(res, 200, { configured: applyCloudinaryConfig() })
}

export async function handleCloudinaryUpload(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (!isPost(req)) {
    methodNotAllowed(res, 'POST')
    return
  }

  if (!applyCloudinaryConfig()) {
    jsonResponse(res, 503, { error: `Cloudinary no configurado. ${CLOUDINARY_ENV_HINT}` })
    return
  }

  const form = formidable({
    maxFileSize: MAX_FILE_BYTES,
    maxFiles: 1,
    allowEmptyFiles: false,
  })

  let filepath: string | undefined
  try {
    const [, files] = await form.parse(req)
    const file = files.file?.[0]
    if (!file?.filepath) {
      jsonResponse(res, 400, { error: 'Falta el archivo (campo "file")' })
      return
    }

    filepath = file.filepath
    const buffer = await fs.readFile(filepath)
    const mimetype = file.mimetype ?? 'application/octet-stream'
    const secure_url = await uploadImageBuffer(buffer, mimetype)
    jsonResponse(res, 200, { secure_url })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al subir'
    const status = message.includes('no configurado') ? 503 : 500
    jsonResponse(res, status, { error: message })
  } finally {
    if (filepath) {
      await fs.unlink(filepath).catch(() => undefined)
    }
  }
}
