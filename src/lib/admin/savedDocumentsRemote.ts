export type RemoteDocument = {
  id: string
  label: string
  updatedAt: string
  data: object
}

function adminPassword(): string {
  const env = import.meta.env.VITE_ADMIN_PASSWORD
  if (typeof env === 'string' && env.length > 0) return env
  if (import.meta.env.DEV) return 'admin'
  return ''
}

async function request(kind: 'cotizacion' | 'recibo', init?: RequestInit): Promise<unknown> {
  const headers = new Headers(init?.headers)
  headers.set('x-admin-password', adminPassword())
  if (init?.body) headers.set('Content-Type', 'application/json')
  const response = await fetch(`/api/documents?kind=${kind}`, { ...init, headers })
  const payload = (await response.json().catch(() => null)) as { error?: string } | null
  if (!response.ok) {
    throw new Error(payload?.error || `Neon respondió ${response.status}`)
  }
  return payload
}

export async function fetchRemoteDocuments(kind: 'cotizacion' | 'recibo'): Promise<unknown> {
  const payload = (await request(kind)) as { items?: unknown }
  return payload.items ?? []
}

export async function saveRemoteDocuments(
  kind: 'cotizacion' | 'recibo',
  items: RemoteDocument[],
): Promise<void> {
  await request(kind, { method: 'PUT', body: JSON.stringify(items) })
}
