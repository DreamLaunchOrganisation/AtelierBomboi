import type { FurnitureType, MaterialKey } from '@/types'
import { Builder, METAL, cm, num, str } from './helpers'

const LEAF = 0.04 // épaisseur d'un vantail
const OPEN = 0.45 // angle d'ouverture affiché, en radians

/** Prix par palier d'ébrasement (10 cm / 40 cm), interpolé linéairement entre les deux. */
const DOOR_PRICE: Partial<Record<MaterialKey, [number, number]>> = {
  apeindre: [360, 460],
  stratifie: [450, 550],
  massif: [600, 740],
  vitree: [480, 620],
}
const EMBRASEMENT_MIN = 10
const EMBRASEMENT_MAX = 40

/**
 * Portes — vantail battant à panneau dans son bâti. L'ouvrant est représenté
 * entrebâillé : c'est ce qui le distingue d'un simple panneau.
 */
export const portes: FurnitureType = {
  key: 'portes',
  label: 'Portes',
  tagline: 'Battant à panneau dans son bâti, montré entrebâillé.',
  options: ['optMiroir'],
  materials: ['apeindre', 'stratifie', 'massif', 'vitree'],
  // Profondeur dictée par le vantail le plus large, qui débat le plus loin.
  maxDims: { w: 1.8, h: 2.7, d: 0.85 },
  params: [
    { kind: 'number', key: 'largeur', label: 'Largeur de passage', min: 60, max: 160, step: 5, def: 90 },
    { kind: 'number', key: 'hauteur', label: 'Hauteur', min: 190, max: 260, step: 5, def: 210 },
    {
      kind: 'number',
      key: 'embrasement',
      label: "Largeur de l'ébrasement",
      min: EMBRASEMENT_MIN,
      max: EMBRASEMENT_MAX,
      step: 1,
      def: 14,
    },
    {
      kind: 'choice',
      key: 'sens',
      label: 'Charnières',
      choices: [
        { value: 'gauche', label: 'À gauche' },
        { value: 'droite', label: 'À droite' },
      ],
      def: 'gauche',
    },
  ],

  build(config, color) {
    const b = new Builder(color)
    const w = cm(num(config, 'largeur'))
    const h = cm(num(config, 'hauteur'))

    const metal = b.material(METAL, { rough: 0.3, metal: 0.85 })
    const jamb = cm(num(config, 'embrasement'))
    const frameD = 0.14

    // Bâti
    b.box(jamb, h + jamb, frameD, -w / 2 - jamb / 2, (h + jamb) / 2, 0)
    b.box(jamb, h + jamb, frameD, w / 2 + jamb / 2, (h + jamb) / 2, 0)
    b.box(w + 2 * jamb, jamb, frameD, 0, h + jamb / 2, 0)

    // Vantail unique, pivote du côté choisi
    const left = str(config, 'sens') === 'gauche'
    const hingeX = left ? -w / 2 : w / 2
    const dir = left ? 1 : -1 // sens dans lequel le vantail s'étend depuis ses charnières

    b.pivot(hingeX, 0, 0, left ? -OPEN : OPEN, () => {
      const cx = (dir * w) / 2
      b.box(w - 0.008, h - 0.008, LEAF, cx, h / 2, 0)

      // Panneau rapporté sur la face avant
      const margin = 0.1
      b.box(w - 0.2, h - margin * 2, 0.012, cx, h / 2, LEAF / 2 + 0.006)

      // Béquille côté ouvrant
      b.box(0.03, 0.14, 0.06, cx + dir * (w / 2 - 0.07), h * 0.48, LEAF / 2 + 0.03, metal)
    })

    return b.center()
  },

  // Prix de référence (à peindre) — repris par priceOverride pour chaque matériau.
  price(config) {
    const [lo, hi] = DOOR_PRICE.apeindre ?? [0, 0]
    return interpole(num(config, 'embrasement'), lo, hi)
  },

  priceOverride(config, materiau) {
    const [lo, hi] = DOOR_PRICE[materiau] ?? [0, 0]
    return interpole(num(config, 'embrasement'), lo, hi)
  },
}

function interpole(embrasement: number, lo: number, hi: number): number {
  const t = (embrasement - EMBRASEMENT_MIN) / (EMBRASEMENT_MAX - EMBRASEMENT_MIN)
  return lo + (hi - lo) * Math.min(1, Math.max(0, t))
}
