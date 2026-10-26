import { randomUUID } from 'node:crypto'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { site } from '../src/content/site'
import { parseTrabajoPost, type ManagedProject } from '../src/lib/portfolio/model'
import type { TrabajoPost } from '../src/content/site'
import { readPostgresUrls } from './postgresEnv'

let pooledSql: NeonQueryFunction<false, false> | null = null
let schemaReady: Promise<void> | null = null

function sql(): NeonQueryFunction<false, false> {
  if (!pooledSql) pooledSql = neon(readPostgresUrls().pooled)
  return pooledSql
}

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  return new Date(String(value)).toISOString()
}

function asBool(value: unknown): boolean {
  return value === true
}

function asOrder(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function rowToManaged(row: Record<string, unknown>): ManagedProject | null {
  const data = parseTrabajoPost(row.data)
  if (!data || typeof row.id !== 'string') return null
  return {
    id: row.id,
    published: asBool(row.published),
    featured: asBool(row.featured),
    sortOrder: asOrder(row.sort_order),
    updatedAt: asIso(row.updated_at),
    data,
  }
}

async function seedIfEmpty(direct: NeonQueryFunction<false, false>): Promise<void> {
  const meta = await direct`SELECT seeded FROM portfolio_meta WHERE id = 'main'`
  if (meta[0]?.seeded === true) return

  const count = await direct`SELECT count(*)::int AS n FROM portfolio_projects`
  const existing = Number(count[0]?.n ?? 0)
  if (existing === 0) {
    const featured = new Set<string>(site.home.featuredSlugs)
    const inserts = site.trabajos.items.flatMap((item, index) => {
      const data = parseTrabajoPost(item)
      if (!data) return []
      return [
        direct`
          INSERT INTO portfolio_projects (
            id, slug, portfolio_kind, sort_order, published, featured, data, updated_at
          )
          VALUES (
            ${randomUUID()},
            ${data.slug},
            ${data.portfolioKind},
            ${index},
            true,
            ${featured.has(data.slug)},
            ${JSON.stringify(data)}::jsonb,
            now()
          )
          ON CONFLICT (slug) DO NOTHING
        `,
      ]
    })
    if (inserts.length) await direct.transaction(inserts)
  }

  await direct`
    INSERT INTO portfolio_meta (id, seeded)
    VALUES ('main', true)
    ON CONFLICT (id) DO UPDATE SET seeded = true
  `
}

export function ensurePortfolioSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const direct = neon(readPostgresUrls().direct)
      await direct`
        CREATE TABLE IF NOT EXISTS portfolio_projects (
          id text PRIMARY KEY,
          slug text NOT NULL UNIQUE,
          portfolio_kind text NOT NULL,
          sort_order integer NOT NULL DEFAULT 0,
          published boolean NOT NULL DEFAULT true,
          featured boolean NOT NULL DEFAULT false,
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await direct`
        CREATE TABLE IF NOT EXISTS portfolio_meta (
          id text PRIMARY KEY,
          seeded boolean NOT NULL DEFAULT false
        )
      `
      await seedIfEmpty(direct)
    })().catch((error: unknown) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

async function readAll(): Promise<ManagedProject[]> {
  await ensurePortfolioSchema()
  const rows = await sql()`
    SELECT id, published, featured, sort_order, updated_at, data
    FROM portfolio_projects
    ORDER BY sort_order ASC, updated_at DESC
  `
  return rows.flatMap((row) => {
    const item = rowToManaged(row)
    return item ? [item] : []
  })
}

export async function listManagedProjects(): Promise<ManagedProject[]> {
  return readAll()
}

export async function listPublicProjects(): Promise<{ items: TrabajoPost[]; featuredSlugs: string[] }> {
  const all = await readAll()
  const published = all.filter((item) => item.published)
  return {
    items: published.map((item) => item.data),
    featuredSlugs: published.filter((item) => item.featured).map((item) => item.data.slug),
  }
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = 'code' in error ? String((error as { code?: unknown }).code) : ''
  if (code === '23505') return true
  const message = error instanceof Error ? error.message : ''
  return /duplicate key/i.test(message)
}

export async function createProject(
  data: TrabajoPost,
  flags: { published: boolean; featured: boolean },
): Promise<ManagedProject> {
  await ensurePortfolioSchema()
  const query = sql()
  const orderRows = await query`SELECT COALESCE(MAX(sort_order), -1)::int AS max_order FROM portfolio_projects`
  const sortOrder = asOrder(orderRows[0]?.max_order) + 1
  const id = randomUUID()
  try {
    const rows = await query`
      INSERT INTO portfolio_projects (
        id, slug, portfolio_kind, sort_order, published, featured, data, updated_at
      )
      VALUES (
        ${id},
        ${data.slug},
        ${data.portfolioKind},
        ${sortOrder},
        ${flags.published},
        ${flags.featured},
        ${JSON.stringify(data)}::jsonb,
        now()
      )
      RETURNING id, published, featured, sort_order, updated_at, data
    `
    const created = rowToManaged(rows[0] ?? {})
    if (!created) throw new Error('No se pudo leer el proyecto guardado.')
    return created
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error('Ya existe un proyecto con ese identificador.')
    throw error
  }
}

export async function updateProject(
  id: string,
  data: TrabajoPost,
  flags: { published: boolean; featured: boolean },
): Promise<ManagedProject> {
  await ensurePortfolioSchema()
  try {
    const rows = await sql()`
      UPDATE portfolio_projects
      SET
        slug = ${data.slug},
        portfolio_kind = ${data.portfolioKind},
        published = ${flags.published},
        featured = ${flags.featured},
        data = ${JSON.stringify(data)}::jsonb,
        updated_at = now()
      WHERE id = ${id}
      RETURNING id, published, featured, sort_order, updated_at, data
    `
    const updated = rowToManaged(rows[0] ?? {})
    if (!updated) throw new Error('No se encontró el proyecto.')
    return updated
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error('Ya existe un proyecto con ese identificador.')
    throw error
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensurePortfolioSchema()
  const rows = await sql()`
    DELETE FROM portfolio_projects
    WHERE id = ${id}
    RETURNING id
  `
  return rows.length > 0
}

export async function reorderProjects(ids: string[]): Promise<void> {
  await ensurePortfolioSchema()
  const query = sql()
  const updates = ids.map(
    (id, index) => query`
      UPDATE portfolio_projects
      SET sort_order = ${index}
      WHERE id = ${id}
    `,
  )
  if (updates.length) await query.transaction(updates)
}
