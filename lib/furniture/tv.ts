import type { FurnitureType } from '@/types'
import { Builder, T, cm, num, m2 } from './helpers'
import { MATERIAUX_PANNEAU } from '../constants'

const LEG = 0.08

/**
 * Meuble sous télé — caisson bas et large sur pieds : niches ouvertes de part et
 * d'autre, tiroirs dans la niche centrale.
 */
export const tv: FurnitureType = {
  key: 'tv',
  label: 'Meuble sous télé',
  tagline: 'Niches ouvertes sur les côtés, tiroirs au centre, meuble sur pieds.',
  options: ['optLumiere', 'optTiroirs'],
  materials: MATERIAUX_PANNEAU,
  maxDims: { w: 3.2, h: 0.8, d: 0.55 },
  params: [
    { kind: 'number', key: 'longueur', label: 'Longueur', min: 100, max: 320, step: 10, def: 180 },
    { kind: 'number', key: 'hauteur', label: 'Hauteur du caisson', min: 30, max: 70, step: 5, def: 45 },
    { kind: 'number', key: 'profondeur', label: 'Profondeur', min: 30, max: 55, step: 5, def: 40 },
    { kind: 'number', key: 'niches', label: 'Niches', min: 2, max: 5, step: 1, unit: '', def: 3 },
    { kind: 'number', key: 'tiroirs', label: 'Tiroirs', min: 0, max: 4, step: 1, unit: '', def: 2 },
  ],

  build(config, color) {
    const b = new Builder(color)
    const w = cm(num(config, 'longueur'))
    const h = cm(num(config, 'hauteur'))
    const d = cm(num(config, 'profondeur'))
    const n = num(config, 'niches')
    const k = num(config, 'tiroirs')

    const y0 = LEG // le caisson repose sur ses pieds

    b.box(T, h, d, -w / 2 + T / 2, y0 + h / 2, 0)
    b.box(T, h, d, w / 2 - T / 2, y0 + h / 2, 0)
    b.box(w, T, d, 0, y0 + h - T / 2, 0)
    b.box(w, T, d, 0, y0 + T / 2, 0)
    b.box(w, h, T, 0, y0 + h / 2, -d / 2 + T / 2)

    const innerW = w - 2 * T
    const colW = innerW / n
    const centre = Math.floor(n / 2)

    for (let i = 1; i < n; i++) {
      b.box(T, h - 2 * T, d - T, -w / 2 + T + colW * i, y0 + h / 2, T / 2)
    }

    for (let c = 0; c < n; c++) {
      const x = -w / 2 + T + colW * (c + 0.5)
      if (c === centre && k > 0) {
        // Façades de tiroirs empilées, légèrement en avant du caisson
        const drawerH = (h - 2 * T) / k
        for (let i = 0; i < k; i++) {
          b.box(
            colW - 2 * T,
            drawerH - 0.008,
            T,
            x,
            y0 + T + drawerH * (i + 0.5),
            d / 2 - T / 2,
          )
        }
      } else {
        b.box(colW - T, T, d - T, x, y0 + h / 2, T / 2)
      }
    }

    // Pieds
    const legInset = 0.06
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(0.05, LEG, 0.05, sx * (w / 2 - legInset), LEG / 2, sz * (d / 2 - legInset))
      }
    }

    return b.center()
  },

  // TARIFS PROVISOIRES — à caler avec le client
  price(config) {
    const facade = m2(num(config, 'longueur'), num(config, 'hauteur'))
    return 2 * (facade * 520 + num(config, 'niches') * 80 + num(config, 'tiroirs') * 140 + 180)
  },
}
