import type { MetadataRoute } from 'next'
import { SITE_URL, url } from '@/lib/seo'

/**
 * Sert /robots.txt.
 *
 * Tout est ouvert sauf l'API, qui ne renvoie que du JSON et n'a donc rien à
 * faire dans un index. Le lien vers le sitemap est l'intérêt principal du
 * fichier : c'est par là que les robots découvrent la liste des pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: url('/sitemap.xml'),
    host: SITE_URL,
  }
}
