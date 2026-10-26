import type { TrabajoChild, TrabajoMediaItem, TrabajoPortfolioKind, TrabajoPost } from '../../content/site'

export type ManagedProject = {
  id: string
  published: boolean
  featured: boolean
  sortOrder: number
  updatedAt: string
  data: TrabajoPost
}

export type MediaDraft = {
  src: string
  badge: string
}

export type ChildDraft = {
  slug: string
  title: string
  dateLabel: string
  category: string
  excerpt: string
  highlightsText: string
  paragraphsText: string
  images: MediaDraft[]
}

export type ProjectDraft = {
  id: string | null
  published: boolean
  featured: boolean
  title: string
  slug: string
  dateLabel: string
  portfolioKind: TrabajoPortfolioKind
  category: string
  excerpt: string
  highlightsText: string
  paragraphsText: string
  images: MediaDraft[]
  children: ChildDraft[]
}

const MAX_TEXT = 4000
const MAX_PARAGRAPHS = 24
const MAX_HIGHLIGHTS = 12
const MAX_MEDIA = 40
const MAX_CHILDREN = 24

export function suggestSlug(title: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base.slice(0, 80)
}

function asText(value: unknown, max = MAX_TEXT): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function asLines(text: string, max: number): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max)
}

function asParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, MAX_PARAGRAPHS)
    .map((block) => block.slice(0, MAX_TEXT))
}

function linesToText(lines: readonly string[] | undefined): string {
  return (lines ?? []).join('\n')
}

function paragraphsToText(lines: readonly string[] | undefined): string {
  return (lines ?? []).join('\n\n')
}

function mediaToDraft(item: TrabajoMediaItem): MediaDraft {
  if (typeof item === 'string') return { src: item, badge: '' }
  return { src: item.src, badge: item.badge?.trim() ?? '' }
}

function draftToMedia(items: MediaDraft[]): TrabajoMediaItem[] {
  const out: TrabajoMediaItem[] = []
  for (const item of items.slice(0, MAX_MEDIA)) {
    const src = item.src.trim()
    if (!src) continue
    const badge = item.badge.trim()
    out.push(badge ? { src, badge } : src)
  }
  return out
}

function isKind(value: unknown): value is TrabajoPortfolioKind {
  return value === 'corporativo' || value === 'residencial'
}

export function draftFromPost(project: ManagedProject): ProjectDraft {
  const post = project.data
  return {
    id: project.id,
    published: project.published,
    featured: project.featured,
    title: post.title,
    slug: post.slug,
    dateLabel: post.dateLabel,
    portfolioKind: post.portfolioKind,
    category: post.category,
    excerpt: post.excerpt,
    highlightsText: linesToText(post.highlights),
    paragraphsText: paragraphsToText(post.paragraphs),
    images: (post.images ?? (post.image ? [post.image] : [])).map(mediaToDraft),
    children: (post.children ?? []).map((child) => ({
      slug: child.slug,
      title: child.title,
      dateLabel: child.dateLabel,
      category: child.category,
      excerpt: child.excerpt,
      highlightsText: linesToText(child.highlights),
      paragraphsText: paragraphsToText(child.paragraphs),
      images: (child.images ?? (child.image ? [child.image] : [])).map(mediaToDraft),
    })),
  }
}

export function emptyDraft(kind: TrabajoPortfolioKind = 'corporativo'): ProjectDraft {
  return {
    id: null,
    published: true,
    featured: false,
    title: '',
    slug: '',
    dateLabel: '',
    portfolioKind: kind,
    category: kind === 'corporativo' ? 'Comercial' : 'Residencial',
    excerpt: '',
    highlightsText: '',
    paragraphsText: '',
    images: [],
    children: [],
  }
}

export function postFromDraft(draft: ProjectDraft): { post: TrabajoPost } | { error: string } {
  const title = draft.title.trim()
  const slug = draft.slug.trim()
  if (!title) return { error: 'Escribe el nombre del proyecto.' }
  if (!slug) return { error: 'Escribe el nombre del proyecto para poder guardarlo.' }
  if (!isKind(draft.portfolioKind)) return { error: 'Elige si es para un negocio o para una casa.' }

  const childSlugs = new Set<string>()
  const children: TrabajoChild[] = []
  for (const child of draft.children.slice(0, MAX_CHILDREN)) {
    const childTitle = child.title.trim()
    const childSlug = child.slug.trim()
    if (!childTitle && !childSlug && child.images.every((img) => !img.src.trim())) continue
    if (!childTitle || !childSlug) {
      return { error: 'Cada parte del trabajo necesita un nombre.' }
    }
    if (childSlugs.has(childSlug)) return { error: 'Hay dos partes con el mismo nombre.' }
    childSlugs.add(childSlug)
    const highlights = asLines(child.highlightsText, MAX_HIGHLIGHTS)
    const paragraphs = asParagraphs(child.paragraphsText)
    const images = draftToMedia(child.images)
    children.push({
      slug: childSlug,
      title: childTitle,
      dateLabel: asText(child.dateLabel, 160),
      category: asText(child.category, 160),
      excerpt: asText(child.excerpt),
      ...(highlights.length ? { highlights } : {}),
      paragraphs,
      ...(images.length ? { images } : {}),
    })
  }

  const highlights = asLines(draft.highlightsText, MAX_HIGHLIGHTS)
  const paragraphs = asParagraphs(draft.paragraphsText)
  const images = draftToMedia(draft.images)
  const post: TrabajoPost = {
    slug,
    title,
    dateLabel: asText(draft.dateLabel, 160),
    portfolioKind: draft.portfolioKind,
    category: asText(draft.category, 160),
    excerpt: asText(draft.excerpt),
    ...(highlights.length ? { highlights } : {}),
    paragraphs,
    ...(images.length ? { images } : {}),
    ...(children.length ? { children } : {}),
  }
  return { post }
}

function normalizeMedia(value: unknown): TrabajoMediaItem[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items: TrabajoMediaItem[] = []
  for (const entry of value.slice(0, MAX_MEDIA)) {
    if (typeof entry === 'string' && entry.trim()) {
      items.push(entry.trim())
      continue
    }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
    const src = asText((entry as { src?: unknown }).src, 2000)
    if (!src) continue
    const badge = asText((entry as { badge?: unknown }).badge, 80)
    items.push(badge ? { src, badge } : src)
  }
  return items.length ? items : undefined
}

function normalizeChild(value: unknown): TrabajoChild | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const slug = asText(record.slug, 160)
  const title = asText(record.title, 200)
  if (!slug || !title) return null
  const highlights = Array.isArray(record.highlights)
    ? record.highlights.map((item) => asText(item, 200)).filter(Boolean).slice(0, MAX_HIGHLIGHTS)
    : []
  const paragraphs = Array.isArray(record.paragraphs)
    ? record.paragraphs.map((item) => asText(item)).filter(Boolean).slice(0, MAX_PARAGRAPHS)
    : []
  const images = normalizeMedia(record.images)
  const image = asText(record.image, 2000)
  return {
    slug,
    title,
    dateLabel: asText(record.dateLabel, 160),
    category: asText(record.category, 160),
    excerpt: asText(record.excerpt),
    ...(highlights.length ? { highlights } : {}),
    paragraphs,
    ...(images ? { images } : {}),
    ...(image ? { image } : {}),
  }
}

/** Acepta un proyecto ya guardado o el JSON que manda el admin. */
export function parseTrabajoPost(value: unknown): TrabajoPost | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const slug = asText(record.slug, 160)
  const title = asText(record.title, 200)
  if (!slug || !title || !isKind(record.portfolioKind)) return null
  const highlights = Array.isArray(record.highlights)
    ? record.highlights.map((item) => asText(item, 200)).filter(Boolean).slice(0, MAX_HIGHLIGHTS)
    : []
  const paragraphs = Array.isArray(record.paragraphs)
    ? record.paragraphs.map((item) => asText(item)).filter(Boolean).slice(0, MAX_PARAGRAPHS)
    : []
  const images = normalizeMedia(record.images)
  const image = asText(record.image, 2000)
  const children = Array.isArray(record.children)
    ? record.children.map(normalizeChild).filter((child): child is TrabajoChild => Boolean(child)).slice(0, MAX_CHILDREN)
    : []
  return {
    slug,
    title,
    dateLabel: asText(record.dateLabel, 160),
    portfolioKind: record.portfolioKind,
    category: asText(record.category, 160),
    excerpt: asText(record.excerpt),
    ...(highlights.length ? { highlights } : {}),
    paragraphs,
    ...(images ? { images } : {}),
    ...(image ? { image } : {}),
    ...(children.length ? { children } : {}),
  }
}

export function asManagedProject(value: unknown): ManagedProject | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const data = parseTrabajoPost(record.data)
  if (!data || typeof record.id !== 'string') return null
  const sortOrder = typeof record.sortOrder === 'number' ? record.sortOrder : Number(record.sortOrder)
  return {
    id: record.id,
    published: record.published === true || record.published === 'true',
    featured: record.featured === true || record.featured === 'true',
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : '',
    data,
  }
}
