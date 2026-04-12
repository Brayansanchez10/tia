import { NavLink } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { site } from '@/content/site'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-2 py-1.5 text-sm no-underline transition-colors duration-200 motion-safe:hover:scale-[1.03] hover:no-underline',
    isActive
      ? 'bg-gold font-semibold text-ink'
      : 'text-paper/70 hover:bg-gold/10 hover:text-gold',
  ].join(' ')

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-ink/88">
      <div className="mx-auto grid max-w-[65rem] grid-cols-1 items-center gap-4 px-5 py-3.5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-6 lg:gap-10">
        <div className="justify-self-start md:self-center">
          <BrandLogo />
        </div>

        <NavLink
          to="/"
          end
          className="flex min-w-0 flex-col items-center gap-0.5 justify-self-center text-center no-underline hover:no-underline md:px-4"
        >
          <span className="text-balance text-lg font-bold leading-tight text-paper md:text-xl">
            {site.brand}
          </span>
          <span className="max-w-lg text-pretty text-xs leading-snug text-paper/70 md:text-sm">
            {site.tagline}
          </span>
        </NavLink>

        <nav
          aria-label="Principal"
          className="justify-self-center md:justify-self-end md:self-center"
        >
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-2 gap-y-1 p-0 md:justify-end">
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
