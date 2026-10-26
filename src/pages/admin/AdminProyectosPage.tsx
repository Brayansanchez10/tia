import { useCallback, useEffect, useState } from 'react'
import { ProjectEditor, newProjectDraft } from '@/components/admin/ProjectEditor'
import { trabajoCoverSrc, trabajoExcerptText, trabajoMediaIsVideo, type TrabajoPortfolioKind } from '@/content/site'
import { fetchManagedProjects, reorderManagedProjects } from '@/lib/portfolio/portfolioClient'
import { draftFromPost, type ManagedProject, type ProjectDraft } from '@/lib/portfolio/model'

type Filter = 'todos' | TrabajoPortfolioKind

const filters: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'corporativo', label: 'Negocios' },
  { id: 'residencial', label: 'Casas' },
]

export function AdminProyectosPage() {
  const [items, setItems] = useState<ManagedProject[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('todos')
  const [draft, setDraft] = useState<ProjectDraft | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const next = await fetchManagedProjects()
    setItems(next)
    return next
  }, [])

  useEffect(() => {
    let cancelled = false
    void reload()
      .then(() => {
        if (!cancelled) setLoadError(null)
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setItems([])
          setLoadError(cause instanceof Error ? cause.message : 'No pudimos abrir tus proyectos. Intenta de nuevo.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [reload])

  const visible = (items ?? []).filter((item) => filter === 'todos' || item.data.portfolioKind === filter)

  function openNew() {
    setNotice(null)
    setDraft(newProjectDraft(filter === 'residencial' ? 'residencial' : 'corporativo'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openExisting(item: ManagedProject) {
    setNotice(null)
    setDraft(draftFromPost(item))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function move(id: string, dir: -1 | 1) {
    if (!items) return
    const current = visible.findIndex((item) => item.id === id)
    const neighbor = visible[current + dir]
    if (!neighbor) return
    const ids = items.map((item) => item.id)
    const from = ids.indexOf(id)
    const to = ids.indexOf(neighbor.id)
    if (from < 0 || to < 0) return
    const next = [...ids]
    next[from] = neighbor.id
    next[to] = id
    setBusyId(id)
    try {
      await reorderManagedProjects(next)
      await reload()
    } catch (cause) {
      setLoadError(cause instanceof Error ? cause.message : 'No se pudo cambiar el orden.')
    } finally {
      setBusyId(null)
    }
  }

  if (draft) {
    return (
      <div className="mx-auto w-full max-w-5xl px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:py-8">
        <ProjectEditor
          key={draft.id ?? 'new'}
          initial={draft}
          onCancel={() => setDraft(null)}
          onDeleted={() => {
            setDraft(null)
            setNotice('Proyecto quitado de la página.')
            void reload().catch((cause: unknown) => {
              setLoadError(cause instanceof Error ? cause.message : 'No se pudo actualizar la lista.')
            })
          }}
          onSaved={() => {
            void reload().catch(() => {
              setLoadError('Se guardó, pero no pudimos refrescar la lista.')
            })
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-paper sm:text-4xl">Mis trabajos</h1>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-luxury-muted">
            Toca una foto para cambiarla. El orden de estas tarjetas es el mismo que ven tus clientes.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="min-h-12 w-full rounded-full bg-luxury-gold px-5 text-base font-medium text-luxury-bg sm:w-auto"
        >
          Agregar proyecto
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar trabajos">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={[
              'min-h-11 rounded-full px-4 text-sm',
              filter === item.id ? 'bg-luxury-gold/20 text-luxury-gold' : 'bg-white/5 text-luxury-muted',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice ? (
        <p className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </p>
      ) : null}
      {loadError ? (
        <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{loadError}</p>
      ) : null}

      {items === null ? (
        <p className="mt-10 text-base text-luxury-muted">Estamos abriendo tus proyectos…</p>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-serif)] text-2xl text-paper">Todavía no hay proyectos aquí</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-luxury-muted">
            Agrega el primero con el botón de arriba. Solo necesitas un nombre, una frase y unas fotos.
          </p>
        </div>
      ) : (
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => {
            const cover = trabajoCoverSrc(item.data)
            const videoCover = Boolean(cover && trabajoMediaIsVideo(cover))
            return (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-luxury-panel">
                <button type="button" className="block w-full text-left" onClick={() => openExisting(item)}>
                  <span className="relative block aspect-[4/3] bg-black/30">
                    {cover && !videoCover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-luxury-muted">Sin foto</span>
                    )}
                    <span className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                        {item.data.portfolioKind === 'corporativo' ? 'Negocio' : 'Casa'}
                      </span>
                      {!item.published ? (
                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white">Oculto</span>
                      ) : null}
                      {item.featured ? (
                        <span className="rounded-full bg-luxury-gold px-3 py-1 text-xs text-luxury-bg">En el inicio</span>
                      ) : null}
                    </span>
                  </span>
                  <span className="block px-4 pb-2 pt-4">
                    <span className="block break-words font-[family-name:var(--font-serif)] text-xl leading-tight text-paper">
                      {item.data.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-luxury-muted">
                      {trabajoExcerptText(item.data.excerpt) || 'Sin frase todavía'}
                    </span>
                  </span>
                </button>
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    type="button"
                    className="min-h-11 flex-1 rounded-full border border-white/10 text-sm text-paper disabled:opacity-30"
                    disabled={busyId === item.id || index === 0}
                    onClick={() => void move(item.id, -1)}
                  >
                    Poner antes
                  </button>
                  <button
                    type="button"
                    className="min-h-11 flex-1 rounded-full border border-white/10 text-sm text-paper disabled:opacity-30"
                    disabled={busyId === item.id || index === visible.length - 1}
                    onClick={() => void move(item.id, 1)}
                  >
                    Poner después
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
