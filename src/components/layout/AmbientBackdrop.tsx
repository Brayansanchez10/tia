/**
 * Atmósfera de fondo: gradientes suaves de marca, sin ornamentación que compita.
 */
export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-[18%] -top-[20%] h-[min(50vw,26rem)] w-[min(50vw,26rem)] rounded-full bg-brand/[0.07] blur-3xl" />
      <div className="absolute -bottom-[28%] -left-[12%] h-[min(55vw,30rem)] w-[min(55vw,30rem)] rounded-full bg-luxury-gold/[0.05] blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: `linear-gradient(var(--theme-ambient-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--theme-ambient-grid) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }}
      />
    </div>
  )
}
