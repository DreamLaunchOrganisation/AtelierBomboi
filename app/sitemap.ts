import type { MetadataRoute } from 'next'
import { url } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

/**
 * Sert /sitemap.xml.
 *
 * Les pages services s'ajoutent d'elles-mêmes : ajouter une entrée à SERVICES
 * suffit pour qu'elle apparaisse ici. `priority` est une indication relative
 * entre nos propres pages, pas une note absolue — la home passe devant.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: url('/'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...SERVICES.map((service) => ({
      url: url(`/${service.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
