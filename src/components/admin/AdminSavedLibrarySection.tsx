import type { ReactNode } from 'react'

export type AdminSavedLibraryListItem = {
  id: string
  label: string
  updatedAt: string
  summary: string
}

type Props = {
  title: string
  description?: ReactNode
  items: AdminSavedLibraryListItem[]
  editingId: string | null
  nameDraft: string
  onNameDraftChange: (value: string) => void
  onSave: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  /** Si estás editando una tarjeta, permite desvincular para que el próximo Guardar cree otra entrada. */
  onDetachEditing?: () => void
  emptyHint?: string
}

function formatSavedAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

export function AdminSavedLibrarySection({
  title,
  description,
  items,
  editingId,
  nameDraft,
  onNameDraftChange,
  onSave,
  onEdit,
  onDelete,
  onDetachEditing,
  emptyHint = 'Aún no hay guardados. Rellena el formulario y pulsa Guardar.',
}: Props) {
  return (
    <section className="rounded-sm border border-luxury-gold/15 bg-luxury-bg/40 p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-luxury-gold/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-serif)] text-base text-paper sm:text-lg">{title}</h2>
          {description ? (
            <p className="mt-1 text-pretty text-xs leading-relaxed text-luxury-muted sm:text-sm">{description}</p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
          <label className="block min-w-0 flex-1 text-xs text-luxury-muted sm:max-w-xs">
            Nombre del guardado
            <input
              className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-sm text-paper outline-none focus:border-luxury-gold"
              value={nameDraft}
              onChange={(e) => onNameDraftChange(e.target.value)}
              placeholder="Ej. Cliente López — cocina"
            />
          </label>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {editingId && onDetachEditing ? (
              <button
                type="button"
                onClick={onDetachEditing}
                className="h-10 rounded-sm border border-luxury-gold/25 px-3 text-xs text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper"
              >
                Otro nuevo
              </button>
            ) : null}
            <button
              type="button"
              onClick={onSave}
              className="h-11 rounded-sm border border-luxury-gold/45 bg-luxury-gold/10 px-4 text-sm font-medium text-luxury-gold transition-colors hover:bg-luxury-gold/20 sm:h-10"
            >
              {editingId ? 'Actualizar guardado' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-luxury-muted">{emptyHint}</p>
      ) : (
        <ul className="mt-4 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const active = editingId === item.id
            return (
              <li
                key={item.id}
                className={`rounded-sm border p-4 transition-colors ${
                  active
                    ? 'border-luxury-gold/55 bg-luxury-gold/10'
                    : 'border-luxury-gold/20 bg-luxury-panel/40 hover:border-luxury-gold/35'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 font-[family-name:var(--font-serif)] text-sm font-medium text-paper">
                    {item.label}
                  </h3>
                  {active ? (
                    <span className="shrink-0 rounded-sm bg-luxury-gold/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-luxury-gold">
                      Editando
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-luxury-muted">{formatSavedAt(item.updatedAt)}</p>
                <p className="mt-2 line-clamp-2 text-xs text-paper/85">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    className="rounded-sm border border-luxury-gold/35 px-3 py-1.5 text-xs text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-sm border border-red-400/25 px-3 py-1.5 text-xs text-red-300/90 transition-colors hover:border-red-400/50 hover:text-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
