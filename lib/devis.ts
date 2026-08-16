import type { FurnitureConfig, FurnitureKey, MaterialKey, ParamDef } from '@/types'
import { MATERIALS, OPTIONS } from './constants'
import { FURNITURE } from './furniture'
import { calcPrix, formatPrice } from './pricing'

/**
 * Met en mots la configuration du client, pour pré-remplir le champ « Votre
 * projet » du formulaire de contact.
 *
 * Volontairement générique : les libellés, unités et intitulés de choix vivent
 * déjà dans le registre des meubles. Cette fonction les relit dans l'ordre
 * d'affichage du configurateur, si bien qu'un dixième type de meuble sera
 * résumé sans une ligne de code de plus.
 */

/** Un paramètre tel qu'il se lit : « Largeur : 200 cm », « Caisson : à gauche ». */
function ligneParametre(param: ParamDef, config: FurnitureConfig): string {
  const valeur = config[param.key]

  switch (param.kind) {
    case 'number':
      // L'unité par défaut est le centimètre ; les décomptes la laissent vide.
      return `${param.label} : ${Number(valeur)}${param.unit ?? ' cm'}`
    case 'choice': {
      const choix = param.choices.find((c) => c.value === String(valeur))
      return `${param.label} : ${choix?.label ?? valeur}`
    }
    case 'toggle':
      return `${param.label} : ${valeur ? 'oui' : 'non'}`
  }
}

export function resumeDevis(
  type: FurnitureKey,
  config: FurnitureConfig,
  materiau: MaterialKey,
): string {
  const meuble = FURNITURE[type]
  const prix = calcPrix(type, config, materiau)

  const lignes = [
    `Demande de devis — ${meuble.label}`,
    '',
    'Ma configuration',
    ...meuble.params.map((p) => `· ${ligneParametre(p, config)}`),
    `· Matériau : ${MATERIALS[materiau].name}`,
  ]

  const optionsRetenues = OPTIONS.filter(
    (o) => meuble.options.includes(o.key) && config[o.key],
  )
  if (optionsRetenues.length > 0) {
    lignes.push(
      '',
      'Options',
      ...optionsRetenues.map((o) => `· ${o.label} (+${o.price} €)`),
    )
  }

  lignes.push(
    '',
    `Estimation du configurateur : ${formatPrice(prix.total)}`,
    `Structure ${formatPrice(prix.pStructure)} · Matériau ${formatPrice(prix.pMateriau)} · Options ${formatPrice(prix.pOptions)}`,
    '',
    'Estimation obtenue en ligne, à confirmer après visite technique.',
  )

  return lignes.join('\n')
}
