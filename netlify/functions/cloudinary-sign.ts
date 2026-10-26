import type { Handler } from '@netlify/functions'
import { adminAuthorized } from '../../server/adminGate'
import { CLOUDINARY_ENV_HINT } from '../../server/cloudinaryUploadCore'
import { jsonHandlerResponse, handlerMethodNotAllowed } from '../../server/cloudinaryHttpJson'
import { signPortfolioUpload } from '../../server/cloudinarySign'

function header(
  headers: Record<string, string | undefined> | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined
  const want = name.toLowerCase()
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === want && value) return value
  }
  return undefined
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return handlerMethodNotAllowed('POST')
  const gate = adminAuthorized(header(event.headers, 'x-admin-password'))
  if (!gate.ok) return jsonHandlerResponse(gate.status, { error: gate.error })
  const ticket = signPortfolioUpload()
  if (!ticket) {
    return jsonHandlerResponse(503, { error: `Cloudinary no configurado. ${CLOUDINARY_ENV_HINT}` })
  }
  return jsonHandlerResponse(200, ticket)
}
