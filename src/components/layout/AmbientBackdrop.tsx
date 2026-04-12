/**
 * Figuras decorativas de fondo (suaves, sin competir con el contenido).
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-[20%] -top-[25%] h-[min(55vw,28rem)] w-[min(55vw,28rem)] rounded-full bg-gold/6 blur-3xl" />
      <div className="absolute -bottom-[30%] -left-[15%] h-[min(60vw,32rem)] w-[min(60vw,32rem)] rounded-full bg-wood/7 blur-3xl" />

      <svg
        className="absolute left-[4%] top-[18%] h-24 w-24 text-gold/14 md:left-[6%] md:top-[22%] md:h-32 md:w-32"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      </svg>

      <svg
        className="absolute right-[8%] top-[35%] h-20 w-20 rotate-12 text-wood/16 md:right-[10%] md:h-28 md:w-28"
        viewBox="0 0 100 100"
        fill="none"
      >
        <rect x="18" y="18" width="64" height="64" rx="14" stroke="currentColor" strokeWidth="1.15" />
        <path
          d="M32 68 L50 38 L68 68"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>

      <svg
        className="absolute bottom-[28%] left-[12%] h-16 w-16 -rotate-6 text-gold/11 md:bottom-[32%] md:left-[14%] md:h-24 md:w-24"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M50 12 L88 88 L12 88 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>

      <svg
        className="absolute bottom-[18%] right-[6%] h-28 w-28 text-wood/10 md:right-[8%] md:h-36 md:w-36"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.9" strokeDasharray="10 14" />
        <circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth="0.7" opacity="0.55" />
      </svg>

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgb(241 245 249) 1px, transparent 1px),
            linear-gradient(90deg, rgb(241 245 249) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}
