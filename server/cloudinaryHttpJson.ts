import type { IncomingMessage, ServerResponse } from 'node:http'

export function jsonResponse(
  res: ServerResponse,
  status: number,
  body: unknown,
): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export function jsonHandlerResponse(
  statusCode: number,
  body: unknown,
): { statusCode: number; headers: Record<string, string>; body: string } {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }
}

export function methodNotAllowed(
  res: ServerResponse,
  allowed: string,
): void {
  jsonResponse(res, 405, { error: `Método no permitido. Usa ${allowed}.` })
}

export function handlerMethodNotAllowed(allowed: string) {
  return jsonHandlerResponse(405, { error: `Método no permitido. Usa ${allowed}.` })
}

export function isPost(req: IncomingMessage): boolean {
  return req.method === 'POST'
}
