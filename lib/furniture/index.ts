import type { FurnitureConfig, FurnitureKey, FurnitureType } from '@/types'
import { defaultsFor } from './helpers'
import { placard } from './placard'
import { souspente } from './souspente'
import { tv } from './tv'
import { bardage } from './bardage'
import { table } from './table'
import { coulissante } from './coulissante'
import { bureau } from './bureau'
import { portes } from './portes'
import { escalier } from './escalier'

/**
 * Le registre des meubles configurables. Ajouter un type = ajouter un module à
 * côté de celui-ci et une entrée ici — rien d'autre ne bouge, hormis son schéma
 * dans components/Schematics.tsx.
 */
export const FURNITURE: Record<FurnitureKey, FurnitureType> = {
  placard,
  souspente,
  tv,
  bardage,
  table,
  coulissante,
  bureau,
  portes,
  escalier,
}

/**
 * Ordre d'affichage dans la bande de présélection. La porte coulissante n'y
 * figure pas : c'est une sous-rubrique de « Portes », voir SUBTYPES ci-dessous.
 */
export const FURNITURE_KEYS: FurnitureKey[] = [
  'placard',
  'souspente',
  'tv',
  'bardage',
  'table',
  'bureau',
  'portes',
  'escalier',
]

/**
 * Sous-rubriques d'une famille de la présélection : le configurateur affiche un
 * second niveau de choix pour basculer entre les types du groupe, sans qu'ils
 * n'apparaissent tous dans la bande principale. Seules les « Portes » en ont
 * un aujourd'hui (porte battante / porte coulissante).
 */
export const SUBTYPES: Partial<Record<FurnitureKey, FurnitureKey[]>> = {
  portes: ['portes', 'coulissante'],
}

/**
 * Configuration de départ de chaque type, mémorisée par le configurateur.
 * Porte sur tout le registre (pas seulement FURNITURE_KEYS) pour couvrir aussi
 * les sous-rubriques, comme la porte coulissante.
 */
export function initialConfigs(): Record<FurnitureKey, FurnitureConfig> {
  return (Object.keys(FURNITURE) as FurnitureKey[]).reduce(
    (acc, key) => {
      acc[key] = defaultsFor(FURNITURE[key].params, FURNITURE[key].options)
      return acc
    },
    {} as Record<FurnitureKey, FurnitureConfig>,
  )
}
