/** Convierte ruta `/...` en URL absoluta para `<Image src>` en PDF (mismo origen o externa). */
export function resolveAssetUrl(path: string): string {
  const p = path.trim()
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const normalized = p.startsWith('/') ? p : `/${p}`
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${normalized}`
  }
  return normalized
}
