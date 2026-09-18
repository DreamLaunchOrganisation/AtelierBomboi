import type { FurnitureType } from '@/types'
import { MATERIAUX_PANNEAU } from '../constants'
import { Builder, T, cm, num, m2 } from './helpers'

/**
 * Tarif de référence de l'atelier : un module de 120 × 250 cm vaut 800 € en
 * mélaminé, soit 800 / 3 m² de façade. Les autres finitions se déduisent de ce
 * montant par leur multiplicateur (voir MATERIALS dans lib/constants.ts).
 */
const PRIX_M2 = 800 / 3

/**
 * La profondeur ne se facture pas au centimètre : de 42 à 60 cm on reste sur le
 * même débit de panneaux, donc le même prix. En dessous l'atelier consent 5 %,
 * au-delà de 60 cm il faut refendre et le prix monte de 12 %.
 */
function coefProfondeur(profondeur: number): number {
  if (profondeur < 40) return 0.95
  if (profondeur > 60) return 1.12
  return 1
}

/**
 * Placard droit — le caisson d'origine du configurateur : montants, traverses,
 * fond, séparations verticales et une étagère par colonne.
 */
export const placard: FurnitureType = {
  key: 'placard',
  label: 'Placard droit',
  tagline: 'Caisson fermé, séparations verticales et une étagère par colonne.',
  options: ['optPortes', 'optMiroir', 'optLumiere', 'optTiroirs'],
  materials: MATERIAUX_PANNEAU,
  maxDims: { w: 4, h: 2.8, d: 0.8 },
  params: [
    { kind: 'number', key: 'largeur', label: 'Largeur', min: 120, max: 400, step: 10, def: 200 },
    { kind: 'number', key: 'hauteur', label: 'Hauteur', min: 180, max: 280, step: 10, def: 220 },
    {
      kind: 'number',
      key: 'profondeur',
      label: 'Profondeur',
      min: 30,
      max: 80,
      step: 5,
      def: 60,
      hint: 'En dessous de 40 cm : −5 % sur le prix. Au-dessus de 60 cm : +12 %.',
    },
    { kind: 'number', key: 'colonnes', label: 'Colonnes', min: 1, max: 6, step: 1, unit: '', def: 3 },
  ],

  build(config, color) {
    const b = new Builder(color)
    const w = cm(num(config, 'largeur'))
    const h = cm(num(config, 'hauteur'))
    const d = cm(num(config, 'profondeur'))
    const n = num(config, 'colonnes')

    // Montants, traverses et fond
    b.box(T, h, d, -w / 2 + T / 2, h / 2, 0)
    b.box(T, h, d, w / 2 - T / 2, h / 2, 0)
    b.box(w, T, d, 0, h - T / 2, 0)
    b.box(w, T, d, 0, T / 2, 0)
    b.box(w, h, T, 0, h / 2, -d / 2 + T / 2)

    const innerW = w - 2 * T
    const colW = innerW / n

    // Séparations verticales
    for (let i = 1; i < n; i++) {
      b.box(T, h - 2 * T, d - T, -w / 2 + T + colW * i, h / 2, T / 2)
    }

    // Une étagère à mi-hauteur par colonne
    for (let c = 0; c < n; c++) {
      b.box(colW - T, T, d - T, -w / 2 + T + colW * (c + 0.5), h / 2, T / 2)
    }

    return b.center()
  },

  // Prix au mètre carré de façade, corrigé par la profondeur.
  price(config) {
    const surface = m2(num(config, 'largeur'), num(config, 'hauteur'))
    return surface * PRIX_M2 * coefProfondeur(num(config, 'profondeur'))
  },
}
