import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al cambiar de ruta, el scroll del documento no se reinicia solo; el usuario
 * ve la nueva vista desplazada. Aquí volvemos arriba salvo URLs con hash, donde
 * hacemos scroll al ancla si existe el elemento.
 */
export function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const anchorId = location.hash.slice(1)
      if (anchorId) {
        const el = document.getElementById(anchorId)
        if (el) {
          const frame = requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'auto', block: 'start' })
          })
          return () => cancelAnimationFrame(frame)
        }
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return null
}
