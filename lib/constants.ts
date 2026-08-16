import type { MaterialInfo, GalleryItem, MaterialKey, OptionKey } from '@/types'

export const MATERIALS: Record<MaterialKey, MaterialInfo> = {
  chene:      { color: 0xC4935A, hex: '#C4935A', name: 'Chêne naturel',  mult: 1.0 },
  noyer:      { color: 0x5C3D1E, hex: '#5C3D1E', name: 'Noyer massif',   mult: 1.4 },
  blanc:      { color: 0xF0EDE8, hex: '#F0EDE8', name: 'Blanc mat',      mult: 0.85 },
  anthracite: { color: 0x3A3835, hex: '#3A3835', name: 'Anthracite',     mult: 0.9 },
}

/**
 * Options transverses. Chaque type de meuble déclare celles qui le concernent
 * (voir lib/furniture) : un escalier ne se ferme pas par des portes coulissantes.
 */
export const OPTIONS: { key: OptionKey; label: string; price: number }[] = [
  { key: 'optPortes',  label: 'Portes coulissantes', price: 380 },
  { key: 'optMiroir',  label: 'Miroir intégré',      price: 220 },
  { key: 'optLumiere', label: 'Éclairage LED',       price: 150 },
  { key: 'optTiroirs', label: 'Tiroirs intérieurs',  price: 280 },
]

/**
 * Les réalisations photographiées de l'atelier.
 *
 * Les fichiers vivent dans public/realisations/. Ajouter une réalisation =
 * déposer sa photo et ajouter une entrée ici ; le carrousel reprend seul sa
 * pagination par trois dès qu'il y a de quoi remplir une deuxième page.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Placard toute hauteur',
    subtitle: 'Chêne clair',
    desc: 'Quatre portes du sol au plafond, poignées noires, ajusté entre les murs.',
    image: '/realisations/dressing.jpg',
    alt: "Placard sur mesure à quatre portes en chêne clair, poignées noires, occupant toute la hauteur d'un mur de chambre.",
  },
  {
    id: 2,
    title: 'Bibliothèque murale',
    subtitle: 'Chêne & métal noir',
    desc: 'Montants en métal noir, tablettes en chêne, rangements fermés en soubassement.',
    image: '/realisations/bibliotheque.jpg',
    alt: 'Bibliothèque murale à structure métallique noire et tablettes en chêne, posée sur un soubassement de placards bas.',
  },
  {
    id: 3,
    title: 'Cuisine sur mesure',
    subtitle: 'Chêne & pierre noire',
    desc: 'Façades chêne, plan de travail en pierre noire, évier de ferme en céramique.',
    image: '/realisations/cuisine.jpg',
    alt: 'Cuisine sur mesure aux façades en chêne, plan de travail en pierre noire et évier de ferme en céramique blanche.',
  },
]

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Configuration en ligne',
    desc: 'Entrez vos dimensions, choisissez vos matériaux et obtenez une estimation de prix instantanée.',
  },
  {
    num: '02',
    title: 'Visite technique gratuite',
    desc: 'Notre artisan se déplace chez vous pour valider les mesures et affiner le projet avec vous.',
  },
  {
    num: '03',
    title: 'Fabrication artisanale',
    desc: 'Votre meuble est fabriqué à la main dans notre atelier local, avec les matériaux que vous avez choisis.',
  },
  {
    num: '04',
    title: 'Pose & finitions',
    desc: 'Installation soignée par notre équipe, avec tous les réglages nécessaires pour un résultat parfait.',
  },
]

export const CONTACT_DETAILS = [
  { icon: '📍', label: 'Atelier',   value: 'Zoning industriel, Jumet 6040' },
  { icon: '📞', label: 'Téléphone', value: '+32 496 98 93 60' },
  { icon: '✉',  label: 'Email',     value: 'marcobomboi05@gmail.com' },
  { icon: '🕐', label: 'Horaires',  value: 'Lun–Sam 7h–17h' },
]
