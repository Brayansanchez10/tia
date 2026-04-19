import { Link, useLocation } from 'react-router-dom'
import type { TrabajoPost } from '@/content/site'
import { useTheme } from '@/theme/ThemeProvider'
import { trabajoGallerySrcs } from '@/content/site'
import { GrowLine } from '@/components/motion/GrowLine'
import { RevealOnView } from '@/components/motion/RevealOnView'
import { TrabajoGalleryList } from '@/components/trabajos/TrabajoGallery'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { resolveTrabajosVolverHref, trabajosVolverBackLineLabel } from '@/pages/trabajosCategoryShared'

const backLinkClass =
  'inline-flex text-sm font-medium text-luxury-muted no-underline transition-colors hover:text-luxury-gold hover:underline'

const backLinkMobileClass =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 text-sm font-medium text-paper no-underline shadow-lg backdrop-blur-md transition-colors active:bg-black/55'

export function TrabajoDetailPage({ post }: { post: TrabajoPost }) {
  const { theme } = useTheme()
  const location = useLocation()
  const gallery = trabajoGallerySrcs(post)
  const volverHref = resolveTrabajosVolverHref(location.state, '/trabajos')
  const volverLine = trabajosVolverBackLineLabel(volverHref)

  return (
    <div
      className={[
        'min-h-[50vh] w-full bg-luxury-bg',
        theme === 'dark' ? 'max-lg:bg-[#080808]' : '',
      ].join(' ')}
    >
      <div className="mx-auto max-w-[min(100%,92rem)] px-4 pb-16 pt-6 max-lg:mx-0 max-lg:max-w-none max-lg:px-0 max-lg:pb-28 sm:px-5 sm:pb-20 sm:pt-8 md:px-6 md:pt-10 lg:px-6 lg:pt-12">
        <RevealOnView>
          <nav className="mb-5 px-4 max-lg:mb-4 lg:mb-8" aria-label="Ruta">
            <Link to={volverHref} className={backLinkClass}>
              {volverLine}
            </Link>
          </nav>
        </RevealOnView>

        {/* Desktop: galería + columna. Móvil: hero ancho + ficha oscura alineada al tema. */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+5.5rem)] lg:self-start">
            <TrabajoGalleryList sources={gallery} title={post.title} variant="detail" />
          </div>

          <div className="min-w-0 max-lg:rounded-t-2xl max-lg:border-t max-lg:border-white/10 max-lg:bg-luxury-panel/85 max-lg:shadow-[0_-12px_40px_rgba(0,0,0,0.5)] max-lg:backdrop-blur-md lg:border-l lg:border-white/10 lg:pl-8 xl:pl-10">
            <RevealOnView delayMs={60} variant="fadeUp">
              <header className="px-5 pb-1 pt-7 text-center max-lg:text-left sm:px-6 sm:pt-8 lg:px-0 lg:pb-0 lg:pt-0 lg:text-left">
                <p className="m-0 inline-flex rounded-full border border-luxury-gold/30 bg-luxury-gold/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-luxury-gold max-lg:text-[0.62rem] lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0">
                  {post.category}
                </p>
                <h1 className="m-0 mt-3 font-serif text-2xl font-semibold leading-[1.15] tracking-wide text-paper sm:text-[clamp(1.65rem,4vw,2.1rem)] md:text-4xl lg:text-[clamp(1.5rem,3vw+0.5rem,2.25rem)]">
                  {post.title}
                </h1>
                <GrowLine className="mx-auto mt-4 max-lg:mx-0 max-lg:max-w-[8rem] lg:mx-0 lg:mt-5" />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-luxury-muted">
                  {post.dateLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-paper/85 sm:mt-4 sm:text-[0.95rem]">
                  {post.excerpt}
                </p>
              </header>
            </RevealOnView>

            <RevealOnView delayMs={100} variant="fadeUp">
              <div className="mt-6 space-y-4 px-5 pb-4 text-sm leading-relaxed text-luxury-muted sm:mt-8 sm:px-6 lg:mt-10 lg:px-0 lg:pb-0">
                {post.paragraphs.map((p, i) => (
                  <p key={i} className="m-0">
                    {p}
                  </p>
                ))}
              </div>
              <div className="hidden border-t border-white/10 px-5 pt-8 max-lg:px-6 lg:block lg:px-0">
                <ButtonLink
                  variant="luxuryOutline"
                  to="/trabajos"
                  className="rounded-sm px-6 py-2.5 text-xs uppercase tracking-[0.16em]"
                >
                  ← Trabajos
                </ButtonLink>
              </div>
            </RevealOnView>
          </div>
        </div>
      </div>

      {/* Barra inferior fija solo móvil (estilo app / marketplace) */}
      <div className="fixed inset-x-0 bottom-0 z-[25] flex items-stretch gap-2 border-t border-white/10 bg-luxury-panel/95 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_36px_rgba(0,0,0,0.55)] backdrop-blur-md lg:hidden">
        <Link to={volverHref} className={`${backLinkMobileClass} min-w-0 flex-1`}>
          <span className="text-lg leading-none text-paper/70" aria-hidden>
            ←
          </span>
          <span className="truncate">{volverLine}</span>
        </Link>
        <ButtonLink
          variant="primary"
          to="/trabajos"
          className="min-h-11 shrink-0 rounded-xl px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Más trabajos
        </ButtonLink>
      </div>
    </div>
  )
}
