import { adminRequestPassword } from '@/lib/admin/adminPassword'
import { asManagedProject, parseTrabajoPost, type ManagedProject } from '@/lib/portfolio/model'
import type { TrabajoPost } from '@/content/site'

export type PublicCatalog = {
  items: TrabajoPost[]
  featuredSlugs: string[]
}

async function readJson(response: Response): Promise<{ error?: string } & Record<string, unknown>> {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null
  if (!response.ok) throw new Error(payload?.error || `Neon respondió ${response.status}`)
  return payload ?? {}
}

function adminHeaders(body?: string): Headers {
  const headers = new Headers({ 'x-admin-password': adminRequestPassword() })
  if (body) headers.set('Content-Type', 'application/json')
  return headers
}

export async function fetchPublicCatalog(): Promise<PublicCatalog> {
  const response = await fetch('/api/projects')
  const payload = await readJson(response)
  const items = Array.isArray(payload.items)
    ? payload.items.flatMap((item) => {
        const post = parseTrabajoPost(item)
        return post ? [post] : []
      })
    : []
  const featuredSlugs = Array.isArray(payload.featuredSlugs)
    ? payload.featuredSlugs.filter((slug): slug is string => typeof slug === 'string')
    : []
  return { items, featuredSlugs }
}

export async function fetchManagedProjects(): Promise<ManagedProject[]> {
  const response = await fetch('/api/projects?manage=1', { headers: adminHeaders() })
  const payload = await readJson(response)
  if (!Array.isArray(payload.items)) return []
  return payload.items.flatMap((item) => {
    const project = asManagedProject(item)
    return project ? [project] : []
  })
}

export async function saveManagedProject(input: {
  id: string | null
  published: boolean
  featured: boolean
  data: TrabajoPost
}): Promise<ManagedProject> {
  const creating = !input.id
  const response = await fetch('/api/projects', {
    method: creating ? 'POST' : 'PUT',
    headers: adminHeaders('1'),
    body: JSON.stringify({
      id: input.id,
      published: input.published,
      featured: input.featured,
      data: input.data,
    }),
  })
  const payload = await readJson(response)
  const item = asManagedProject(payload.item)
  if (!item) throw new Error('La respuesta del proyecto no es válida.')
  return item
}

export async function deleteManagedProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  await readJson(response)
}

export async function reorderManagedProjects(ids: string[]): Promise<void> {
  const response = await fetch('/api/projects?action=reorder', {
    method: 'POST',
    headers: adminHeaders('1'),
    body: JSON.stringify({ ids }),
  })
  await readJson(response)
}
