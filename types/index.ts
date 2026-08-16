import type * as THREE from 'three'

export type MaterialKey = 'chene' | 'noyer' | 'blanc' | 'anthracite'

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

/** Une mesure au curseur. */
export interface NumberParam {
  kind: 'number'
  key: string
  label: string
  min: number
  max: number
  step: number
  /** Suffixe affiché à côté de la valeur. ' cm' par défaut, '' pour un décompte. */
  unit?: string
  def: number
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
  /** Gabarit maximal en mètres — sert à cadrer la caméra sur le type. */
  maxDims: { w: number; h: number; d: number }
  build(config: FurnitureConfig, color: number): THREE.Group
  /** Base HT, avant multiplicateur d'essence et options. */
  price(config: FurnitureConfig): number
}

export interface MaterialInfo {
  color: number
  name: string
  mult: number
  hex: string
}

export interface PriceBreakdown {
  pStructure: number
  pMateriau: number
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
