import { timingSafeEqual } from 'node:crypto'
import { readAdminPassword } from './postgresEnv'

export function adminAuthorized(
  provided: string | undefined,
): { ok: true } | { ok: false; status: number; error: string } {
  const expected = readAdminPassword()
  if (!expected) {
    return { ok: false, status: 503, error: 'Falta VITE_ADMIN_PASSWORD en el servidor.' }
  }
  if (!provided || !passwordsMatch(provided, expected)) {
    return { ok: false, status: 401, error: 'No autorizado.' }
  }
  return { ok: true }
}

function passwordsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function publicErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Error de base de datos'
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, '[redacted]')
}
