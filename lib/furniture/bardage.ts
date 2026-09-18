import type { FurnitureType, MaterialKey } from '@/types'
import { Builder, INSULATION, T, num } from './helpers'

const LATH_T = 0.02 // épaisseur d'une latte
// Largeur de latte et jeu entre lattes : réglage d'atelier, pas un curseur client.
const LATH_W = 0.12
const LATH_GAP = 0.01
// Isolation PU 12 cm, seule épaisseur au catalogue.
const INSULATION_THICKNESS = 0.12

// Pan de référence pour l'aperçu 3D — pas de jauge sur ce type, tarifé au m².
const PREVIEW_W = 3
const PREVIEW_H = 2.5

/** Prix du parement (pare-pluie, lattage, contre-lattage et bardage), au m² HTVA. */
const CLADDING_PRICE: Partial<Record<MaterialKey, number>> = {
  ayous: 214,
  autoclave: 185,
  brule: 310,
  filberteck: 295,
}

/** Prix de l'isolation PU 12 cm, au m² HTVA — toujours incluse. */
const INSULATION_PRICE = 68

/**
 * Bardage + isolation — le seul « meuble » qui n'est pas un volume mais une
 * paroi, et le seul tarifé au m² : pas de largeur/hauteur à cadrer, le client
 * tape directement la surface à couvrir, qui multiplie les deux rubriques de
 * prix (parement, isolation) du matériau choisi.
 */
export const bardage: FurnitureType = {
  key: 'bardage',
  label: 'Bardage + isolation',
  tagline: 'Parement à lattes sur ossature, isolant apparent en tranche. Tarifé au m².',
  options: [],
  materials: ['ayous', 'autoclave', 'brule', 'filberteck'],
  priceLabels: {
    meuble: 'Pare-pluie, lattage, contre-lattage et bardage',
    options: 'Isolation (PU 12 cm)',
    total: 'Estimation totale',
  },
  // Marge au-delà du pan réel : le cadrage colle sinon au bord du panneau, trop serré.
  maxDims: { w: PREVIEW_W * 2.4, h: PREVIEW_H * 2.4, d: 0.25 },
  params: [
    {
      kind: 'number',
      key: 'surface',
      label: 'Surface à couvrir',
      min: 1,
      max: 500,
      step: 1,
      unit: ' m²',
      control: 'input',
      def: 20,
      hint: 'Pare-pluie, lattage, contre-lattage, bardage et isolation compris.',
    },
  ],

  build(_config, color) {
    const b = new Builder(color)
    const w = PREVIEW_W
    const h = PREVIEW_H
    const ins = INSULATION_THICKNESS

    const wall = b.material(0xdedad2, { rough: 0.95, metal: 0 })
    const insulation = b.material(INSULATION, { rough: 1, metal: 0 })

    // Mur support
    b.box(w, h, T, 0, h / 2, 0, wall)

    // Isolant entre montants
    const zIns = T / 2 + ins / 2
    b.box(w, h, ins, 0, h / 2, zIns, insulation)

    // Montants d'ossature, noyés dans l'isolant
    const montantPitch = 0.6
    const montants = Math.max(2, Math.round(w / montantPitch))
    for (let i = 0; i <= montants; i++) {
      const x = -w / 2 + (w / montants) * i
      b.box(0.04, h, Math.max(ins, T), x, h / 2, zIns)
    }

    // Parement : lattes verticales, arrêtées avant le bord droit
    const zLath = T / 2 + ins + LATH_T / 2
    const cut = Math.min(0.4, w * 0.14)
    const covered = w - cut
    const pitch = LATH_W + LATH_GAP
    const count = Math.max(1, Math.floor(covered / pitch))
    for (let i = 0; i < count; i++) {
      b.box(LATH_W, h, LATH_T, -w / 2 + pitch * i + LATH_W / 2, h / 2, zLath)
    }

    return b.center()
  },

  // Prix de référence (repris par priceOverride pour chaque matériau) — non utilisé directement.
  price(config) {
    return num(config, 'surface') * (CLADDING_PRICE.ayous ?? 0)
  },

  priceOverride(config, materiau) {
    return num(config, 'surface') * (CLADDING_PRICE[materiau] ?? 0)
  },

  optionsOverride(config) {
    return num(config, 'surface') * INSULATION_PRICE
  },
}
