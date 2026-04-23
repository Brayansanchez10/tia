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

/** Una exhibición dentro de un trabajo agrupado (ej. líneas distintas para Cruz Verde). */
export type TrabajoChild = {
  /** Slug único dentro del padre → `/trabajos/{padre}/{slug}` */
  slug: string
  title: string
  dateLabel: string
  category: string
  excerpt: string
  paragraphs: readonly string[]
  images?: readonly string[]
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
  /** Cada string es un párrafo en la página del proyecto (orden de lectura). */
  paragraphs: readonly string[]
  /**
   * Galería del detalle (orden = orden de apilado en la columna visual).
   * Rutas bajo `public/`: imágenes (jpg, png, webp…) o vídeo (mp4, webm).
   * No uses a la vez `children` y esta galería en el mismo ítem: con `children`, el detalle es el hub.
   */
  images?: readonly string[]
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
  images?: readonly string[]
  image?: string
}

/** Portada de un hijo (tarjeta en el hub). */
export function trabajoChildCoverSrc(child: TrabajoChild): string | undefined {
  const fromImages = child.images?.find((s) => !trabajoMediaIsVideo(s))
  if (fromImages) return fromImages
  if (child.image && !trabajoMediaIsVideo(child.image)) return child.image
  return child.images?.[0] ?? child.image
}

/** Primera imagen para tarjetas del listado: prioriza foto sobre vídeo. */
export function trabajoCoverSrc(post: TrabajoPost): string | undefined {
  if (post.images?.length) {
    const img = post.images.find((s) => !trabajoMediaIsVideo(s))
    if (img) return img
  }
  if (post.image && !trabajoMediaIsVideo(post.image)) return post.image
  if (post.children?.[0]) return trabajoChildCoverSrc(post.children[0])
  return post.images?.[0] ?? post.image
}

/** Galería de imágenes/vídeos para un trabajo simple o un hijo. */
export function trabajoGallerySrcs(media: TrabajoMediaSource): readonly string[] {
  if (media.images?.length) return media.images
  if (media.image) return [media.image]
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
    heroTitle: 'Carpintería y ebanistería',
    heroLead:
      'Fabricamos muebles en línea para almacenes de cadena. Servicio de instalación. Nuestro lema: calidad y compromiso — dejando huella en nuestras fabricaciones.',
    ctaPrimary: { label: 'Ver trabajos', to: '/trabajos' },
    ctaSecondary: { label: 'Contactar', to: '/contacto' },
  },

  trabajos: {
    pageEyebrow: 'Portafolio',
    title: 'Trabajos realizados',
    /**
     * Trabajo simple: `images` + detalle en `/trabajos/{slug}`.
     * Trabajo agrupado: `children` + hub en `/trabajos/{slug}` y detalle en `/trabajos/{slug}/{hijo}`.
     */
    items: [
      {
        slug: 'Muebles para exibición',
        title: 'Muebles para exibición',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: ['Alcance del servicio: se realizó reubicación de estantería existente y montaje de nueva exhibición en gran superficie. Las actividades incluyeron trabajo en alturas certificado bajo Resolución 4272 de 2021. ',
          'El diseño del mobiliario y planograma fueron suministrado por el cliente, Nuestro equipo ejecutó el desmontaje, translado, instalación y ubicación del producto, según plano aprobado, garantizando cumplimiento normativo en seguridad, orden de la sala y entrega satisfacción dentro del cronograma establecido.',
        ],
        images: [
          '/img/trabajos/comerciales/exibicion/M4.jpeg',
          '/img/trabajos/comerciales/exibicion/M5.jpeg',
          '/img/trabajos/comerciales/exibicion/N6.jpeg',
          '/img/trabajos/comerciales/exibicion/M1.jpeg',
          '/img/trabajos/comerciales/exibicion/M2.jpeg',
          '/img/trabajos/comerciales/exibicion/M3.jpeg',
          '/img/trabajos/comerciales/exibicion/V1.mp4',
          '/img/trabajos/comerciales/exibicion/v2.mp4',
        ],
        paragraphs: [
          'Responsabildiades asumidas: Coordinación del personal y seguridad para trabajos en alturas, gestión de permisos de trabajo y ATS diarios, Verificación de EPP y sistemas de protección contra caídas, Aseguramiento de la correcta implementación del layout entregado por el cliente.',
        ],
      },
      {
        slug: 'Organización de espacios',
        title: 'Organización de espacios',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Servicio especializado de reorganización optimización de espacios comerciales, bajo estándares de seguridad según resolución 4271-2021',
        images: [
          '/img/trabajos/comerciales/ordenyespacio/M2.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M1.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M3.jpeg',
          '/img/trabajos/comerciales/ordenyespacio/M4.mp4',
        ],
        paragraphs: [
          'Responsabildiades asumidas: Coordinación del personal y seguridad para trabajos en alturas, gestión de permisos de trabajo y ATS diarios, Verificación de EPP y sistemas de protección contra caídas, Aseguramiento de la correcta implementación del layout entregado por el cliente.',
        ],
      },
      {
        slug: 'almacen',
        title: 'Mobiliario fabricado e instaldo por nosotros',
        dateLabel: 'Retail · cadena',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: ['Diseño proporcionado por el cliente. Nosotros nos encargamos de hacerlo realidad en almacén de gran formato. ',
          '¿Necesitas fabricación e instalación, Escribenos.?'
        ],
        images: [
          '/img/trabajos/comerciales/Almacen/M8.jpeg',
          '/img/trabajos/comerciales/Almacen/M6.jpeg',
          '/img/trabajos/comerciales/Almacen/M7.jpeg',
          '/img/trabajos/comerciales/Almacen/M2.jpeg',
          '/img/trabajos/comerciales/Almacen/M3.jpeg',
          '/img/trabajos/comerciales/Almacen/M4.jpeg',
          '/img/trabajos/comerciales/Almacen/M1.mp4',
        ],
        paragraphs: [
          'Proyecto comercial con registro fotográfico y vídeo del conjunto montado.',
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
        excerpt: 'Desarrollo de campaña de marketing y comunicación para una reconocida cadena de farmacias y droguerías de Colombia. Creamos contenido y estrategias para promover la salud y el bienestar en la comunidad.',
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
        title: 'Muebles',
        dateLabel: 'Retail ',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Desarrollo de campaña de marketing y comunicación para una reconocida cadena de farmacias y droguerías de Colombia. Creamos contenido y estrategias para promover la salud y el bienestar en la comunidad.',
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
        title: 'Estanterías',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Desarrollo de campaña de marketing y comunicación para una reconocida cadena de farmacias y droguerías de Colombia. Creamos contenido y estrategias para promover la salud y el bienestar en la comunidad.',
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
        excerpt: 'Diseño y desarrollo de mobiliario para cadena de tiendas por departamentos líder en Latinoamérica. Creamos soluciones innovadoras y funcionales para mejorar la experiencia de compra en tiendas físicas.',
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
        title: 'Isla',
        dateLabel: 'Retail',
        portfolioKind: 'corporativo',
        category: 'Comercial',
        excerpt: 'Desarrollo de campaña de marketing para una marca líder en la industria de la belleza y el cuidado personal. Creamos contenido y estrategias para promover productios innovadores y de alta calidad.',
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
        ],
        paragraphs: [
          'Secuencia ordenada de vanos y detalle de carpintería; cierre con vídeo.',
        ],
      },
    ] as TrabajoPost[],
  },

  services: {
    pageEyebrow: 'Lo que ofrecemos',
    title: 'Servicios',
    intro:
      'Diseño a medida, producción retail, montaje logístico, ebanistería especializada y mantenimiento: un ciclo completo para tu marca.',
    items: [
      {
        name: 'Diseño y Proyectos a Medida',
        tagline: 'Creatividad funcional para espacios únicos.',
        description:
          'Transformamos conceptos en planos técnicos y visuales. Desarrollamos mobiliario exclusivo que se adapta milimétricamente a las dimensiones y al ADN de tu marca o negocio.',
      },
      {
        name: 'Fabricación en Línea y Retail',
        tagline: 'Escalabilidad con acabados de alta gama.',
        description:
          'Especialistas en producción para almacenes de cadena. Optimizamos procesos estandarizados para garantizar calidad repetible en grandes volúmenes, sin perder la esencia de la ebanistería fina.',
      },
      {
        name: 'Instalación y Montaje Logístico',
        tagline: 'Ejecución impecable en el punto de destino.',
        description:
          'Contamos con un equipo experto para el ensamblaje en sitio. Nos encargamos de la logística y los acabados finales bajo la modalidad de «llave en mano», asegurando que todo quede listo para operar.',
      },
      {
        name: 'Trabajos Especializados y Ebanistería',
        tagline: 'El arte de los detalles complejos.',
        description:
          'Abordamos retos técnicos en madera, desde estructuras complejas hasta detalles ornamentales. Aplicamos técnicas de carpintería avanzada para piezas que requieren un nivel de precisión superior.',
      },
      {
        name: 'Reparación y Mantenimiento',
        tagline: 'Protegemos tu inversión a largo plazo.',
        description:
          'Servicio técnico post-venta para asegurar que el mobiliario mantenga su funcionalidad y estética original. Restauramos y ajustamos piezas para extender su vida útil en entornos de alto tráfico.',
      },
    ] satisfies readonly ServiceItem[],
  },

  about: {
    pageEyebrow: 'El taller',
    title: 'Nosotros',
    paragraphs: [
      'Nuestra carpintería y ebanistería se especializa en la fabricación de mobiliario de línea premium para almacenes de cadena y retail. Fusionamos la precisión industrial con el oficio tradicional para entregar a tiempo y con la mejor calidad.',
      'Bajo el sello «Marketing — Pop» y nuestro lema «Dejando huella», nos comprometemos a crear soluciones visibles y de alto impacto, garantizando una instalación seria y relaciones a largo plazo. Nuestra misión es reflejar la excelencia de su marca en cada pieza.',
      'Desde el primer trazo hasta la instalación final, ofrecemos un servicio integral diseñado para potenciar su presencia en el mercado. Descubra nuestra trayectoria y cómo podemos dar forma a sus ideas.',
    ],
  },

  contact: {
    pageEyebrow: 'Contáctanos',
    title: 'Contacto',
    intro:
      'Mismos números que en la tarjeta de presentación. Pulsa un contacto para abrir WhatsApp.',
    whatsappLines: [
      { display: '323 201 9974', href: 'https://wa.me/573232019974' },
      { display: '302 588 7010', href: 'https://wa.me/573025887010' },
      { display: '319 726 6104', href: 'https://wa.me/573197266104' },
    ] satisfies readonly WhatsappLine[],
    email: 'csmarketingdejandohuella@gmail.com',
    address: 'KR 14 C NO 93 SUR 02',
    hours: 'Horarios de 7 a 5 lunes a sabado',
  },

  footer: {
    note: 'Carpintería y ebanistería · Marketing — Pop · Dejando huella.',
    ctaEyebrow: '¿Listo para empezar?',
    ctaLead: 'Cuéntanos tu proyecto retail o de instalación y te respondemos.',
    ctaButton: { label: 'Contacto', to: '/contacto' },
  },
} as const
