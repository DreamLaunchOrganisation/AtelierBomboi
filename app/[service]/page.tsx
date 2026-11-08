import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Nav from '@/components/Nav'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import JsonLd from '@/components/JsonLd'
import { DevisProvider } from '@/components/DevisProvider'

import ServiceHero from '@/components/service/ServiceHero'
import ServiceDetails from '@/components/service/ServiceDetails'
import ServiceGallery from '@/components/service/ServiceGallery'
import ServiceFaq from '@/components/service/ServiceFaq'
import ServiceCrossLinks from '@/components/service/ServiceCrossLinks'

import { SERVICES, findService } from '@/lib/services'
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo'

/**
 * Une page par prestation, servies par ce seul fichier.
 *
 * Quatre routes statiques dessinées depuis `SERVICES` : ajouter une entrée au
 * tableau crée la page, son entrée de sitemap et ses liens croisés, sans
 * toucher à ce composant.
 */

/**
 * L'image de partage, celle que dessine app/opengraph-image.tsx.
 *
 * `metadataBase` du layout la résout en URL absolue, ce qu'exigent Facebook,
 * WhatsApp et les autres.
 */
const IMAGE_PARTAGE = '/opengraph-image'

/** Les slugs connus. Tout le reste est un 404, grâce à `dynamicParams`. */
export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }))
}

/**
 * Sans cette ligne, un segment dynamique à la racine attraperait n'importe
 * quelle URL et tenterait de la rendre à la demande. À `false`, tout slug hors
 * de `generateStaticParams` répond directement 404 — ce qui est le comportement
 * voulu, et ce qu'attend Google d'une adresse qui n'existe pas.
 */
export const dynamicParams = false

type Props = { params: { service: string } }

export function generateMetadata({ params }: Props): Metadata {
  const service = findService(params.service)
  if (!service) return {}

  const path = `/${service.slug}`

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    // Chaque page se déclare elle-même comme sa version de référence, sinon
    // elle hériterait du canonical `/` posé par le layout et se retirerait
    // elle-même de l'index.
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      locale: 'fr_BE',
      url: path,
      title: service.metaTitle,
      description: service.metaDescription,
      // L'image doit être nommée explicitement. Déclarer `openGraph` ici
      // remplace entièrement celui du layout, et Next n'y réinjecte pas
      // l'image issue de app/opengraph-image.tsx : sans cette ligne, les pages
      // services se partageaient sans aucune vignette.
      images: [IMAGE_PARTAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
      images: [IMAGE_PARTAGE],
    },
  }
}

export default function ServicePage({ params }: Props) {
  const service = findService(params.service)
  if (!service) notFound()

  const path = `/${service.slug}`

  return (
    // Le formulaire de contact lit le contexte de devis : sans ce fournisseur,
    // `useDevis` lèverait une erreur. Aucun configurateur sur cette page, donc
    // aucun brouillon n'y sera déposé — le fournisseur est là pour le contrat.
    <DevisProvider>
      <JsonLd
        data={serviceSchema({
          name: service.name,
          description: service.metaDescription,
          path,
          keywords: service.keywords,
        })}
      />
      <JsonLd data={breadcrumbSchema(service.label, path)} />
      <JsonLd data={faqSchema(service.faq)} />

      <main>
        {/* Même découpage que la page d'accueil : chaque section est enveloppée
            d'un `<Reveal>`, qui est ce qui lève l'état masqué posé par
            `revealed()`. Sans lui, la section resterait invisible. */}
        <Nav />
        <Reveal immediate>
          <ServiceHero service={service} />
        </Reveal>
        <Reveal>
          <ServiceDetails service={service} />
        </Reveal>
        <Reveal>
          <ServiceGallery service={service} />
        </Reveal>
        <Reveal>
          <Process />
        </Reveal>
        <Reveal>
          <ServiceFaq service={service} />
        </Reveal>
        <Reveal>
          <ServiceCrossLinks current={service} />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
        <Reveal>
          <Footer />
        </Reveal>
      </main>
    </DevisProvider>
  )
}
