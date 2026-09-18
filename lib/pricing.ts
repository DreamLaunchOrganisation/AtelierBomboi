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
  const meuble = FURNITURE[type]

  const pMeuble = meuble.priceOverride
    ? Math.round(meuble.priceOverride(config, materiau))
    : Math.round(meuble.price(config) * MATERIALS[materiau].mult)

  const pOptions = meuble.optionsOverride
    ? Math.round(meuble.optionsOverride(config))
    : OPTIONS.filter((o) => meuble.options.includes(o.key) && config[o.key]).reduce(
        (sum, o) => sum + o.price,
        0,
      )

  return { pMeuble, pOptions, total: pMeuble + pOptions }
}

export function formatPrice(value: number, unit = ' €'): string {
  return value.toLocaleString('fr-BE') + unit
}
