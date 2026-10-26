import { adminAuthorized, publicErrorMessage } from './adminGate'
import { parseTrabajoPost } from '../src/lib/portfolio/model'
import {
  createProject,
  deleteProject,
  listManagedProjects,
  listPublicProjects,
  reorderProjects,
  updateProject,
} from './portfolioStore'

function asBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  return fallback
}

function readPayload(body: string | undefined): unknown {
  try {
    return JSON.parse(body ?? '')
  } catch {
    return null
  }
}

export async function handleProjects(input: {
  method: string
  manage: boolean
  id: string | null
  action: string | null
  adminPassword: string | undefined
  body?: string
}): Promise<{ status: number; body: unknown }> {
  try {
    if (input.method === 'GET' && !input.manage) {
      const catalog = await listPublicProjects()
      return { status: 200, body: catalog }
    }

    const gate = adminAuthorized(input.adminPassword)
    if (!gate.ok) return { status: gate.status, body: { error: gate.error } }

    if (input.method === 'GET') {
      const items = await listManagedProjects()
      return { status: 200, body: { items } }
    }

    if (input.method === 'DELETE') {
      if (!input.id) return { status: 400, body: { error: 'Falta el id del proyecto.' } }
      const removed = await deleteProject(input.id)
      if (!removed) return { status: 404, body: { error: 'No se encontró el proyecto.' } }
      return { status: 200, body: { ok: true } }
    }

    if (input.method === 'POST' && input.action === 'reorder') {
      const payload = readPayload(input.body)
      const ids =
        payload && typeof payload === 'object' && !Array.isArray(payload)
          ? (payload as { ids?: unknown }).ids
          : null
      if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string' || !id)) {
        return { status: 400, body: { error: 'Se esperaba una lista de ids.' } }
      }
      await reorderProjects(ids)
      return { status: 200, body: { ok: true } }
    }

    if (input.method === 'POST' || input.method === 'PUT') {
      const payload = readPayload(input.body)
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { status: 400, body: { error: 'JSON inválido.' } }
      }
      const record = payload as Record<string, unknown>
      const data = parseTrabajoPost(record.data)
      if (!data) return { status: 400, body: { error: 'El proyecto está incompleto.' } }
      const flags = {
        published: asBool(record.published, true),
        featured: asBool(record.featured, false),
      }
      if (input.method === 'POST') {
        const item = await createProject(data, flags)
        return { status: 200, body: { item } }
      }
      const id = typeof record.id === 'string' ? record.id : ''
      if (!id) return { status: 400, body: { error: 'Falta el id del proyecto.' } }
      const item = await updateProject(id, data, flags)
      return { status: 200, body: { item } }
    }

    return { status: 405, body: { error: 'Método no permitido.' } }
  } catch (error) {
    const message = publicErrorMessage(error)
    const status = message.includes('Ya existe') ? 409 : message.includes('No se encontró') ? 404 : 500
    return { status, body: { error: message } }
  }
}
