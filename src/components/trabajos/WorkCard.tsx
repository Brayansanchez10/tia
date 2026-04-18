import { trabajoCoverSrc, type TrabajoPost } from '@/content/site'
import { PortfolioWorkCard } from '@/components/trabajos/PortfolioWorkCard'

export type WorkCardProps = {
  post: TrabajoPost
  layout?: 'stack' | 'grid'
}

export function WorkCard({ post, layout = 'stack' }: WorkCardProps) {
  const cover = trabajoCoverSrc(post)

  return (
    <PortfolioWorkCard
      to={`/trabajos/${post.slug}`}
      coverSrc={cover}
      category={post.category}
      title={post.title}
      excerpt={post.excerpt}
      ctaLabel="Ver proyecto"
      ariaLabel={`Ver proyecto: ${post.title}`}
      layout={layout}
    />
  )
}
