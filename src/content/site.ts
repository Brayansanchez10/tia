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
  return child.images?.[0] ?? child.image
}

/** Primera imagen para tarjetas del listado: `images[0]`, `image` o primera portada de un hijo. */
export function trabajoCoverSrc(post: TrabajoPost): string | undefined {
  if (post.images?.[0]) return post.images[0]
  if (post.image) return post.image
  if (post.children?.[0]) return trabajoChildCoverSrc(post.children[0])
  return undefined
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
    { to: '/', label: 'Inicio' },
    { to: '/trabajos', label: 'Trabajos' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/nosotros', label: 'Nosotros' },
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
    intro:
      'Proyectos sueltos con galería directa, o agrupados por cliente (Cruz Verde) con subpáginas por exhibición.',
    /**
     * Trabajo simple: `images` + detalle en `/trabajos/{slug}`.
     * Trabajo agrupado: `children` + hub en `/trabajos/{slug}` y detalle en `/trabajos/{slug}/{hijo}`.
     */
    items: [
      {
        slug: 'exhibidores-cruz-verde',
        title: 'Exhibidores para Cruz Verde',
        dateLabel: 'Retail · Colombia',
        category: 'Cruz Verde',
        excerpt:
          'Varias exhibiciones de piso para farmacia: entra para ver cada línea (CeraVe, Eucerin) con su propia galería.',
        image: '/img/cruzverde/Exibidor.jpeg',
        paragraphs: [
          'Agrupamos aquí los exhibidores fabricados para puntos Cruz Verde. Cada tarjeta abre la galería y texto de esa exhibición concreta.',
        ],
        children: [
          {
            slug: 'cerave',
            title: 'Exhibición CeraVe',
            dateLabel: 'POP · vitrina',
            category: 'Cruz Verde',
            excerpt: 'Display vertical con estantes por tipo de piel, gráfica CeraVe y pieza de espuma en base.',
            images: [
              '/img/cruzverde/Exibidor.jpeg',
              '/img/cruzverde/exibidor1.jpeg',
              '/img/cruzverde/ExibidorVideo.mp4',
            ],
            paragraphs: [
              'Exhibidor de piso con jerarquía visual clara: cabecera de marca, surtido por segmentos y refuerzo de “nuevo” en estantería.',
              'Vídeo en taller / montaje para ver escala y acabados antes de tienda.',
            ],
          },
          {
            slug: 'eucerin',
            title: 'Exhibición Eucerin',
            dateLabel: 'POP · rutina',
            category: 'Cruz Verde',
            excerpt: 'Torre blanca con bins por paso (limpia / trata / protege) y gráfica de rutina Eucerin.',
            images: [
              '/img/cruzverde/Exibidor2.jpeg',
              '/img/cruzverde/Exibidor3.jpeg',
              '/img/cruzverde/ExibidorVideo2.mp4',
            ],
            paragraphs: [
              'Segundo frente para la misma cadena: piezas acrílicas, espejo oval y gráfica de agua para la línea de dermocosmética.',
              'Segundo clip en vídeo para ver el conjunto armado y detalle de cajones.',
            ],
          },
        ],
      },
      {
        slug: 'exibidor-jugos',
        title: 'Exhibidor jugos',
        dateLabel: 'Retail · bebidas',
        category: 'Exhibidores POP',
        excerpt: 'Mueble de piso para categoría jugos: líneas limpias y zona de impacto visual para marca.',
        images: [
          '/img/Exibidor Jugos/Jugos2.jpeg',
          '/img/Exibidor Jugos/jugos5.jpeg',
          '/img/Exibidor Jugos/Jugos6.jpeg',
          '/img/Exibidor Jugos/juegos7.jpeg',
          '/img/Exibidor Jugos/Video.mp4',
        ],
        paragraphs: [
          'Proyecto único con galería en una sola página: fotos en taller o punto de venta y vídeo del conjunto.',
          'Edita textos y rutas en `src/content/site.ts` si cambias archivos en `public/img/Exibidor Jugos/`.',
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
