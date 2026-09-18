import type { FurnitureConfig, FurnitureKey, MaterialKey, PriceBreakdown } from '@/types'
import { MATERIALS, OPTIONS } from './constants'
import { FURNITURE } from './furniture'

/**
 * La ventilation affichée est la même pour les neuf meubles — le meuble d'un
 * côté, les options de l'autre. Seule la base est propre au type et vient de
 * son module.
 *
 * La finition multiplie le prix du meuble : c'est ainsi que l'atelier raisonne
 * (un même module coûte 800 € en mélaminé et 1440 € en stratifié). Fabrication
 * et matière ne se distinguent pas dans le devis, elles tiennent en un poste.
 */
export function calcPrix(
  type: FurnitureKey,
  config: FurnitureConfig,
  materiau: MaterialKey,
): PriceBreakdown {
  const base = FURNITURE[type].price(config)

  const pMeuble = Math.round(base * MATERIALS[materiau].mult)

  const applicables = FURNITURE[type].options
  const pOptions = OPTIONS.filter((o) => applicables.includes(o.key) && config[o.key]).reduce(
    (sum, o) => sum + o.price,
    0,
  )

  return { pMeuble, pOptions, total: pMeuble + pOptions }
}

export function formatPrice(value: number): string {
  return value.toLocaleString('fr-BE') + ' €'
}
