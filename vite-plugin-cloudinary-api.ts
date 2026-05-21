import type { Connect, Plugin } from 'vite'
import { handleCloudinaryStatus, handleCloudinaryUpload } from './server/cloudinaryApi'

const STATUS_PATH = '/api/cloudinary/status'
const UPLOAD_PATH = '/api/cloudinary/upload'

function patchProcessEnv(env: Record<string, string>): void {
  for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const) {
    const v = env[key]
    if (v) process.env[key] = v
  }
}

function attachCloudinaryApi(middlewares: Connect.Server): void {
  middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path === STATUS_PATH && req.method === 'GET') {
      handleCloudinaryStatus(req, res)
      return
    }
    if (path === UPLOAD_PATH && req.method === 'POST') {
      void handleCloudinaryUpload(req, res)
      return
    }
    next()
  })
}

/** API local de subida a Cloudinary (credenciales solo en servidor, nunca en el bundle). */
export function cloudinaryApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'cloudinary-api',
    configureServer(server) {
      patchProcessEnv(env)
      attachCloudinaryApi(server.middlewares)
    },
    configurePreviewServer(server) {
      patchProcessEnv(env)
      attachCloudinaryApi(server.middlewares)
    },
  }
}
