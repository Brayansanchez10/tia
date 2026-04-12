/** Textos y datos del sitio: edita aquí el contenido informativo. */

export type NavItem = { to: string; label: string }

/**
 * Un trabajo del portafolio. Los clientes ven lo que añadas en `site.trabajos.items`
 * (este archivo). Tras editar, vuelve a generar el sitio (`npm run build`) y súbelo.
 */
export type TrabajoPost = {
  /** Identificador único en URL: solo minúsculas, números y guiones. Ej: `cocina-roble` → /trabajos/cocina-roble */
  slug: string
  title: string
  /** Línea corta bajo el título (fecha, año o ciudad). */
  dateLabel: string
  category: string
  /** Texto que aparece en la tarjeta del listado y como entradilla en el detalle. */
  excerpt: string
  /** Cada string es un párrafo en la página del proyecto (orden de lectura). */
  paragraphs: readonly string[]
  /**
   * Galería del detalle (orden = orden de apilado en la columna izquierda).
   * Si existe y tiene entradas, sustituye a `image` en la página del proyecto.
   * Rutas públicas bajo `public/` (ej. `['/fotos/cocina-1.jpg', '/fotos/cocina-2.jpg']`).
   */
  images?: readonly string[]
  /**
   * Opcional. Portada en el listado y única imagen en el detalle si no usas `images`.
   * Ej.: `public/fotos/cocina.jpg` → `image: '/fotos/cocina.jpg'`.
   */
  image?: string
}

/** Primera imagen para tarjetas del listado: `images[0]` o `image`. */
export function trabajoCoverSrc(post: TrabajoPost): string | undefined {
  return post.images?.[0] ?? post.image
}

/** Todas las URLs de galería para la página de detalle (puede ser vacío). */
export function trabajoGallerySrcs(post: TrabajoPost): readonly string[] {
  if (post.images?.length) return post.images
  if (post.image) return [post.image]
  return []
}

export const site = {
  brand: 'Carpintería Ejemplo',
  tagline: 'Muebles a medida y acabados en madera',
  /**
   * Logo izquierda del menú. Pon la ruta del archivo dentro de `public/`
   * (ej. "/logo.svg" si el archivo es `public/logo.svg`). Déjalo vacío para
   * un marcador dorado con iniciales del nombre hasta que tengas el logo.
   */
  logoSrc: '',

  nav: [
    { to: '/', label: 'Inicio' },
    { to: '/trabajos', label: 'Trabajos' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ] satisfies NavItem[],

  home: {
    /** Línea pequeña encima del título del hero (estilo referencia). */
    heroEyebrow: 'Carpintería y ebanistería hechas a medida',
    heroTitle: 'Artesanía en madera para tu hogar',
    heroLead:
      'Diseñamos y fabricamos piezas únicas con materiales de calidad y atención al detalle.',
    ctaPrimary: { label: 'Ver trabajos', to: '/trabajos' },
    ctaSecondary: { label: 'Contactar', to: '/contacto' },
    blocks: [
      {
        title: 'A medida',
        text: 'Cocinas, vestidores, puertas y mobiliario adaptado a tu espacio.',
      },
      {
        title: 'Materiales',
        text: 'Selección de maderas nobles, chapas y herrajes de primera.',
      },
      {
        title: 'Instalación',
        text: 'Montaje cuidadoso y acabados listos para usar.',
      },
    ],
  },

  trabajos: {
    pageEyebrow: 'Portafolio',
    title: 'Trabajos realizados',
    intro:
      'Estos proyectos se definen en el código (`src/content/site.ts`). Edita ese archivo o añade fotos en `public/` y vuelve a publicar el sitio para que los clientes vean los cambios.',
    /**
     * Añadir un trabajo: copia uno de los dos objetos de abajo, pégalo después de la coma
     * del último, cambia `slug` (debe ser único) y el resto de campos. Opcional: `image` o `images`.
     */
    items: [
      {
        slug: 'ejemplo-cocina-a-medida',
        title: 'Ejemplo: cocina a medida',
        dateLabel: 'Guía · reemplaza por tu fecha',
        category: 'Cocinas',
        excerpt:
          'Texto corto que verán en la tarjeta del listado. Describe en una o dos frases el proyecto.',
        // Cuando tengas la foto en public/, descomenta y ajusta la ruta:
        // image: '/fotos/mi-cocina.jpg',
        paragraphs: [
          'Primer párrafo del detalle: qué pidió el cliente, materiales destacados, plazo aproximado, etc.',
          'Segundo párrafo (opcional): puedes añadir todos los strings que quieras al array `paragraphs`.',
          'Para varias fotos en el detalle, define images como array de rutas bajo public/. Con una sola, basta image o images con un único elemento.',
        ],
      },
      {
        slug: 'ejemplo-mueble-salon',
        title: 'Ejemplo: mueble de salón',
        dateLabel: 'Guía · otra categoría',
        category: 'Mobiliario',
        excerpt:
          'Otro ejemplo con distinta categoría. El `slug` no debe repetirse con ningún otro trabajo.',
        paragraphs: [
          'Si solo necesitas un bloque de texto, deja un único string en `paragraphs`.',
        ],
      },
    ] as TrabajoPost[],
  },

  services: {
    pageEyebrow: 'Lo que ofrecemos',
    title: 'Servicios',
    intro:
      'Trabajamos contigo desde la idea hasta la entrega. Estos son los bloques principales de lo que ofrecemos.',
    items: [
      {
        name: 'Diseño y presupuesto',
        description:
          'Visita, medición y propuesta clara con plazos y materiales definidos.',
      },
      {
        name: 'Fabricación en taller',
        description:
          'Corte, ensamblaje y barnizado con control de calidad en cada etapa.',
      },
      {
        name: 'Reformas y restauración',
        description:
          'Actualización de muebles existentes y recuperación de piezas antiguas.',
      },
    ],
  },

  about: {
    pageEyebrow: 'El taller',
    title: 'Nosotros',
    paragraphs: [
      'Somos un taller familiar con años de experiencia en carpintería fina y mobiliario a medida.',
      'Nos importa el encaje perfecto en tu vivienda o negocio, la durabilidad de las uniones y un servicio cercano.',
      'Sustituye este texto por la historia real de la empresa cuando la tengas.',
    ],
  },

  contact: {
    pageEyebrow: 'Hablemos',
    title: 'Contacto',
    intro: 'Escríbenos o llámanos; actualiza estos datos con los reales de la empresa.',
    phone: '+57 300 000 0000',
    email: 'hola@carpinteria-ejemplo.com',
    address: 'Calle 00 # 00-00, Ciudad',
    hours: 'Lunes a viernes 8:00–18:00',
  },

  footer: {
    note: 'Sitio informativo. Los datos de contacto son de ejemplo.',
    ctaEyebrow: '¿Listo para empezar?',
    ctaLead: 'Cuéntanos tu idea y te asesoramos sin compromiso.',
    ctaButton: { label: 'Contacto', to: '/contacto' },
  },
} as const
