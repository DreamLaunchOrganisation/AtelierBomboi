import type { Metadata } from 'next'
import './globals.css'
import KonamiForest from '@/components/KonamiForest'

export const metadata: Metadata = {
  title: "L'Atelier Bomboi — Menuiserie sur Mesure à Charleroi",
  description:
    'Artisan menuisier depuis 2023. Dressings, cuisines, bibliothèques sur mesure. Configurez votre meuble en ligne et obtenez un devis gratuit.',
  keywords: ['menuisier', 'sur mesure', 'dressing', 'Charleroi', 'Belgique', 'artisan'],
  openGraph: {
    title: "L'Atelier Bomboi — Menuiserie sur Mesure",
    description: 'Meubles sur mesure fabriqués artisanalement à Charleroi.',
    locale: 'fr_BE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body>
        {/* Sans JavaScript, rien ne déclencherait les révélations et le contenu
            resterait invisible. On neutralise l'état masqué dans ce cas. */}
        <noscript>
          <style>{`.reveal-root [data-reveal],.reveal-root [data-reveal-glow]{opacity:1;transform:none;filter:none}`}</style>
        </noscript>
        {children}
        <KonamiForest />
      </body>
    </html>
  )
}
