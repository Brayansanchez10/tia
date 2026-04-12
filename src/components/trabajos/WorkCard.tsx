import { Link } from 'react-router-dom'
import { trabajoCoverSrc, type TrabajoPost } from '@/content/site'

export const workPortfolioGridClass =
  'm-0 grid list-none grid-cols-1 gap-7 p-0 md:grid-cols-2 md:gap-8'

const articleClass =
  'flex flex-col overflow-hidden rounded-sm border border-wood/15 bg-cream/90 shadow-card motion-safe:transition-[border-color,box-shadow] motion-safe:duration-300 motion-safe:hover:border-gold/50 motion-safe:hover:shadow-card-hover'

export type WorkCardProps = {
  post: TrabajoPost
}

export function WorkCard({ post }: WorkCardProps) {
  const cover = trabajoCoverSrc(post)

  return (
    <article className={articleClass}>
      <Link
        to={`/trabajos/${post.slug}`}
        className="block aspect-[16/10] bg-ink no-underline hover:no-underline"
      >
        {cover ? (
          <img src={cover} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="block h-full w-full bg-gradient-to-br from-wood-dark to-ink" aria-hidden />
        )}
      </Link>
      <div className="flex flex-col gap-2 px-5 pb-6 pt-5">
        <p className="m-0 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.78rem] font-normal uppercase tracking-wide text-wood">
          <span>{post.dateLabel}</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
          <span>{post.category}</span>
        </p>
        <h2 className="m-0 text-xl leading-tight">
          <Link
            to={`/trabajos/${post.slug}`}
            className="text-ink no-underline hover:text-wood hover:no-underline"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-[0.95rem] leading-normal text-wood-dark/80">{post.excerpt}</p>
        <Link
          to={`/trabajos/${post.slug}`}
          className="mt-1 w-fit border-b-2 border-gold pb-px text-[0.88rem] font-semibold text-wood-dark no-underline hover:border-wood hover:text-gold hover:no-underline"
        >
          Ver proyecto
        </Link>
      </div>
    </article>
  )
}
