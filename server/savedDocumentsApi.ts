import { timingSafeEqual } from 'node:crypto'
import { readAdminPassword } from './postgresEnv'
import {
  replaceSavedDocuments,
  listSavedDocuments,
  type DocumentKind,
  type StoredDocument,
} from './savedDocumentsStore'

export function isDocumentKind(value: string | null): value is DocumentKind {
  return value === 'cotizacion' || value === 'recibo'
}

function publicErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Error de base de datos'
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, '[redacted]')
}

function passwordsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function parseStoredDocuments(body: unknown): StoredDocument[] | null {
  if (!Array.isArray(body)) return null
  const items: StoredDocument[] = []
  for (const entry of body) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null
    const record = entry as Record<string, unknown>
    const id = record.id
    const label = record.label
    const updatedAt = record.updatedAt
    const data = record.data
    if (typeof id !== 'string' || !id) return null
    if (typeof label !== 'string') return null
    if (typeof updatedAt !== 'string' || !updatedAt) return null
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    items.push({ id, label, updatedAt, data: data as Record<string, unknown> })
  }
  return items
}

export async function handleSavedDocuments(input: {
  method: string
  kind: string | null
  adminPassword: string | undefined
  body?: string
}): Promise<{ status: number; body: unknown }> {
  const expected = readAdminPassword()
  if (!expected) {
    return { status: 503, body: { error: 'Falta VITE_ADMIN_PASSWORD en el servidor.' } }
  }
  if (!input.adminPassword || !passwordsMatch(input.adminPassword, expected)) {
    return { status: 401, body: { error: 'No autorizado.' } }
  }
  if (!isDocumentKind(input.kind)) {
    return { status: 400, body: { error: 'kind debe ser cotizacion o recibo.' } }
  }

  try {
    if (input.method === 'GET') {
      const items = await listSavedDocuments(input.kind)
      return { status: 200, body: { items } }
    }
    if (input.method === 'PUT') {
      let parsed: unknown
      try {
        parsed = JSON.parse(input.body ?? '')
      } catch {
        return { status: 400, body: { error: 'JSON inválido.' } }
      }
      const items = parseStoredDocuments(parsed)
      if (!items) return { status: 400, body: { error: 'Se esperaba una lista de documentos.' } }
      await replaceSavedDocuments(input.kind, items)
      return { status: 200, body: { ok: true, count: items.length } }
    }
    return { status: 405, body: { error: 'Método no permitido. Usa GET o PUT.' } }
  } catch (error) {
    return { status: 500, body: { error: publicErrorMessage(error) } }
  }
}
