/**
 * Les faits de l'entreprise, en un seul endroit.
 *
 * Le pied de page, la section contact et les données structurées lisent tous
 * cet objet. C'est volontaire : un numéro de téléphone qui diverge entre ce que
 * lit le visiteur et ce que lit Google est une incohérence que Google relève, et
 * la cohérence de ces informations d'un bout à l'autre du web (site, fiche
 * Google Business, annuaires) est l'un des signaux du référencement local.
 */

/**
 * L'adresse publique du site, sans barre oblique finale.
 *
 * Elle sert de base aux URL canoniques, au sitemap et aux données structurées —
 * autant d'endroits où une URL relative ne veut rien dire.
 *
 * Le repli est le domaine de production : si `NEXT_PUBLIC_SITE_URL` venait à
 * manquer au déploiement, le site publierait quand même des URL justes plutôt
 * qu'une adresse inventée. La variable reste utile pour un environnement de
 * préproduction, qui ne doit surtout pas se déclarer canonique à sa place.
 *
 * Avec le `www`, et pas sans : c'est la forme déclarée aux moteurs, et il ne
 * faut jamais en changer sans redirection — deux adresses pour la même page
 * divisent le référencement entre elles.
 */
// `||` et non `??` : une variable déclarée mais laissée vide dans .env.local
// passerait le test de `??`, et `new URL('')` ferait échouer le build.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atelierbomboi.com'
).replace(/\/+$/, '')

/** Construit une URL absolue à partir d'un chemin du site. */
export function url(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const BUSINESS = {
  name: "L'Atelier Bomboi",
  /** Ce que fait l'atelier, en une ligne — réutilisé en description de repli. */
  tagline: 'Menuiserie sur mesure à Charleroi',
  founded: '2023',

  street: 'Zoning industriel',
  locality: 'Jumet',
  postalCode: '6040',
  region: 'Hainaut',
  country: 'BE',

  /** Format E.164, celui qu'attendent les données structurées et `tel:`. */
  phone: '+32496989360',
  /** Le même numéro, espacé pour la lecture. */
  phoneDisplay: '+32 496 98 93 60',
  email: 'marcobomboi05@gmail.com',

  hoursDisplay: 'Lun–Sam 7h–17h',
  openingDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  opens: '07:00',
  closes: '17:00',

  /** Fourchette conventionnelle de schema.org, pas un tarif annoncé. */
  priceRange: '€€',

  instagram: 'https://www.instagram.com/atelierbomboi',
  facebook: 'https://www.facebook.com/share/18x861waoN/',

  /** Les communes où l'atelier se déplace, de la plus proche à la plus lointaine. */
  areaServed: [
    'Jumet',
    'Charleroi',
    'Gilly',
    'Marcinelle',
    'Montignies-sur-Sambre',
    'Gosselies',
    'Fleurus',
    'Châtelet',
    'Courcelles',
    'Hainaut',
  ],
} as const

/** L'adresse postale au format schema.org, utilisée par plusieurs schémas. */
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.street,
  addressLocality: BUSINESS.locality,
  postalCode: BUSINESS.postalCode,
  addressRegion: BUSINESS.region,
  addressCountry: BUSINESS.country,
}

/**
 * L'entreprise elle-même.
 *
 * `HomeAndConstructionBusiness` est le sous-type de `LocalBusiness` qui couvre
 * les métiers du bâtiment : schema.org n'a pas de type « menuisier ». Les deux
 * sont déclarés pour que les consommateurs qui ne connaissent que le type
 * général s'y retrouvent quand même.
 */
export function localBusinessSchema(services: readonly { name: string; description: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': url('/#atelier'),
    name: BUSINESS.name,
    description: `Artisan menuisier à ${BUSINESS.locality} (${BUSINESS.postalCode}), près de Charleroi. Dressings, cuisines, escaliers et bardages sur mesure, fabriqués et posés par l'atelier.`,
    url: url('/'),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    foundingDate: BUSINESS.founded,
    priceRange: BUSINESS.priceRange,
    image: url('/opengraph-image'),
    logo: url('/logo-bomboi.png'),
    address: postalAddress,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...BUSINESS.openingDays],
        opens: BUSINESS.opens,
        closes: BUSINESS.closes,
      },
    ],
    areaServed: BUSINESS.areaServed.map((name) => ({
      '@type': 'Place',
      name,
    })),
    sameAs: [BUSINESS.instagram, BUSINESS.facebook],
    // Le catalogue dit à Google ce que l'atelier propose, et chaque entrée
    // pointe la page qui en parle — ce qui aide à les faire découvrir.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Menuiserie sur mesure',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: url(service.path),
        },
      })),
    },
  }
}

/** Le site, pour que Google rattache les pages à une même entité nommée. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url('/#site'),
    url: url('/'),
    name: BUSINESS.name,
    inLanguage: 'fr-BE',
    publisher: { '@id': url('/#atelier') },
  }
}

/** Une prestation, rattachée à l'atelier qui la rend. */
export function serviceSchema(service: {
  name: string
  description: string
  path: string
  keywords: readonly string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: url(service.path),
    serviceType: service.keywords[0],
    provider: { '@id': url('/#atelier') },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
  }
}

/** Le fil d'Ariane, qui s'affiche sous le lien dans les résultats de recherche. */
export function breadcrumbSchema(label: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: url('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: url(path),
      },
    ],
  }
}

/**
 * Les questions fréquentes.
 *
 * C'est le schéma qui rapporte le plus de place visible : Google peut déplier
 * les questions directement sous le lien, ce qui élargit le résultat.
 */
export function faqSchema(faq: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  }
}
