import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { fetchRemoteDocuments, saveRemoteDocuments, type RemoteDocument } from './savedDocumentsRemote'

type Kind = 'cotizacion' | 'recibo'

type Options<T> = {
  kind: Kind
  readLocal: () => T[]
  writeLocal: (items: T[]) => void
  reviveList: (json: unknown) => T[]
}

export function usePostgresSavedLibrary<T extends RemoteDocument>({
  kind,
  readLocal,
  writeLocal,
  reviveList,
}: Options<T>): {
  savedList: T[]
  setSavedList: Dispatch<SetStateAction<T[]>>
  syncNote: string
} {
  const [savedList, setSavedList] = useState<T[]>(readLocal)
  const [syncNote, setSyncNote] = useState('Cargando biblioteca…')
  const hydrated = useRef(false)
  const remoteOk = useRef(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const local = readLocal()
      try {
        const remote = reviveList(await fetchRemoteDocuments(kind))
        if (cancelled) return
        const next = remote.length === 0 && local.length > 0 ? local : remote
        writeLocal(next)
        remoteOk.current = true
        hydrated.current = true
        setSavedList(next)
        setSyncNote('Guardado en Neon')
      } catch {
        if (cancelled) return
        remoteOk.current = false
        hydrated.current = true
        setSavedList(local)
        setSyncNote('No se pudo leer Neon. Se muestra la copia local.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [kind, readLocal, reviveList, writeLocal])

  useEffect(() => {
    if (!hydrated.current || !remoteOk.current) return
    writeLocal(savedList)
    const timer = setTimeout(() => {
      void saveRemoteDocuments(kind, savedList)
        .then(() => setSyncNote('Guardado en Neon'))
        .catch(() => {
          setSyncNote('No se pudo guardar en Neon. La copia local sigue en este navegador.')
        })
    }, 150)
    return () => clearTimeout(timer)
  }, [kind, savedList, writeLocal])

  return { savedList, setSavedList, syncNote }
}
