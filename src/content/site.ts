/** Textos y datos del sitio: edita aquí el contenido informativo. */

export type NavItem = { to: string; label: string }

export type WhatsappLine = {
  display: string
  href: string
}

export type ServiceItem = {
  name: string
  tagline: string
  description: string
}

/** Una pieza de galería: ruta simple o objeto con etiqueta opcional (ej. Antes / Después). */
export type TrabajoMediaItem =
  | string
  | {
      src: string
      /** Etiqueta visible sobre la imagen o el vídeo en la galería. */
      badge?: string
    }

export type TrabajoGallerySlide = {
  src: string
  badge?: string
}

export function trabajoMediaSrc(item: TrabajoMediaItem): string {
  return typeof item === 'string' ? item : item.src
}

export function trabajoMediaBadge(item: TrabajoMediaItem): string | undefined {
  if (typeof item === 'string') return undefined
  const b = item.badge?.trim()
  return b || undefined
}

/** Una exhibición dentro de un trabajo agrupado (ej. líneas distintas para Cruz Verde). */
export type TrabajoChild = {
  /** Slug único dentro del padre → `/trabajos/{padre}/{slug}` */
  slug: string
  title: string
  dateLabel: string
  category: string
  excerpt: string
  /** Características visibles en la ficha (materiales, alcance, etc.). */
  highlights?: readonly string[]
  paragraphs: readonly string[]
  images?: readonly TrabajoMediaItem[]
  image?: string
}

/** Agrupa en `/trabajos/portafolio/corporativo` o `/trabajos/portafolio/residencial` (no en la portada de /trabajos). */
export type TrabajoPortfolioKind = 'corporativo' | 'residencial'

/**
 * Un trabajo del portafolio. Los clientes ven lo que añadas en `site.trabajos.items`
 * (este archivo). Tras editar, vuelve a generar el sitio (`npm run build`) y súbelo.
 *
 * Cómo añadir un trabajo nuevo:
 * 1. Copia un bloque existente (simple o con `children`) y cambia `slug` (único, minúsculas y guiones).
 * 2. Pon `portfolioKind: 'corporativo'` o `'residencial'` (aparece en `/trabajos/portafolio/{corporativo|residencial}`).
 * 3. Sube fotos a `public/img/...` y referencia con rutas `/img/...`.
 * 4. Proyecto simple: `images` o `image` + `paragraphs` → abre en `/trabajos/{slug}`.
 * 5. Proyecto con varias piezas: define `children[]`; `/trabajos/{slug}` será el índice y cada hijo en `/trabajos/{slug}/{hijo}`.
 */
export type TrabajoPost = {
  /** Identificador único en URL: solo minúsculas, números y guiones. Ej: `cocina-roble` → /trabajos/cocina-roble */
  slug: string
  title: string
  /** Línea corta bajo el título (fecha, año o ciudad). */
  dateLabel: string
  /** Segmentación principal en la vista de trabajos (dos columnas visuales). */
  portfolioKind: TrabajoPortfolioKind
  /** Etiqueta en la tarjeta (marca, tipo de mueble, ambiente). */
  category: string
  /** Texto que aparece en la tarjeta del listado y como entradilla en el detalle. */
  excerpt: string
  /** Características cortas para la ficha (máx. 3–4). Solo datos reales del proyecto. */
  highlights?: readonly string[]
  /** Cada string es un párrafo en la página del proyecto (orden de lectura). */
  paragraphs: readonly string[]
  /**
   * Galería del detalle (orden = orden de apilado en la columna visual).
   * Rutas bajo `public/`: imágenes (jpg, png, webp…) o vídeo (mp4, webm).
   * Cada entrada puede ser una ruta o `{ src, badge }` (ej. badge: «Antes» / «Después»).
   * No uses a la vez `children` y esta galería en el mismo ítem: con `children`, el detalle es el hub.
   */
  images?: readonly TrabajoMediaItem[]
  /**
   * Opcional. Portada en el listado y única imagen en el detalle si no usas `images`.
   * Ej.: `public/fotos/cocina.jpg` → `image: '/fotos/cocina.jpg'`.
   * Con `children`, suele ser la portada del grupo (tarjeta en /trabajos).
   */
  image?: string
  /**
   * Si existe, `/trabajos/{slug}` abre un índice y cada hijo vive en `/trabajos/{slug}/{hijo}`.
   */
  children?: readonly TrabajoChild[]
}

export type TrabajoMediaSource = {
  images?: readonly TrabajoMediaItem[]
  image?: string
}

/** Portada de un hijo (tarjeta en el hub). */
export function trabajoChildCoverSrc(child: TrabajoChild): string | undefined {
  const fromImages = child.images?.find((item) => !trabajoMediaIsVideo(trabajoMediaSrc(item)))
  if (fromImages) return trabajoMediaSrc(fromImages)
  if (child.image && !trabajoMediaIsVideo(child.image)) return child.image
  const first = child.images?.[0]
  return first ? trabajoMediaSrc(first) : child.image
}

/** Primera imagen para tarjetas del listado: prioriza foto sobre vídeo. */
export function trabajoCoverSrc(post: TrabajoPost): string | undefined {
  if (post.images?.length) {
    const img = post.images.find((item) => !trabajoMediaIsVideo(trabajoMediaSrc(item)))
    if (img) return trabajoMediaSrc(img)
  }
  if (post.image && !trabajoMediaIsVideo(post.image)) return post.image
  if (post.children?.[0]) return trabajoChildCoverSrc(post.children[0])
  const first = post.images?.[0]
  return first ? trabajoMediaSrc(first) : post.image
}

/** Galería de imágenes/vídeos para un trabajo simple o un hijo. */
export function trabajoGallerySrcs(media: TrabajoMediaSource): readonly TrabajoGallerySlide[] {
  if (media.images?.length) {
    return media.images.map((item) => ({
      src: trabajoMediaSrc(item),
      badge: trabajoMediaBadge(item),
    }))
  }
  if (media.image) return [{ src: media.image }]
  return []
}

/** Resuelve padre + hijo para rutas `/trabajos/:parent/:child`. */
export function findTrabajoChild(
  parentSlug: string,
  childSlug: string,
): { parent: TrabajoPost; child: TrabajoChild } | undefined {
  const parent = site.trabajos.items.find((p) => p.slug === parentSlug)
  if (!parent?.children?.length) return undefined
  const child = parent.children.find((c) => c.slug === childSlug)
  if (!child) return undefined
  return { parent, child }
}

/** Vídeo embebido en la galería (mp4, webm, ogg). */
export function trabajoMediaIsVideo(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src)
}

/** Normaliza excerpt (histórico: a veces llegó como array). */
export function trabajoExcerptText(excerpt: string | readonly string[]): string {
  if (typeof excerpt === 'string') return excerpt.trim()
  return excerpt.map((p) => p.trim()).filter(Boolean).join(' ')
}

/** Cantidad de piezas en galería (imagen + vídeo). */
export function trabajoMediaCount(post: TrabajoPost | TrabajoChild): number {
  if (post.images?.length) return post.images.length
  if (post.image) return 1
  return 0
}

export const site = {
  /** Nombre comercial principal (cabecera y pie). */
  brand: 'Marketing — Pop',
  /** Eslogan bajo el nombre en la cabecera. */
  tagline: 'Dejando huella',
  /**
   * Iniciales del recuadro del logo cuando no hay `logoSrc`.
   * Tarjeta: “CS”.
   */
  logoInitials: 'CS',
  /**
   * Logo en la cabecera. Ruta bajo `public/` (archivo en `public/img/...` → `/img/...`).
   */
  logoSrc: '/img/LogoSinFondo.png',

  nav: [
    { to: '/#inicio', label: 'Inicio' },
    { to: '/trabajos', label: 'Trabajos' },
    { to: '/#servicios', label: 'Servicios' },
    { to: '/#nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ] satisfies NavItem[],

  home: {
    /** Línea pequeña encima del título; se usa como `alt` de `heroEyebrowImage`. */
    heroEyebrow: 'Marketing — Pop',
    /** Chip / icono encima del título en la home (`public/img/...` → `/img/...`). Vacío = solo texto. */
    heroEyebrowImage: '/img/FondoWeb.png',
    /** Marca como señal hero (prioridad visual sobre el subtítulo). */
    heroBrand: 'Marketing — Pop',
    heroTitle: 'Mobiliario retail e instalación que deja marca',
    heroLead:
      'Diseñamos, fabricamos e instalamos muebles y exhibidores para puntos de venta, almacenes de cadena y espacios a medida. Calidad, compromiso y acabados que se notan.',
    ctaPrimary: { label: 'Ver proyectos', to: '/trabajos' },
    ctaSecondary: { label: 'Solicitar cotización', to: '/contacto' },
    featuredHeading: 'Proyectos que hablan por nosotros',
    featuredLead: 'Una selección de trabajos comerciales y residenciales. Entra a cada ficha para ver la galería completa.',
    featuredCta: { label: 'Ver todo el portafolio', to: '/trabajos' },
    /** Slugs destacados en la home (orden = orden de aparición). */
    featuredSlugs: [
      'Stand 2',
      'Reubicación y Organización de Espacios Comerciales',
      'exhibidores de alto impacto',
      'cocina-integral',
      'Estanterías',
      'diseno-oculto',
    ] as const,
  },

  trabajos: {
    pageEyebrow: 'Portafolio',
    title: 'Nuestros proyectos',
    intro:
      'Explora trabajos comerciales y residenciales: stands, exhibidores, estanterías, cocinas y piezas a medida. Elige una categoría o abre cualquier proyecto.',
    /**
     * Trabajo simple: `images` + detalle en `/trabajos/{slug}`.
     * Trabajo agrupado: `children` + hub en `/trabajos/{slug}` y detalle en `/trabajos/{slug}/{hijo}`.
     */
    items: [
      {
        slug: 'Reubicación y Organización de Espacios Comerciales',
        title: 'Reubicación de espacio comercial',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Reubicamos y organizamos el punto de venta para mejorar la experiencia de compra y la visibilidad de marca: madera, color e iluminación alineados.',
        highlights: ['Reacomodo de góndola', 'Rotulación y planograma', 'Antes / después documentado'],
        images: [
          '/img/trabajos/comerciales/nescafe/M1.jpeg',
          '/img/trabajos/comerciales/nescafe/M3.jpeg',
          '/img/trabajos/comerciales/nescafe/M4.jpeg',
          '/img/trabajos/comerciales/nescafe/M5.jpeg',
          '/img/trabajos/comerciales/nescafe/M6.jpeg',
          '/img/trabajos/comerciales/nescafe/V1.mp4',
          { src: '/img/trabajos/comerciales/nescafe/M7.jpeg', badge: 'Antes' },
          { src: '/img/trabajos/comerciales/nescafe/V2.mp4', badge: 'Antes' },
          { src: '/img/trabajos/comerciales/nescafe/V3.mp4', badge: 'Después' },
        ],
        paragraphs: [
          'Transformamos el espacio para que el producto se vea, se encuentre y se compre con facilidad: reacomodo, rotulación y orden de sala con el mismo cuidado que en cada instalación.',
        ],
      },
      {
        slug: 'Stand 2',
        title: 'Stand de exhibición para feria',
        dateLabel: 'Retail · feria',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Stand de exhibición para feria comercial en madera, metal y acrílico: diseño, fabricación y montaje pensados para destacar marca y producto.',
        highlights: ['Diseño y fabricación', 'Madera, metal y acrílico', 'Montaje en sitio'],
        images: [
          '/img/trabajos/comerciales/Stan2/ST1.mp4',
          '/img/trabajos/comerciales/Stan2/ST2.jpeg',
          '/img/trabajos/comerciales/Stan2/ST3.jpeg',
          '/img/trabajos/comerciales/Stan2/ST4.jpeg',
          '/img/trabajos/comerciales/Stan2/ST5.jpeg',
          '/img/trabajos/comerciales/Stan2/ST6.jpeg',
          '/img/trabajos/comerciales/Stan2/T2.jpeg',
          '/img/trabajos/comerciales/Stan2/T3.jpeg',
          '/img/trabajos/comerciales/Stan2/T4.jpeg',
          '/img/trabajos/comerciales/Stan2/TP8.mp4',
          '/img/trabajos/comerciales/Stan2/TS7.jpeg',
        ],
        paragraphs: [
          'Stand de exhibición para feria comercial: diseño, fabricación y montaje en sitio.',
        ],
      },
      {
        slug: 'Stand',
        title: 'Stand comercial de feria',
        dateLabel: 'Retail · feria',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Stand de exhibición para feria en madera, metal y acrílico. Mobiliario atractivo y funcional para destacar la marca en el evento.',
        highlights: ['Feria comercial', 'Madera, metal y acrílico', 'Detalle de acabados'],
        images: [
          '/img/trabajos/comerciales/JOX/ST1.mp4',
          '/img/trabajos/comerciales/JOX/ST2.jpeg',
          '/img/trabajos/comerciales/JOX/ST3.mp4',
          '/img/trabajos/comerciales/JOX/ST4.jpeg',
          '/img/trabajos/comerciales/JOX/ST5.jpeg',
          '/img/trabajos/comerciales/JOX/ST6.jpeg',
          '/img/trabajos/comerciales/JOX/ST7.jpeg',
          '/img/trabajos/comerciales/JOX/ST8.mp4',
          '/img/trabajos/comerciales/JOX/ST9.jpeg',
          '/img/trabajos/comerciales/JOX/ST10.mp4',
          '/img/trabajos/comerciales/JOX/ST11.jpeg',
          '/img/trabajos/comerciales/JOX/ST12.jpeg',
          '/img/trabajos/comerciales/JOX/ST13.mp4',
          '/img/trabajos/comerciales/JOX/M1.jpeg',
          '/img/trabajos/comerciales/JOX/M2.jpeg',
          '/img/trabajos/comerciales/JOX/M3.jpeg',
          '/img/trabajos/comerciales/JOX/V1.mp4',
          '/img/trabajos/comerciales/JOX/V2.mp4',
          '/img/trabajos/comerciales/JOX/V3.mp4',
          '/img/trabajos/comerciales/JOX/M4.jpeg',
          '/img/trabajos/comerciales/JOX/M5.jpeg',
        ],
        paragraphs: [
          'Proyecto de stand con atención al detalle en estructura, acabados y presentación en feria.',
        ],
      },
      {
        slug: 'exhibidores de alto impacto',
        title: 'Exhibidores de alto impacto',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Ensamble preciso de cada componente para que el producto se exhiba a la altura de su calidad.',
        highlights: ['Ensamble técnico', 'Verificación funcional', 'Acabado de exhibición'],
        images: [
          '/img/trabajos/comerciales/griferia/m2.jpeg',
          '/img/trabajos/comerciales/griferia/m3.jpeg',
          '/img/trabajos/comerciales/griferia/m1.jpeg',
          '/img/trabajos/comerciales/griferia/m4.jpeg',
          '/img/trabajos/comerciales/griferia/m6.jpeg',
          '/img/trabajos/comerciales/griferia/m5.jpeg',
          '/img/trabajos/comerciales/griferia/v1.mp4',
        ],
        paragraphs: [
          'Exhibidores con ensamble técnico y verificación funcional pieza a pieza. La misma disciplina que aplicamos en farma la llevamos a todos los sectores.',
        ],
      },
      {
        slug: 'Islas exhibición',
        title: 'Islas de exhibición',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Islas POP listas para producción en volumen, con el mismo estándar de calidad en cada unidad.',
        highlights: ['Producción en serie', 'Acabados consistentes', 'Listas para instalación'],
        images: [
          '/img/trabajos/comerciales/azules/m2.jpeg',
          '/img/trabajos/comerciales/azules/m4.jpeg',
          '/img/trabajos/comerciales/azules/m6.jpeg',
          '/img/trabajos/comerciales/azules/m1.jpeg',
          '/img/trabajos/comerciales/azules/m3.jpeg',
          '/img/trabajos/comerciales/azules/m7.jpeg',
          '/img/trabajos/comerciales/azules/m5.jpeg',
          '/img/trabajos/comerciales/azules/m8.jpeg',
          '/img/trabajos/comerciales/azules/m9.jpeg',
          '/img/trabajos/comerciales/azules/v1.mp4',
        ],
        paragraphs: [
          'Fabricación de islas de exhibición con calidad repetible para campañas POP de alto volumen.',
        ],
      },
      {
        slug: 'Muebles para exibición',
        title: 'Montaje de exhibición en gran superficie',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Reubicación de estantería existente y montaje de nueva exhibición en gran superficie, con trabajo en alturas certificado (Res. 4272 de 2021).',
        highlights: ['Trabajo en alturas certificado', 'Desmontaje y traslado', 'Instalación según plano'],
        images: [
          '/img/trabajos/comerciales/exibicion/M4.jpeg',
          '/img/trabajos/comerciales/exibicion/M5.jpeg',
          '/img/trabajos/comerciales/exibicion/N6.jpeg',
          '/img/trabajos/comerciales/exibicion/M1.jpeg',
          '/img/trabajos/comerciales/exibicion/M2.jpeg',
          '/img/trabajos/comerciales/exibicion/M3.jpeg',
          '/img/trabajos/comerciales/exibicion/V1.mp4',
          '/img/trabajos/comerciales/exibicion/v2.mp4',
          '/img/trabajos/comerciales/exibicion/MX1.jpeg',
          '/img/trabajos/comerciales/exibicion/MX2.jpeg',
          '/img/trabajos/comerciales/exibicion/MX3.jpeg',
          '/img/trabajos/comerciales/exibicion/MX4.jpeg',
        ],
        paragraphs: [
          'El diseño del mobiliario y el planograma fueron suministrados por el cliente. Nuestro equipo ejecutó el desmontaje, traslado, instalación y ubicación del producto según plano aprobado, con cumplimiento normativo en seguridad y entrega dentro del cronograma.',
          'Coordinación de personal y seguridad para trabajos en alturas, gestión de permisos y ATS diarios, verificación de EPP y sistemas de protección contra caídas, e implementación del layout entregado por el cliente.',
        ],
      },
      {
        slug: 'Organización de espacios',
        title: 'Organización de espacios comerciales',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Reorganización y optimización de espacios comerciales bajo estándares de seguridad (Res. 4272 de 2021).',
        highlights: ['Optimización de sala', 'Seguridad en alturas', 'Layout del cliente'],
        images: [
          '/img/trabajos/comerciales/ordenyespacio/M2.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M1.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M3.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M4.mp4',
        ],
        paragraphs: [
          'Coordinación de personal y seguridad para trabajos en alturas, gestión de permisos y ATS diarios, verificación de EPP y sistemas de protección contra caídas, e implementación del layout entregado por el cliente.',
        ],
      },
      {
        slug: 'almacen',
        title: 'Mobiliario fabricado e instalado',
        dateLabel: 'Retail · cadena',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt:
          'Diseño del cliente, ejecución nuestra: fabricación e instalación en almacén de gran formato.',
        highlights: ['Fabricación a medida', 'Instalación en almacén', 'Gran formato'],
        images: [
          '/img/trabajos/comerciales/Almacen/M8.jpeg',
          '/img/trabajos/comerciales/Almacen/M6.jpeg',
          '/img/trabajos/comerciales/Almacen/M7.jpeg',
          '/img/trabajos/comerciales/Almacen/M2.jpeg',
          '/img/trabajos/comerciales/Almacen/M3.jpeg',
          '/img/trabajos/comerciales/Almacen/M4.jpeg',
          '/img/trabajos/comerciales/Almacen/M1.mp4',
          '/img/trabajos/comerciales/JOX/ST14.mp4',
        ],
        paragraphs: [
          'Proyecto comercial con registro fotográfico y vídeo del conjunto montado. Si necesitas fabricación e instalación, escríbenos.',
        ],
      },
      {
        slug: 'Estanterías',
        title: 'Estanterías para almacenes',
        dateLabel: 'Retail · Colombia',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Instalación y diseño de estanterías para almacenes y puntos de venta. Creamos soluciones de almacenamiento eficientes y seguras para optimizar el espacio y mejorar la organización.',
        images: [
          '/img/trabajos/comerciales/AlmacenesAra/M2.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M1.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M5.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/m3.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M12.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M4.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M9.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M10.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M11.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M8.jpeg',
          '/img/trabajos/comerciales/AlmacenesAra/M6.mp4',
        ],
        paragraphs: [
          'Imagenes del progreso, instalación y finalización del proyecto.',
        ],
      },
      {
        slug: 'Punto de venta',
        title: 'Punto de venta',
        dateLabel: 'Retail · Cali',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Instalación y acabados en punto de venta.',
        images: [
          '/img/trabajos/comerciales/Cali/M1.jpeg',
          '/img/trabajos/comerciales/Cali/M2.jpeg',
          '/img/trabajos/comerciales/Cali/M3.jpeg',
          '/img/trabajos/comerciales/Cali/M4.jpeg',
          '/img/trabajos/comerciales/Cali/M5.jpeg',
          '/img/trabajos/comerciales/Cali/M6.jpeg',
          '/img/trabajos/comerciales/Cali/M7.jpeg',
          '/img/trabajos/comerciales/Cali/M8.jpeg',
          '/img/trabajos/comerciales/Cali/V1.mp4',
        ],
        paragraphs: [
          'Referencia visual del trabajo realizado, con recorrido en vídeo al final de la galería.',
        ],
      },
      {
        slug: 'Estanterías Cuidado Personal',
        title: 'Estanterías Cuidado Personal',
        dateLabel: 'Farmacia · POP',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Línea de estantería para cuidado personal: fabricación e instalación pensadas para retail farmacéutico.',
        highlights: ['Estantería retail', 'Acabados de sala', 'Foto y vídeo de conjunto'],
        images: [
          '/img/trabajos/comerciales/CruzEstanteria/mueble1.jpeg',
          '/img/trabajos/comerciales/CruzEstanteria/Mueble2.jpeg',
          '/img/trabajos/comerciales/CruzEstanteria/Mueble3.jpeg',
          '/img/trabajos/comerciales/CruzEstanteria/Mueble6.jpeg',
          '/img/trabajos/comerciales/CruzEstanteria/Mueble Video.mp4',
          '/img/trabajos/comerciales/CruzEstanteria/Mueble4.mp4',
        ],
        paragraphs: [
          'Línea de estantería con piezas en foto y vídeos de conjunto en taller o tienda.',
        ],
      },
      {
        slug: 'Muebles',
        title: 'Mobiliario dermocosmético',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Mobiliario de exhibición para zona dermocosmética: presentación clara del producto en punto de venta.',
        highlights: ['Exhibición dermocosmética', 'Acabados retail', 'Documentación en imagen y vídeo'],
        images: [
          '/img/trabajos/comerciales/dermocenter/M3.jpeg',
          '/img/trabajos/comerciales/dermocenter/M2.jpeg',
          '/img/trabajos/comerciales/dermocenter/M1.mp4',
          '/img/trabajos/comerciales/dermocenter/M4.mp4',
          '/img/trabajos/comerciales/dermocenter/M5.mp4',
        ],
        paragraphs: [
          'Documentación en imagen',
        ],
      },
      {
        slug: 'estanterias',
        title: 'Estanterías de sala',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Montaje de estanterías para punto de venta: organización, presencia y acabado de sala.',
        highlights: ['Montaje en sala', 'Organización de producto', 'Acabado final'],
        images: [
          '/img/trabajos/comerciales/Estanterias/m2.jpeg',
          '/img/trabajos/comerciales/Estanterias/M3.jpeg',
          '/img/trabajos/comerciales/Estanterias/M1.jpeg',
          '/img/trabajos/comerciales/Estanterias/M4.jpeg',
        ],
        paragraphs: [
          'Cuatro referencias del montaje final.',
        ],
      },
      {
        slug: 'Mobiliario',
        title: 'Mobiliario para cadena de tiendas',
        dateLabel: 'Retail · gran tienda',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Mobiliario para cadena de tiendas por departamentos: soluciones funcionales para mejorar la experiencia de compra en piso.',
        highlights: ['Cadena retail', 'Mobiliario de piso', 'Secuencia foto y vídeo'],
        images: [
          '/img/trabajos/comerciales/falabella/M3.jpeg',
          '/img/trabajos/comerciales/falabella/M6.jpeg',
          '/img/trabajos/comerciales/falabella/M2.jpeg',
          '/img/trabajos/comerciales/falabella/M5.jpeg',
          '/img/trabajos/comerciales/falabella/M4.jpeg',
          '/img/trabajos/comerciales/falabella/M1.jpeg',
          '/img/trabajos/comerciales/falabella/m7.mp4',
        ],
        paragraphs: [
          'Secuencia fotográfica y vídeo de cierre.',
        ],
      },
      {
        slug: 'Isla',
        title: 'Isla de belleza',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Isla de exhibición para marca de belleza y cuidado personal: presencia de producto con impacto visual en sala.',
        highlights: ['Isla POP', 'Belleza y cuidado', 'Galería con vídeo'],
        images: [
          '/img/trabajos/comerciales/Lorel/M3.jpeg',
          '/img/trabajos/comerciales/Lorel/M2.jpeg',
          '/img/trabajos/comerciales/Lorel/M1.jpeg',
          '/img/trabajos/comerciales/Lorel/M4.mp4',
        ],
        paragraphs: [
          'Galería con vídeo.',
        ],
      },
      {
        slug: 'Punto de venta para helados',
        title: 'Punto de venta para helados',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Creamos un estilo divertido y colorido para un punto de venta de helados, con mobiliario y decoración que atraen a clientes de todas las edades.',
        images: [
          '/img/trabajos/comerciales/popsy/M1.jpeg',
          '/img/trabajos/comerciales/popsy/M2.jpeg',
          '/img/trabajos/comerciales/popsy/M3.jpeg',
        ],
        paragraphs: [
          'Imagenes del punto de venta de helados.',
        ],
      },
      {
        slug: 'Muebles de venta',
        title: 'Muebles de venta',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Proyecto de diseño de mobiliario para un almacén de ventas al por mayor. Desarrollamos soluciones personalizadas para optimizar el espacio y mejorar la presentación de productos',
        images: [
          '/img/trabajos/comerciales/tiendasMetro/M5.jpeg',
          '/img/trabajos/comerciales/tiendasMetro/M6.jpeg',
          '/img/trabajos/comerciales/tiendasMetro/M1.jpeg',
          '/img/trabajos/comerciales/tiendasMetro/M2.jpeg',
          '/img/trabajos/comerciales/tiendasMetro/M4.jpeg',
          '/img/trabajos/comerciales/tiendasMetro/M3.mp4',
          '/img/trabajos/comerciales/tiendasMetro/M45.mp4',
        ],
        paragraphs: [
          'Recorrido fotográfico y vídeo del montaje.',
        ],
      },
      {
        slug: 'Cocina Muebles personalizados',
        title: 'Cocina Muebles personalizados',
        dateLabel: 'Hogar · cocina',
        portfolioKind: 'residencial',
        category: 'Cocina',
        excerpt: 'Cocina Muebles personalizados con diseño y funcionalidad.',
        images: [
          '/img/trabajos/residenciales/CocinaMueblePer/cm1.mp4',
          '/img/trabajos/residenciales/CocinaMueblePer/cm2.mp4',
          '/img/trabajos/residenciales/CocinaMueblePer/cm3.mp4',
          '/img/trabajos/residenciales/CocinaMueblePer/cm4.jpeg',
        ],
        paragraphs: [
          'Mejora en cocina con diseño y funcionalidad.',
        ],
      },
      {
        slug: 'Mejora en cocina',
        title: 'Mejora en cocina',
        dateLabel: 'Hogar · cocina',
        portfolioKind: 'residencial',
        category: 'Cocina',
        excerpt: 'Mejora en cocina con diseño y funcionalidad.',
        images: [
          '/img/trabajos/residenciales/NewCocina/Co3.jpeg',
          '/img/trabajos/residenciales/NewCocina/Co2.jpeg',
          '/img/trabajos/residenciales/NewCocina/Co1.jpeg',
          { src: '/img/trabajos/residenciales/NewCocina/Co4.jpeg', badge: 'Antes' },
        ],
        paragraphs: [
          'Mejora en cocina con diseño y funcionalidad.',
        ],
      },
      {
        slug: 'escritorio',
        title: 'Escritorio',
        dateLabel: 'Hogar · solución a medida',
        portfolioKind: 'residencial',
        category: 'Mobiliario',
        excerpt: 'Aquí se cotiza, se diseña, se aprueba y se celebra cada proyecto. Gracias a los clientes que confian en nuestro trabajo.',
        images: [
          '/img/trabajos/residenciales/escritorio/m1.jpeg',
          '/img/trabajos/residenciales/escritorio/v1.mp4',
          '/img/trabajos/residenciales/escritorio/v2.mp4',
        ],
        paragraphs: [
          'DEJANDO HUELLA desde el escritorio hasta el punto de venta.',
        ],
      },
      {
        slug: 'cocina-integral',
        title: 'Cocina integral',
        dateLabel: 'Hogar · cocina',
        portfolioKind: 'residencial',
        category: 'Cocina',
        excerpt: 'Diseño y fabricación de cocinas integrales personalizadas. Creamos soluciones funcionales y modernas para espacios de cocina, adaptándome a las necesidades y estilos de cada cliente',
        images: [
          '/img/trabajos/residenciales/cocinaIntegral/M7.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M1.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M2.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M3.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M4.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M5.jpeg',
          '/img/trabajos/residenciales/cocinaIntegral/M6.jpeg',
          
        ],
        paragraphs: [
          'Proyecto residencial cocina integral.',
        ],
      },
      {
        slug: 'cocina-integral-negra',
        title: 'Cocina integral — acabado oscuro',
        dateLabel: 'Hogar · cocina',
        portfolioKind: 'residencial',
        category: 'Cocina',
        excerpt: 'Diseño y fabricación de cocinas integrales personalizadas. Creamos soluciones funcionales y modernas para espacios de cocina, adaptándome a las necesidades y estilos de cada cliente.',
        images: [
          '/img/trabajos/residenciales/cocinaIntegralNegra/m4.png',
          '/img/trabajos/residenciales/cocinaIntegralNegra/M3.jpeg',
          '/img/trabajos/residenciales/cocinaIntegralNegra/M1.jpeg',
          '/img/trabajos/residenciales/cocinaIntegralNegra/M2.mp4',
        ],
        paragraphs: [
          'Fotografías del resultado y vídeo del ambiente.',
        ],
      },
      {
        slug: 'diseno-oculto',
        title: 'Diseño oculto',
        dateLabel: 'Hogar · solución a medida',
        portfolioKind: 'residencial',
        category: 'Mobiliario',
        excerpt: 'Mueble con diseño personalizado con sistema oculto y iluminación instalado en sitio.',
        images: [
          '/img/trabajos/residenciales/DiseñoOculto/M5.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/M1.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/M2.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/M3.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/M4.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/M6.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/M7.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/M8.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/V9.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/V10.mp4',
          '/img/trabajos/residenciales/DiseñoOculto/M11.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/M12.jpeg',
          '/img/trabajos/residenciales/DiseñoOculto/V17.mp4',
        ],
        paragraphs: [
          'Imagen fija del detalle y varios vídeos del funcionamiento y acabados.',
        ],
      },
      {
        slug: 'mueble-lavadero',
        title: 'Mueble de lavadero',
        dateLabel: 'Hogar · zona húmeda',
        portfolioKind: 'residencial',
        category: 'Lavadero',
        excerpt: 'Mueble auxiliar para área de lavado con espejo.',
        images: [
          '/img/trabajos/residenciales/muebleLavadero/M3.jpeg',
          '/img/trabajos/residenciales/muebleLavadero/M4.jpeg',
          '/img/trabajos/residenciales/muebleLavadero/M5.jpeg',
          '/img/trabajos/residenciales/muebleLavadero/M1.mp4',
          '/img/trabajos/residenciales/muebleLavadero/M2.mp4',
        ],
        paragraphs: [
          'Vistas del mueble instalado y vídeos de detalle.',
        ],
      },
      {
        slug: 'puertas',
        title: 'Puertas interior',
        dateLabel: 'Hogar · carpintería',
        portfolioKind: 'residencial',
        category: 'Puertas',
        excerpt: 'Puertas interiores de alta calidad diseñadas para brindar privacidad y estilo a cada habitación.',
        images: [
          '/img/trabajos/residenciales/puertas/M1.jpeg',
          '/img/trabajos/residenciales/puertas/M2.jpeg',
          '/img/trabajos/residenciales/puertas/M3.jpeg',
          '/img/trabajos/residenciales/puertas/M4.jpeg',
          '/img/trabajos/residenciales/puertas/M5.jpeg',
          '/img/trabajos/residenciales/puertas/M6.jpeg',
          '/img/trabajos/residenciales/puertas/M7.jpeg',
          '/img/trabajos/residenciales/puertas/M8.jpeg',
          '/img/trabajos/residenciales/puertas/M9.jpeg',
          '/img/trabajos/residenciales/puertas/M10.jpeg',
          '/img/trabajos/residenciales/puertas/M11.jpeg',
          '/img/trabajos/residenciales/puertas/M12.jpeg',
          '/img/trabajos/residenciales/puertas/M13.mp4',
          '/img/trabajos/residenciales/puertas/m14.jpeg',
          '/img/trabajos/residenciales/puertas/m16.jpeg',
          '/img/trabajos/residenciales/puertas/m17.jpeg',
          '/img/trabajos/residenciales/puertas/m18.jpeg',
          '/img/trabajos/residenciales/puertas/m15.jpeg',
          '/img/trabajos/residenciales/puertas/m19.mp4',
          '/img/trabajos/residenciales/puertas/P1.jpeg',
          '/img/trabajos/residenciales/puertas/P3.jpeg',
          '/img/trabajos/residenciales/puertas/P4.jpeg',
          '/img/trabajos/residenciales/puertas/PV1.mp4',
          '/img/trabajos/residenciales/puertas/PV2.mp4',
          '/img/trabajos/residenciales/puertas/p3.mp4',
          '/img/trabajos/residenciales/puertas/MARCO2.jpeg',
          '/img/trabajos/residenciales/puertas/MARCO1.mp4',
        ],
        paragraphs: [
          'Secuencia ordenada de vanos y detalle de carpintería; cierre con vídeo.',
        ],
      },
    ] as TrabajoPost[],
  },

  services: {
    pageEyebrow: 'Lo que hacemos',
    title: 'Servicios',
    intro:
      'Del diseño a la instalación: un ciclo completo para retail, POP y piezas a medida.',
    items: [
      {
        name: 'Diseño y proyectos a medida',
        tagline: 'De la idea al plano listo para fabricar.',
        description:
          'Convertimos conceptos en planos técnicos y visuales. Mobiliario que se adapta a las medidas del espacio y a la identidad de tu marca.',
      },
      {
        name: 'Fabricación en línea y retail',
        tagline: 'Volumen con acabados consistentes.',
        description:
          'Producción para almacenes de cadena y campañas POP. Procesos estandarizados para calidad repetible en grandes volúmenes, sin perder el oficio.',
      },
      {
        name: 'Instalación y montaje',
        tagline: 'Ensamble en sitio, listo para operar.',
        description:
          'Equipo propio para logística, ensamble y acabados finales. Modalidad llave en mano: dejamos el punto de venta listo.',
      },
      {
        name: 'Ebanistería especializada',
        tagline: 'Detalle donde importa.',
        description:
          'Retos técnicos en madera: estructuras complejas, ensambles precisos y acabados que sostienen el tráfico de sala.',
      },
      {
        name: 'Reparación y mantenimiento',
        tagline: 'Cuidamos lo que ya instalamos.',
        description:
          'Servicio post-venta para mantener funcionalidad y estética. Ajustes y restauración en entornos de alto uso.',
      },
    ] satisfies readonly ServiceItem[],
  },

  about: {
    pageEyebrow: 'Quiénes somos',
    title: 'Oficio, precisión e instalación seria',
    paragraphs: [
      'Somos carpintería y ebanistería especializada en mobiliario para retail, almacenes de cadena y espacios a medida. Combinamos oficio tradicional con procesos de producción para entregar a tiempo y con calidad.',
      'Bajo el sello Marketing — Pop y el lema «Dejando huella», fabricamos e instalamos soluciones visibles: stands, exhibidores, estanterías y piezas residenciales que reflejan la marca de nuestros clientes.',
      'Desde el primer trazo hasta el montaje final, acompañamos el proyecto completo. Si tienes un plano, un local o una idea, podemos darle forma.',
    ],
  },

  contact: {
    pageEyebrow: 'Hablemos',
    title: 'Contacto',
    intro:
      'Cuéntanos tu proyecto por WhatsApp o correo. Usamos los mismos datos de nuestra tarjeta de presentación.',
    whatsappLines: [
      { display: '323 201 9974', href: 'https://wa.me/573232019974' },
      { display: '302 588 7010', href: 'https://wa.me/573025887010' },
      { display: '319 726 6104', href: 'https://wa.me/573197266104' },
    ] satisfies readonly WhatsappLine[],
    email: 'csmarketingdejandohuella@gmail.com',
    address: 'KR 14 C NO 93 SUR 02',
    hours: 'Lunes a sábado, 7:00 a. m. – 5:00 p. m.',
  },

  footer: {
    note: 'Carpintería y ebanistería · Marketing — Pop · Dejando huella.',
    ctaEyebrow: '¿Tienes un proyecto en mente?',
    ctaLead: 'Escríbenos: coordinamos visita o llamada para tu retail, POP o pieza a medida.',
    ctaButton: { label: 'Ir a contacto', to: '/contacto' },
  },
} as const
