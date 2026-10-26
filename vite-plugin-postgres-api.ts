import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import { publicErrorMessage } from './server/adminGate'
import { handleProjects } from './server/portfolioApi'
import { handleSavedDocuments } from './server/savedDocumentsApi'

const DOCUMENTS_PATH = '/api/documents'
const PROJECTS_PATH = '/api/projects'
const ENV_KEYS = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',
  'NEON_BRANCH',
  'VITE_ADMIN_PASSWORD',
] as const

function patchProcessEnv(env: Record<string, string>): void {
  for (const key of ENV_KEYS) {
    const value = env[key]
    if (value) process.env[key] = value
  }
}

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name]
  if (Array.isArray(value)) return value[0]
  return value
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function attachPostgresApi(middlewares: Connect.Server): void {
  middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path !== DOCUMENTS_PATH && path !== PROJECTS_PATH) {
      next()
      return
    }
    void (async () => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const method = req.method ?? 'GET'
      const needsBody = method === 'PUT' || method === 'POST'
      const body = needsBody ? await readBody(req) : undefined
      const adminPassword = header(req, 'x-admin-password')
      const result =
        path === PROJECTS_PATH
          ? await handleProjects({
              method,
              manage: url.searchParams.get('manage') === '1',
              id: url.searchParams.get('id'),
              action: url.searchParams.get('action'),
              adminPassword,
              body,
            })
          : await handleSavedDocuments({
              method,
              kind: url.searchParams.get('kind'),
              adminPassword,
              body,
            })
      sendJson(res, result.status, result.body)
    })().catch((error: unknown) => {
      sendJson(res, 500, { error: publicErrorMessage(error) })
    })
  })
}

/** API local de documentos en Neon. DATABASE_URL no entra al bundle del navegador. */
export function postgresApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'postgres-api',
    configureServer(server) {
      patchProcessEnv(env)
      attachPostgresApi(server.middlewares)
    },
    configurePreviewServer(server) {
      patchProcessEnv(env)
      attachPostgresApi(server.middlewares)
    },
  }
}
