import { Navigate, useParams } from 'react-router-dom'
import { site } from '@/content/site'
import { TrabajoDetailPage } from '@/pages/TrabajoDetailPage'
import { TrabajoHubPage } from '@/pages/TrabajoHubPage'

/**
 * /trabajos/:slug — Si el trabajo tiene `children`, muestra el hub de subvistas;
 * si no, el detalle clásico.
 */
export function TrabajoEntryPage() {
  const { slug } = useParams()
  const post = site.trabajos.items.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/trabajos" replace />
  }

  if (post.children?.length) {
    return <TrabajoHubPage post={post} />
  }

  return <TrabajoDetailPage post={post} />
}
