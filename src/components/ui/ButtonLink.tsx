import { Link, type LinkProps } from 'react-router-dom'

const variants = {
  primary:
    'inline-flex items-center justify-center rounded-[10px] border border-gold/50 bg-gold px-4 py-2.5 text-[0.95rem] font-semibold text-white shadow-none no-underline transition motion-safe:duration-200 hover:brightness-110 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] hover:no-underline',
  ghost:
    'inline-flex items-center justify-center rounded-[10px] border border-paper/15 bg-surface px-4 py-2.5 text-[0.95rem] font-semibold text-paper shadow-card no-underline transition motion-safe:duration-200 hover:border-wood/50 hover:text-wood motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] hover:no-underline',
  /** Sobre fondos oscuros (hero). */
  heroGhost:
    'inline-flex items-center justify-center rounded-sm border border-paper/45 bg-transparent px-5 py-2.5 text-[0.95rem] font-semibold text-paper shadow-none no-underline transition motion-safe:duration-200 hover:border-gold hover:bg-paper/5 hover:text-paper motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] hover:no-underline',
  /** Borde dorado tipo “ghost” sobre hero oscuro (landing). */
  luxuryOutline:
    'inline-flex items-center justify-center rounded-sm border border-luxury-gold/90 bg-transparent px-6 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-luxury-gold shadow-none no-underline transition motion-safe:duration-200 hover:bg-luxury-gold/10 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] hover:no-underline',
} as const

export type ButtonLinkVariant = keyof typeof variants

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonLinkVariant
}

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  const base = variants[variant]
  return <Link className={className ? `${base} ${className}` : base} {...props} />
}
