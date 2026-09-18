import type { FurnitureType } from '@/types'
import { Builder, cm, num, m2 } from './helpers'

/** Épaisseur du plateau, imposée par l'atelier — plus un réglage client. */
const PLATEAU = 4

/** Table — plateau massif sur quatre pieds droits. */
export const table: FurnitureType = {
  key: 'table',
  label: 'Table',
  tagline: 'Plateau massif de 4 cm sur quatre pieds droits, sans traverse apparente.',
  options: [],
  materials: ['cheneHuile'],
  maxDims: { w: 3.2, h: 1.1, d: 1.2 },
  params: [
    { kind: 'number', key: 'longueur', label: 'Longueur', min: 100, max: 320, step: 10, def: 200 },
    { kind: 'number', key: 'largeur', label: 'Largeur', min: 60, max: 120, step: 5, def: 90 },
    { kind: 'number', key: 'hauteur', label: 'Hauteur', min: 70, max: 110, step: 1, def: 75 },
    { kind: 'number', key: 'pieds', label: 'Section des pieds', min: 6, max: 12, step: 1, def: 8 },
  ],

  build(config, color) {
    const b = new Builder(color)
    const l = cm(num(config, 'longueur'))
    const w = cm(num(config, 'largeur'))
    const h = cm(num(config, 'hauteur'))
    const ep = cm(PLATEAU)
    const s = cm(num(config, 'pieds'))

    b.box(l, ep, w, 0, h - ep / 2, 0)

    const inset = 0.05
    const legH = h - ep
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(
          s,
          legH,
          s,
          sx * (l / 2 - inset - s / 2),
          legH / 2,
          sz * (w / 2 - inset - s / 2),
        )
      }
    }

    return b.center()
  },

  // TARIFS PROVISOIRES — à caler avec le client
  price(config) {
    const plateau = m2(num(config, 'longueur'), num(config, 'largeur'))
    return plateau * (560 + PLATEAU * 22) + 4 * 90
  },
}
