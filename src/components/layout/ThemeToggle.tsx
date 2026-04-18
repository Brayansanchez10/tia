import { useTheme } from '@/theme/ThemeProvider'

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  )
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ThemeToggleProps = {
  /** Barra superior (icono solo). */
  compact?: boolean
}

export function ThemeToggle({ compact }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? 'theme-toggle-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-paper/15 bg-surface/80 text-paper transition-colors motion-safe:duration-200 hover:border-brand/40 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/55 md:h-10 md:w-10'
          : 'theme-toggle-btn theme-toggle-wide flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3.5 text-paper transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/55'
      }
      aria-pressed={isDark}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {compact ? (
        isDark ? (
          <IconSun className="h-[1.15rem] w-[1.15rem]" />
        ) : (
          <IconMoon className="h-[1.15rem] w-[1.15rem]" />
        )
      ) : (
        <>
          {isDark ? <IconSun className="h-5 w-5 shrink-0" /> : <IconMoon className="h-5 w-5 shrink-0" />}
          <span className="text-base font-medium uppercase tracking-[0.12em]">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
        </>
      )}
    </button>
  )
}
