import type { LinkProps } from 'react-router-dom'
import { trabajoCoverSrc, trabajoExcerptText, type TrabajoPost } from '@/content/site'
import { PortfolioWorkCard } from '@/components/trabajos/PortfolioWorkCard'

export type WorkCardProps = {
  post: TrabajoPost
  layout?: 'stack' | 'grid'
  linkState?: LinkProps['state']
}

export function WorkCard({ post, layout = 'stack', linkState }: WorkCardProps) {
  const cover = trabajoCoverSrc(post)

  return (
    <PortfolioWorkCard
      to={`/trabajos/${post.slug}`}
      state={linkState}
      coverSrc={cover}
      category={post.category}
      title={post.title}
      excerpt={trabajoExcerptText(post.excerpt)}
      highlights={post.highlights}
      ctaLabel="Ver proyecto"
      ariaLabel={`Ver proyecto: ${post.title}`}
      layout={layout}
    />
  )
}
