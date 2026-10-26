import { parseEnv } from '@neon/env'
import config from '../neon'

function unquote(value: string): string {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1)
  }
  return value
}

/** Pooled URL for app queries; direct URL for schema changes. */
export function readPostgresUrls(): { pooled: string; direct: string } {
  const { postgres } = parseEnv(config, ['DATABASE_URL', 'DATABASE_URL_UNPOOLED'])
  return {
    pooled: unquote(postgres.databaseUrl),
    direct: unquote(postgres.databaseUrlUnpooled),
  }
}

export function readAdminPassword(): string {
  const raw = process.env.VITE_ADMIN_PASSWORD
  if (typeof raw === 'string' && raw.length > 0) return unquote(raw)
  if (process.env.NODE_ENV !== 'production') return 'admin'
  return ''
}
