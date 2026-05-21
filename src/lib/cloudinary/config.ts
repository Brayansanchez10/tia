const STATUS_URL = '/api/cloudinary/status'

let configuredCache: boolean | null = null
let statusRequest: Promise<boolean> | null = null

/** Cloudinary vía API del servidor (CLOUDINARY_* en .env, sin exponer el secret al navegador). */
export async function isCloudinaryConfigured(): Promise<boolean> {
  if (configuredCache !== null) return configuredCache
  if (!statusRequest) {
    statusRequest = fetch(STATUS_URL)
      .then(async (res) => {
        if (!res.ok) return false
        const json = (await res.json()) as { configured?: boolean }
        return json.configured === true
      })
      .catch(() => false)
      .then((ok) => {
        configuredCache = ok
        return ok
      })
      .finally(() => {
        statusRequest = null
      })
  }
  return statusRequest
}

export function resetCloudinaryConfigCache(): void {
  configuredCache = null
}
