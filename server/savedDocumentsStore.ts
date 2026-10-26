import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { readPostgresUrls } from './postgresEnv'

export type DocumentKind = 'cotizacion' | 'recibo'

export type StoredDocument = {
  id: string
  label: string
  updatedAt: string
  data: Record<string, unknown>
}

let pooledSql: NeonQueryFunction<false, false> | null = null
let schemaReady: Promise<void> | null = null

function sql(): NeonQueryFunction<false, false> {
  if (!pooledSql) pooledSql = neon(readPostgresUrls().pooled)
  return pooledSql
}

export function ensureSavedDocumentsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const direct = neon(readPostgresUrls().direct)
      await direct`
        CREATE TABLE IF NOT EXISTS saved_documents (
          id text NOT NULL,
          kind text NOT NULL,
          label text NOT NULL,
          updated_at timestamptz NOT NULL,
          data jsonb NOT NULL,
          PRIMARY KEY (kind, id)
        )
      `
    })().catch((error: unknown) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  return new Date(String(value)).toISOString()
}

function asData(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

export async function listSavedDocuments(kind: DocumentKind): Promise<StoredDocument[]> {
  await ensureSavedDocumentsSchema()
  const rows = await sql()`
    SELECT id, label, updated_at, data
    FROM saved_documents
    WHERE kind = ${kind}
    ORDER BY updated_at DESC
  `
  return rows.map((row) => ({
    id: String(row.id),
    label: String(row.label),
    updatedAt: asIso(row.updated_at),
    data: asData(row.data),
  }))
}

export async function replaceSavedDocuments(
  kind: DocumentKind,
  items: StoredDocument[],
): Promise<void> {
  await ensureSavedDocumentsSchema()
  const query = sql()
  const inserts = items.map(
    (item) => query`
      INSERT INTO saved_documents (id, kind, label, updated_at, data)
      VALUES (
        ${item.id},
        ${kind},
        ${item.label},
        ${item.updatedAt},
        ${JSON.stringify(item.data)}::jsonb
      )
    `,
  )
  await query.transaction([
    query`DELETE FROM saved_documents WHERE kind = ${kind}`,
    ...inserts,
  ])
}
