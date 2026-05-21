import { useCallback, useEffect, useRef, useState } from 'react'
import { isCloudinaryConfigured } from '@/lib/cloudinary/config'
import { uploadImageToCloudinary } from '@/lib/cloudinary/uploadImage'
import type { CotizacionReferenceImage } from '@/types/cotizacion'

type Props = {
  images: CotizacionReferenceImage[]
  sectionTitle: string
  onSectionTitleChange: (value: string) => void
  onChange: (images: CotizacionReferenceImage[]) => void
}

export function CotizacionReferenceImagesField({
  images,
  sectionTitle,
  onSectionTitleChange,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cloudinaryReady, setCloudinaryReady] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    void isCloudinaryConfigured().then((ok) => {
      if (!cancelled) setCloudinaryReady(ok)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const addImages = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
      if (!list.length) return

      setUploading(true)
      setError(null)
      const added: CotizacionReferenceImage[] = []

      try {
        for (const file of list) {
          const url = await uploadImageToCloudinary(file)
          added.push({ id: crypto.randomUUID(), url, caption: '' })
        }
        onChange([...images, ...added])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo subir la imagen')
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [images, onChange],
  )

  const remove = (id: string) => onChange(images.filter((img) => img.id !== id))

  const patchCaption = (id: string, caption: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, caption } : img)))
  }

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= images.length) return
    const copy = [...images]
    const [item] = copy.splice(index, 1)
    copy.splice(next, 0, item)
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      <label className="block text-luxury-muted">
        Título de la sección en el PDF
        <input
          className="mt-1 w-full rounded-sm border border-luxury-gold/25 bg-luxury-panel px-3 py-2 text-paper outline-none focus:border-luxury-gold"
          value={sectionTitle}
          onChange={(e) => onSectionTitleChange(e.target.value)}
          placeholder="Referencias"
        />
        <span className="mt-1 block text-[11px] text-luxury-muted/90">
          Si lo dejas vacío, en el PDF aparece «Referencias».
        </span>
      </label>

      {cloudinaryReady === false ? (
        <p className="rounded-sm border border-amber-400/30 bg-amber-950/30 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
          Para subir desde aquí configura en <code className="text-amber-50">.env</code>{' '}
          <code className="text-amber-50">CLOUDINARY_CLOUD_NAME</code>,{' '}
          <code className="text-amber-50">CLOUDINARY_API_KEY</code> y{' '}
          <code className="text-amber-50">CLOUDINARY_API_SECRET</code> (local: reinicia{' '}
          <code className="text-amber-50">npm run dev</code>; en Netlify: Site settings → Environment
          variables). La subida va por <code className="text-amber-50">/api/cloudinary/upload</code>.
          Mientras
          tanto puedes pegar URLs HTTPS con el botón de abajo.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files
            if (files?.length) void addImages(files)
          }}
        />
        <button
          type="button"
          disabled={cloudinaryReady !== true || uploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-10 rounded-sm border border-luxury-gold/40 bg-luxury-gold/10 px-3 text-sm text-luxury-gold transition-colors hover:bg-luxury-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? 'Subiendo…' : 'Subir imágenes'}
        </button>
        <button
          type="button"
          className="min-h-10 rounded-sm border border-luxury-gold/25 px-3 text-sm text-luxury-muted transition-colors hover:border-luxury-gold hover:text-paper"
          onClick={() => {
            const url = window.prompt('URL de la imagen (https://…)')
            if (!url?.trim()) return
            onChange([
              ...images,
              { id: crypto.randomUUID(), url: url.trim(), caption: '' },
            ])
          }}
        >
          Pegar URL
        </button>
      </div>

      {error ? (
        <p className="text-xs text-red-300/95" role="alert">
          {error}
        </p>
      ) : null}

      {images.length === 0 ? (
        <p className="text-xs text-luxury-muted">
          Sin imágenes de referencia. Se mostrarán al final del PDF, después de la firma.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {images.map((img, index) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-sm border border-luxury-gold/25 bg-luxury-panel/50"
            >
              <div className="relative aspect-[4/3] bg-zinc-900/80">
                <img
                  src={img.url}
                  alt={img.caption || `Referencia ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-2 p-3">
                <label className="block text-[11px] text-luxury-muted">
                  Pie (opcional)
                  <input
                    className="mt-1 w-full rounded-sm border border-luxury-gold/20 bg-luxury-bg px-2 py-1.5 text-xs text-paper outline-none focus:border-luxury-gold"
                    value={img.caption}
                    onChange={(e) => patchCaption(img.id, e.target.value)}
                    placeholder="Ej. Cocina roble — vista frontal"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded-sm border border-luxury-gold/25 px-2 py-1 text-[11px] text-luxury-muted disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded-sm border border-luxury-gold/25 px-2 py-1 text-[11px] text-luxury-muted disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(img.id)}
                    className="rounded-sm border border-red-400/25 px-2 py-1 text-[11px] text-red-300/90 hover:border-red-400/50"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
