import type { Handler } from '@netlify/functions'
import { handleProjects } from '../../server/portfolioApi'

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
  const rawBody =
    event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : (event.body ?? undefined)
  const result = await handleProjects({
    method: event.httpMethod,
    manage: event.queryStringParameters?.manage === '1',
    id: event.queryStringParameters?.id ?? null,
    action: event.queryStringParameters?.action ?? null,
    adminPassword: header(event.headers, 'x-admin-password'),
    body: rawBody,
  })
  return {
    statusCode: result.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(result.body),
  }
}
