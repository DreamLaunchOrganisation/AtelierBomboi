import { ImageResponse } from 'next/og'
import { BUSINESS } from '@/lib/seo'

/**
 * L'image qui s'affiche quand on partage le lien du site — WhatsApp, Facebook,
 * Messenger, iMessage. Sans elle, le lien sort nu : un titre, une URL, et rien
 * d'autre pour donner envie de cliquer.
 *
 * Elle est dessinée ici plutôt que fournie en fichier afin de rester alignée
 * sur les couleurs de marque. Aucune police distante n'est chargée : satori
 * irait la chercher sur le réseau, et le build échouerait hors ligne.
 */

/**
 * Runtime edge imposé : sous Node, sur Windows, le chargeur de police de
 * `@vercel/og` passe un chemin au lieu d'une URL de fichier à `fileURLToPath`
 * et le prérendu échoue sur « Invalid URL ». Le build edge n'emprunte pas ce
 * chemin de code.
 */
export const runtime = 'edge'

export const alt = `${BUSINESS.name} — ${BUSINESS.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CHARCOAL = '#262220'
const BRAND = '#ec5802'
const CREAM = '#F5F1EA'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: CHARCOAL,
          padding: '72px 80px',
        }}
      >
        {/* L'accent orange du hero. En aplat, son bord franc passait pour une
            erreur de rendu : un dégradé linéaire le fait mourir dans le fond.
            Satori ne gère pas les dégradés radiaux, celui du site est donc
            approché par une diagonale. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 620,
            height: 630,
            backgroundImage:
              'linear-gradient(to left, rgba(236, 88, 2, 0.16), rgba(236, 88, 2, 0))',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: BRAND,
            }}
          >
            Artisan menuisier — Depuis {BUSINESS.founded}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 92,
              lineHeight: 1.05,
              color: CREAM,
            }}
          >
            {BUSINESS.name}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              fontSize: 40,
              color: 'rgba(245, 241, 234, 0.6)',
            }}
          >
            {BUSINESS.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: 120, height: 3, backgroundColor: BRAND }} />
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 26,
              color: 'rgba(245, 241, 234, 0.75)',
            }}
          >
            Dressings · Cuisines · Escaliers · Bardages
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 12,
              fontSize: 24,
              color: 'rgba(245, 241, 234, 0.45)',
            }}
          >
            {BUSINESS.locality} {BUSINESS.postalCode} · {BUSINESS.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
