import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import KonamiForest from '@/components/KonamiForest'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Les polices, servies depuis notre propre domaine.
 *
 * Elles étaient appelées par un `@import` vers Google Fonts dans globals.css,
 * ce qui imposait au navigateur une file d'attente : HTML, puis notre CSS, puis
 * le CSS de Google, puis seulement les fichiers de police — quatre étapes sur
 * trois serveurs, chacune attendant la précédente. Le texte s'affichait en
 * police de secours puis sautait.
 *
 * `next/font` télécharge les polices au build et les sert avec le reste du
 * site. Plus d'attente en chaîne, plus de requête vers Google au chargement
 * (donc plus d'adresse IP de visiteur transmise au passage), et Next réserve
 * la place du texte à l'avance pour supprimer le saut.
 *
 * `weight` est volontairement omis : ces deux familles sont des polices
 * variables, un seul fichier couvre donc toutes les graisses, au lieu d'un
 * fichier par graisse.
 */
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  // L'italique est un fichier distinct, et le hero s'en sert.
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
})
import JsonLd from '@/components/JsonLd'
import { BUSINESS, SITE_URL, localBusinessSchema, webSiteSchema } from '@/lib/seo'
import { SERVICE_OFFERS } from '@/lib/services'

export const metadata: Metadata = {
  // Sans `metadataBase`, Next ne peut pas résoudre les URL relatives ci-dessous
  // en adresses absolues — et une URL canonique relative ne veut rien dire pour
  // un robot. C'est aussi ce qui fait disparaître l'avertissement au build.
  metadataBase: new URL(SITE_URL),

  title: {
    default: "L'Atelier Bomboi — Menuiserie sur mesure à Charleroi",
    // Les pages services ne répètent donc que leur propre titre.
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Artisan menuisier à Jumet, près de Charleroi. Dressings, cuisines, escaliers et bardages sur mesure, fabriqués et posés par l'atelier. Configurez votre meuble en ligne et obtenez un devis gratuit.",

  // La balise `keywords` est ignorée par Google depuis 2009 : la rallonger
  // n'apporte rien, et des listes trop longues sont lues comme du bourrage par
  // les moteurs qui la regardent encore. Les mots-clés travaillent dans les
  // titres, les intertitres et le texte des pages services.

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    url: '/',
    siteName: BUSINESS.name,
    title: "L'Atelier Bomboi — Menuiserie sur mesure à Charleroi",
    description:
      "Dressings, cuisines, escaliers et bardages sur mesure, fabriqués et posés par notre atelier de Jumet.",
  },

  twitter: {
    card: 'summary_large_image',
    title: "L'Atelier Bomboi — Menuiserie sur mesure à Charleroi",
    description:
      "Dressings, cuisines, escaliers et bardages sur mesure, fabriqués et posés par notre atelier de Jumet.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Le site vit de ses photos de réalisations : sans cette directive,
      // Google n'affiche qu'une vignette dans Google Images.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `fr-BE` plutôt que `fr` : la variante régionale aide au ciblage local,
    // et c'est bien de Belgique qu'on parle.
    //
    // Les deux classes `.variable` posent `--font-dm-sans` et `--font-playfair`
    // sur la racine ; tailwind.config.ts y rattache `font-sans` et
    // `font-playfair`, inchangés dans les composants.
    <html
      lang="fr-BE"
      className={`${dmSans.variable} ${playfair.variable} scroll-smooth`}
    >
      <body>
        {/* Sans JavaScript, rien ne déclencherait les révélations et le contenu
            resterait invisible. On neutralise l'état masqué dans ce cas. */}
        <noscript>
          <style>{`.reveal-root [data-reveal],.reveal-root [data-reveal-glow]{opacity:1;transform:none;filter:none}`}</style>
        </noscript>

        {/* L'atelier et le site sont déclarés sur toutes les pages : les schémas
            propres à chaque page (Service, fil d'Ariane, questions fréquentes)
            renvoient à l'entreprise par son `@id`, qui doit donc être présent. */}
        <JsonLd data={localBusinessSchema(SERVICE_OFFERS)} />
        <JsonLd data={webSiteSchema()} />

        {children}
        <KonamiForest />

        {/* Mesure des Core Web Vitals et des pages vues. Les deux ne
            rapportent qu'en production, et seulement si Speed Insights et Web
            Analytics sont activés sur le projet Vercel. */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
