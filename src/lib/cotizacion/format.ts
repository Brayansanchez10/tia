import { toCardinal } from 'n2words/es-MX'

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Texto legal tipo documento: "Nueve millones... pesos" */
export function amountInWordsEs(value: number): string {
  if (!Number.isFinite(value) || value < 0) return ''
  const rounded = Math.round(value)
  const words = toCardinal(rounded)
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1)
  return `${capitalized} pesos`
}

export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}
