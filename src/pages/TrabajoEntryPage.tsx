import { Navigate, useParams } from 'react-router-dom'
import { usePortfolio } from '@/lib/portfolio/PortfolioProvider'
import { TrabajoDetailPage } from '@/pages/TrabajoDetailPage'
import { TrabajoHubPage } from '@/pages/TrabajoHubPage'

/**
 * `/trabajos/:slug` — Sin UI propia: con `children` → hub de exhibiciones; si no → detalle con galería.
 */
export function TrabajoEntryPage() {
  const { slug } = useParams()
  const { items } = usePortfolio()
  const post = items.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/trabajos" replace />
  }

  if (post.children?.length) {
    return <TrabajoHubPage post={post} />
  }

  return <TrabajoDetailPage post={post} />
}
