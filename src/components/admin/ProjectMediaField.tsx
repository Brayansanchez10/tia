import { useState } from 'react'
import { trabajoMediaIsVideo } from '@/content/site'
import { uploadPortfolioMedia } from '@/lib/cloudinary/uploadPortfolioMedia'
import type { MediaDraft } from '@/lib/portfolio/model'

type Props = {
  images: MediaDraft[]
  onChange: (images: MediaDraft[]) => void
}

export function ProjectMediaField({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlDraft, setUrlDraft] = useState('')
  const [showUrl, setShowUrl] = useState(false)

  async function onFiles(list: FileList | null) {
    const files = list ? Array.from(list) : []
    if (!files.length) return
    setUploading(true)
    setError(null)
    const added: MediaDraft[] = []
    try {
      for (const file of files) {
        const src = await uploadPortfolioMedia(file)
        added.push({ src, badge: '' })
      }
      onChange([...images, ...added])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo subir el archivo. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  function addUrl() {
    const src = urlDraft.trim()
    if (!src) return
    onChange([...images, { src, badge: '' }])
    setUrlDraft('')
    setShowUrl(false)
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir
    if (next < 0 || next >= images.length) return
    const copy = [...images]
    const [item] = copy.splice(index, 1)
    if (!item) return
    copy.splice(next, 0, item)
    onChange(copy)
  }

  return (
    <div className="space-y-4">
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-luxury-gold/40 bg-luxury-gold/5 px-4 py-8 text-center transition-colors hover:bg-luxury-gold/10">
        <span className="font-[family-name:var(--font-serif)] text-xl text-paper">
          {uploading ? 'Subiendo…' : 'Elegir fotos o videos'}
        </span>
        <span className="mt-2 max-w-sm text-sm leading-relaxed text-luxury-muted">
          Toca aquí y selecciona los archivos. La primera foto es la que se ve en la tarjeta.
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            void onFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p>
      ) : null}

      {images.length > 0 ? (
        <ul className="m-0 grid list-none gap-4 p-0">
          {images.map((item, index) => {
            const video = trabajoMediaIsVideo(item.src)
            return (
              <li key={`${item.src}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-luxury-bg">
                <div className="relative aspect-[4/3] bg-black/40">
                  {video ? (
                    <video src={item.src} className="h-full w-full object-cover" muted playsInline />
                  ) : (
                    <img src={item.src} alt="" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    {index === 0 ? 'Se ve en la tarjeta' : video ? 'Video' : 'Foto'}
                  </span>
                </div>
                <div className="space-y-3 p-3">
                  <label className="block text-sm text-paper">
                    Nota sobre la foto
                    <span className="mt-1 block text-xs text-luxury-muted">Opcional. Por ejemplo: Antes o Después.</span>
                    <input
                      className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-luxury-panel px-3 text-base text-paper outline-none focus:border-luxury-gold"
                      value={item.badge}
                      placeholder="Antes, Después…"
                      onChange={(event) => {
                        const next = [...images]
                        next[index] = { ...item, badge: event.target.value }
                        onChange(next)
                      }}
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      aria-label="Mover esta foto antes"
                      className="min-h-12 rounded-full border border-white/15 px-2 text-sm text-paper disabled:opacity-30"
                      onClick={() => move(index, -1)}
                    >
                      Antes
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      aria-label="Mover esta foto después"
                      className="min-h-12 rounded-full border border-white/15 px-2 text-sm text-paper disabled:opacity-30"
                      onClick={() => move(index, 1)}
                    >
                      Después
                    </button>
                    <button
                      type="button"
                      aria-label="Quitar esta foto"
                      className="min-h-12 rounded-full px-2 text-sm text-red-300"
                      onClick={() => onChange(images.filter((_, i) => i !== index))}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-luxury-muted">Todavía no hay fotos. Sin una foto, la tarjeta se ve vacía.</p>
      )}

      {showUrl ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="min-h-11 w-full rounded-xl border border-white/10 bg-luxury-bg px-3 text-base text-paper outline-none focus:border-luxury-gold"
            value={urlDraft}
            placeholder="Pega aquí el enlace de la foto"
            onChange={(event) => setUrlDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addUrl()
              }
            }}
          />
          <button
            type="button"
            onClick={addUrl}
            className="min-h-11 shrink-0 rounded-full bg-luxury-gold/15 px-4 text-sm text-luxury-gold"
          >
            Agregar
          </button>
        </div>
      ) : (
        <button type="button" className="text-sm text-luxury-muted underline-offset-2 hover:underline" onClick={() => setShowUrl(true)}>
          Ya tengo el enlace de una foto
        </button>
      )}
    </div>
  )
}
