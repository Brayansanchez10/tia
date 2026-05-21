import type { Handler } from '@netlify/functions'
import { parse } from 'lambda-multipart-parser'
import { CLOUDINARY_ENV_HINT } from '../../server/cloudinaryUploadCore'
import { applyCloudinaryConfig } from '../../server/cloudinaryEnv'
import { handlerMethodNotAllowed, jsonHandlerResponse } from '../../server/cloudinaryHttpJson'
import { uploadImageBuffer } from '../../server/cloudinaryUploadCore'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return handlerMethodNotAllowed('POST')
  }

  if (!applyCloudinaryConfig()) {
    return jsonHandlerResponse(503, {
      error: `Cloudinary no configurado. ${CLOUDINARY_ENV_HINT}`,
    })
  }

  try {
    const parsed = await parse({
      body: event.body,
      isBase64Encoded: event.isBase64Encoded,
      headers: event.headers as Record<string, string | undefined>,
    })

    const file = parsed.files.find((f) => f.fieldname === 'file') ?? parsed.files[0]
    if (!file?.content?.length) {
      return jsonHandlerResponse(400, { error: 'Falta el archivo (campo "file")' })
    }

    const secure_url = await uploadImageBuffer(
      Buffer.from(file.content),
      file.contentType || 'application/octet-stream',
    )
    return jsonHandlerResponse(200, { secure_url })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al subir'
    const status = message.includes('no configurado') ? 503 : 500
    return jsonHandlerResponse(status, { error: message })
  }
}
