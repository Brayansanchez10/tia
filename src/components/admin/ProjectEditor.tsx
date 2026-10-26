import { useState, type FormEvent } from 'react'
import { ProjectMediaField } from '@/components/admin/ProjectMediaField'
import { trabajoMediaIsVideo, type TrabajoPortfolioKind } from '@/content/site'
import { deleteManagedProject, saveManagedProject } from '@/lib/portfolio/portfolioClient'
import {
  emptyDraft,
  postFromDraft,
  suggestSlug,
  type ChildDraft,
  type ProjectDraft,
} from '@/lib/portfolio/model'

const fieldClass =
  'mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-luxury-bg px-4 py-3 text-base text-paper outline-none focus:border-luxury-gold'

function emptyChild(): ChildDraft {
  return {
    slug: '',
    title: '',
    dateLabel: '',
    category: '',
    excerpt: '',
    highlightsText: '',
    paragraphsText: '',
    images: [],
  }
}

type Props = {
  initial: ProjectDraft
  onSaved: (id: string) => void
  onDeleted: () => void
  onCancel: () => void
}

export function ProjectEditor({ initial, onSaved, onDeleted, onCancel }: Props) {
  const [draft, setDraft] = useState<ProjectDraft>(initial)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [showParts, setShowParts] = useState(initial.children.length > 0)

  function patch(partial: Partial<ProjectDraft>) {
    setDirty(true)
    setSaved(false)
    setDraft((current) => ({ ...current, ...partial }))
  }

  function patchChild(index: number, partial: Partial<ChildDraft>) {
    setDirty(true)
    setSaved(false)
    setDraft((current) => ({
      ...current,
      children: current.children.map((child, i) => (i === index ? { ...child, ...partial } : child)),
    }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const built = postFromDraft(draft)
    if ('error' in built) {
      setError(built.error)
      setSaved(false)
      return
    }
    setSaving(true)
    setError(null)
    try {
      const item = await saveManagedProject({
        id: draft.id,
        published: draft.published,
        featured: draft.featured,
        data: built.post,
      })
      setDraft((current) => ({ ...current, id: item.id, slug: item.data.slug }))
      setSlugTouched(true)
      setDirty(false)
      setSaved(true)
      onSaved(item.id)
    } catch (cause) {
      setSaved(false)
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar. Intenta otra vez.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!draft.id) return
    const sure = window.confirm('¿Quitar este proyecto de la página? Tus clientes dejarán de verlo.')
    if (!sure) return
    setSaving(true)
    setError(null)
    try {
      await deleteManagedProject(draft.id)
      onDeleted()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo quitar.')
      setSaving(false)
    }
  }

  function requestClose() {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Volver de todas formas?')) return
    onCancel()
  }

  const cover = draft.images.find((item) => item.src.trim() && !trabajoMediaIsVideo(item.src)) ?? draft.images[0]
  const viewHref = draft.slug.trim() ? `/trabajos/${encodeURIComponent(draft.slug.trim())}` : '/trabajos'

  return (
    <form className="mx-auto max-w-3xl space-y-6 pb-44 sm:space-y-8" onSubmit={(event) => void onSubmit(event)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={requestClose} className="min-h-11 text-sm text-luxury-gold">
          ← Volver a mis trabajos
        </button>
        {draft.id && draft.published ? (
          <a href={viewHref} target="_blank" rel="noreferrer" className="min-h-11 text-sm text-paper underline-offset-2 hover:underline">
            Ver cómo se ve
          </a>
        ) : null}
      </div>

      <header>
        <p className="text-sm text-luxury-gold">{draft.id ? 'Estás editando' : 'Proyecto nuevo'}</p>
        <h2 className="mt-1 break-words font-[family-name:var(--font-serif)] text-2xl text-paper sm:text-3xl">
          {draft.title.trim() || 'Sin nombre todavía'}
        </h2>
      </header>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-luxury-panel">
        <div className="grid md:grid-cols-[minmax(0,16rem)_1fr]">
          <div className="relative aspect-[4/3] bg-black/30 md:aspect-auto">
            {cover?.src ? (
              trabajoMediaIsVideo(cover.src) ? (
                <video src={cover.src} className="h-full w-full object-cover" muted playsInline />
              ) : (
                <img src={cover.src} alt="" className="h-full w-full object-cover" />
              )
            ) : (
              <div className="flex h-full min-h-40 items-center justify-center px-4 text-center text-sm text-luxury-muted">
                Aquí se verá la foto principal
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-luxury-gold">
              {draft.category.trim() || 'Tipo de trabajo'}
            </p>
            <p className="mt-2 break-words font-[family-name:var(--font-serif)] text-2xl text-paper">
              {draft.title.trim() || 'Nombre del proyecto'}
            </p>
            {draft.dateLabel.trim() ? <p className="mt-1 text-sm text-luxury-muted">{draft.dateLabel}</p> : null}
            <p className="mt-3 text-sm leading-relaxed text-paper/80">
              {draft.excerpt.trim() || 'La frase corta de la tarjeta aparecerá aquí.'}
            </p>
            <p className="mt-4 text-xs text-luxury-muted">Así lo van a ver tus clientes en la lista.</p>
          </div>
        </div>
      </section>

      {saved ? (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
          Listo, los cambios ya están guardados.
          {draft.published ? ' Si la página está abierta, recárgala para verlos.' : ' Este proyecto está escondido.'}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-white/10 bg-luxury-panel/70 p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-paper">1. ¿De qué trabajo se trata?</h3>
        <label className="block text-sm text-paper">
          Nombre
          <span className="mt-1 block text-xs text-luxury-muted">El título grande. Por ejemplo: Cocina integral.</span>
          <input
            className={fieldClass}
            value={draft.title}
            required
            onChange={(event) => {
              const title = event.target.value
              patch({ title, slug: slugTouched ? draft.slug : suggestSlug(title) })
            }}
          />
        </label>
        <div>
          <p className="text-sm text-paper">¿Para quién es?</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <KindButton
              active={draft.portfolioKind === 'corporativo'}
              title="Para un negocio"
              text="Tiendas, stands, estanterías y puntos de venta."
              onClick={() =>
                patch({
                  portfolioKind: 'corporativo',
                  category: draft.category.trim() ? draft.category : 'Comercial',
                })
              }
            />
            <KindButton
              active={draft.portfolioKind === 'residencial'}
              title="Para una casa"
              text="Cocinas, muebles, puertas y lavaderos."
              onClick={() =>
                patch({
                  portfolioKind: 'residencial',
                  category: draft.category.trim() ? draft.category : 'Residencial',
                })
              }
            />
          </div>
        </div>
        <label className="block text-sm text-paper">
          Tipo de trabajo
          <span className="mt-1 block text-xs text-luxury-muted">Una palabra corta: Stand, Cocina, Estantería.</span>
          <input
            className={fieldClass}
            value={draft.category}
            onChange={(event) => patch({ category: event.target.value })}
          />
        </label>
        <label className="block text-sm text-paper">
          Línea pequeña
          <span className="mt-1 block text-xs text-luxury-muted">Opcional. Por ejemplo: Feria 2024 o Medellín.</span>
          <input
            className={fieldClass}
            value={draft.dateLabel}
            onChange={(event) => patch({ dateLabel: event.target.value })}
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-luxury-panel/70 p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-paper">2. Fotos y videos</h3>
        <ProjectMediaField images={draft.images} onChange={(images) => patch({ images })} />
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-luxury-panel/70 p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-paper">3. Lo que quieres contar</h3>
        <label className="block text-sm text-paper">
          Frase de la tarjeta
          <span className="mt-1 block text-xs text-luxury-muted">Una o dos líneas. Es lo que se lee antes de abrir el proyecto.</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            value={draft.excerpt}
            onChange={(event) => patch({ excerpt: event.target.value })}
          />
        </label>
        <label className="block text-sm text-paper">
          Puntos clave
          <span className="mt-1 block text-xs text-luxury-muted">Uno por línea. Por ejemplo: Madera y metal.</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            value={draft.highlightsText}
            placeholder={'Madera y metal\nMontaje en el local'}
            onChange={(event) => patch({ highlightsText: event.target.value })}
          />
        </label>
        <label className="block text-sm text-paper">
          Historia
          <span className="mt-1 block text-xs text-luxury-muted">El texto largo. Deja una línea en blanco para empezar otro párrafo.</span>
          <textarea
            className={`${fieldClass} min-h-36`}
            value={draft.paragraphsText}
            onChange={(event) => patch({ paragraphsText: event.target.value })}
          />
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-luxury-panel/70 p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-serif)] text-xl text-paper">4. Dónde se muestra</h3>
        <ToggleCard
          on={draft.published}
          title={draft.published ? 'Sí se ve en Trabajos' : 'Está escondido'}
          text="Si lo apagas, sigue guardado aquí pero tus clientes no lo ven."
          onClick={() => patch({ published: !draft.published })}
        />
        <ToggleCard
          on={draft.featured}
          title={draft.featured ? 'También sale en el inicio' : 'No sale en el inicio'}
          text="El inicio muestra solo unos pocos trabajos destacados."
          onClick={() => patch({ featured: !draft.featured })}
        />
      </section>

      <section className="rounded-2xl border border-white/10 p-5">
        <button
          type="button"
          className="text-left text-sm text-paper"
          onClick={() => setShowParts((open) => !open)}
        >
          {showParts ? 'Ocultar partes del trabajo' : 'Este trabajo tiene varias partes'}
        </button>
        {showParts ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-relaxed text-luxury-muted">
              Úsalo solo si un mismo cliente tiene varias piezas y cada una necesita su propia página.
            </p>
            {draft.children.map((child, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-white/10 p-4">
                <label className="block text-sm text-paper">
                  Nombre de la parte
                  <input
                    className={fieldClass}
                    value={child.title}
                    onChange={(event) => {
                      const title = event.target.value
                      const previous = suggestSlug(child.title)
                      patchChild(index, {
                        title,
                        slug: !child.slug.trim() || child.slug === previous ? suggestSlug(title) : child.slug,
                      })
                    }}
                  />
                </label>
                <label className="block text-sm text-paper">
                  Frase
                  <textarea
                    className={`${fieldClass} min-h-24`}
                    value={child.excerpt}
                    onChange={(event) => patchChild(index, { excerpt: event.target.value })}
                  />
                </label>
                <ProjectMediaField images={child.images} onChange={(images) => patchChild(index, { images })} />
                <button
                  type="button"
                  className="text-sm text-red-300"
                  onClick={() => patch({ children: draft.children.filter((_, i) => i !== index) })}
                >
                  Quitar esta parte
                </button>
              </div>
            ))}
            <button
              type="button"
              className="min-h-11 rounded-full border border-luxury-gold/40 px-4 text-sm text-luxury-gold"
              onClick={() => patch({ children: [...draft.children, emptyChild()] })}
            >
              Agregar una parte
            </button>
          </div>
        ) : null}
      </section>

      {draft.id ? (
        <section>
          <button type="button" className="text-sm text-luxury-muted" onClick={() => setShowLink((open) => !open)}>
            {showLink ? 'Ocultar el enlace' : 'Cambiar el enlace de la página'}
          </button>
          {showLink ? (
            <label className="mt-3 block text-sm text-paper">
              Enlace
              <span className="mt-1 block text-xs text-luxury-muted">
                Si lo cambias, el enlace anterior deja de abrir este proyecto.
              </span>
              <input
                className={fieldClass}
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  patch({ slug: event.target.value })
                }}
              />
            </label>
          ) : null}
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-2 border-t border-luxury-gold/30 bg-luxury-bg/95 px-[max(1rem,env(safe-area-inset-left))] pt-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={saving}
          className="min-h-12 w-full flex-1 rounded-full bg-luxury-gold px-6 text-base font-medium text-luxury-bg disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={requestClose} className="min-h-12 w-full px-4 text-sm text-luxury-muted sm:w-auto">
          Volver a la lista
        </button>
      </div>

      {draft.id ? (
        <button type="button" disabled={saving} onClick={() => void onDelete()} className="text-sm text-red-300">
          Quitar este proyecto de la página
        </button>
      ) : null}
    </form>
  )
}

function KindButton({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-2xl border px-4 py-4 text-left transition-colors',
        active ? 'border-luxury-gold bg-luxury-gold/15' : 'border-white/10 hover:border-white/25',
      ].join(' ')}
    >
      <span className="block text-base text-paper">{title}</span>
      <span className="mt-1 block text-sm leading-relaxed text-luxury-muted">{text}</span>
    </button>
  )
}

function ToggleCard({
  on,
  title,
  text,
  onClick,
}: {
  on: boolean
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={[
        'flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left',
        on ? 'border-luxury-gold/50 bg-luxury-gold/10' : 'border-white/10',
      ].join(' ')}
    >
      <span
        className={[
          'mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1',
          on ? 'bg-luxury-gold' : 'bg-white/15',
        ].join(' ')}
        aria-hidden
      >
        <span className={['h-5 w-5 rounded-full bg-white transition-transform', on ? 'translate-x-5' : ''].join(' ')} />
      </span>
      <span>
        <span className="block text-base text-paper">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-luxury-muted">{text}</span>
      </span>
    </button>
  )
}

export function newProjectDraft(kind: TrabajoPortfolioKind): ProjectDraft {
  return emptyDraft(kind)
}
