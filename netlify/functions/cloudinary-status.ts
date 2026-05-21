import type { Handler } from '@netlify/functions'
import { applyCloudinaryConfig } from '../../server/cloudinaryEnv'
import { handlerMethodNotAllowed, jsonHandlerResponse } from '../../server/cloudinaryHttpJson'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return handlerMethodNotAllowed('GET')
  }
  return jsonHandlerResponse(200, { configured: applyCloudinaryConfig() })
}
