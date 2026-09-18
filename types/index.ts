import type * as THREE from 'three'

/**
 * Les finitions du catalogue. Les quatre premières servent aux meubles en bois ;
 * les trois dernières sont la gamme panneau du placard droit.
 */
export type MaterialKey =
  | 'chene'
  | 'noyer'
  | 'blanc'
  | 'anthracite'
  | 'hetre'
  | 'melamine'
  | 'stratifie'
  | 'placage'
  | 'ayous'
  | 'autoclave'
  | 'brule'
  | 'filberteck'
  | 'apeindre'
  | 'massif'
  | 'vitree'
  | 'cheneHuile'

/** Les neuf familles de meubles proposées à la présélection. */
export type FurnitureKey =
  | 'placard'
  | 'souspente'
  | 'tv'
  | 'bardage'
  | 'table'
  | 'coulissante'
  | 'bureau'
  | 'portes'
  | 'escalier'

export type OptionKey = 'optPortes' | 'optMiroir' | 'optLumiere' | 'optTiroirs'

/** Une mesure au curseur, ou saisie directement dans un champ. */
export interface NumberParam {
  kind: 'number'
  key: string
  label: string
  min: number
  max: number
  step: number
  /** Suffixe affiché à côté de la valeur. ' cm' par défaut, '' pour un décompte. */
  unit?: string
  /** Précision affichée en petit sous le contrôle — une règle de tarif, une contrainte. */
  hint?: string
  def: number
  /** 'slider' par défaut. 'input' pour une valeur que le client tape plutôt qu'il ne cadre — une surface, par exemple. */
  control?: 'slider' | 'input'
}

/** Un choix parmi quelques valeurs, rendu en boutons segmentés. */
export interface ChoiceParam {
  kind: 'choice'
  key: string
  label: string
  choices: { value: string; label: string }[]
  def: string
}

/** Un oui/non, rendu en case à cocher. */
export interface ToggleParam {
  kind: 'toggle'
  key: string
  label: string
  def: boolean
}

export type ParamDef = NumberParam | ChoiceParam | ToggleParam

export type ParamValue = number | string | boolean

/** Valeurs saisies pour un meuble : les paramètres du type + les options cochées. */
export type FurnitureConfig = Record<string, ParamValue>

export interface FurnitureType {
  key: FurnitureKey
  label: string
  /** Une phrase sous le panneau de réglages, pour situer le produit. */
  tagline: string
  params: ParamDef[]
  /** Options globales applicables à ce meuble. */
  options: OptionKey[]
  /** Finitions proposées pour ce type. Par défaut MATERIAUX_BOIS. */
  materials?: MaterialKey[]
  /** Gabarit maximal en mètres — sert à cadrer la caméra sur le type. */
  maxDims: { w: number; h: number; d: number }
  build(config: FurnitureConfig, color: number): THREE.Group
  /** Base HT, avant multiplicateur d'essence et options. */
  price(config: FurnitureConfig): number
  /**
   * Remplace `price(config) × mult(essence)` quand le tarif ne suit pas ce
   * schéma — un matériau qui fixe un prix au m² plutôt qu'un multiplicateur
   * (bardage), ou un prix par palier qui ne dépend pas de l'essence (portes).
   */
  priceOverride?(config: FurnitureConfig, materiau: MaterialKey): number
  /**
   * Remplace la somme des options cochées quand le second poste du devis
   * n'est pas une liste d'options togglables — l'isolation du bardage, comptée
   * au m² et toujours incluse.
   */
  optionsOverride?(config: FurnitureConfig): number
  /** Intitulés des deux lignes de la ventilation de prix, et de la ligne de total. « Meuble » / « Options » / « Estimation totale » par défaut. */
  priceLabels?: { meuble: string; options: string; total?: string }
  /** Suffixe affiché après chaque prix. ' €' par défaut, ' €/m²' pour un tarif non multiplié par une surface saisie. */
  priceUnit?: string
}

export interface MaterialInfo {
  color: number
  name: string
  /** Multiplicateur du prix total hors options. 1 = tarif de référence. */
  mult: number
  hex: string
  /** Précision affichée sous le nom — « couleur au choix », « huile au choix ». */
  note?: string
}

export interface PriceBreakdown {
  /** Le meuble lui-même : fabrication et finition, hors options. */
  pMeuble: number
  pOptions: number
  total: number
}

export interface GalleryItem {
  id: number
  title: string
  /** Cartouche posé sur la photo : la matière dominante. */
  subtitle: string
  desc: string
  /** Chemin depuis public/ — par exemple /realisations/dressing.jpg */
  image: string
  /** Description de la photo pour les lecteurs d'écran et si elle ne charge pas. */
  alt: string
}
