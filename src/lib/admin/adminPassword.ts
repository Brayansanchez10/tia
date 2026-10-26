export function adminRequestPassword(): string {
  const env = import.meta.env.VITE_ADMIN_PASSWORD
  if (typeof env === 'string' && env.length > 0) return env
  if (import.meta.env.DEV) return 'admin'
  return ''
}
