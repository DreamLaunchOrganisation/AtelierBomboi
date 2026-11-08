import type { MaterialInfo, GalleryItem, MaterialKey, OptionKey } from '@/types'
import { BUSINESS } from './seo'

/**
 * Les finitions et leur incidence sur le prix.
 *
 * `mult` multiplie le prix total hors options : 1 est le tarif de référence du
 * type de meuble. Les trois finitions panneau sont calées sur les prix donnés
 * par l'atelier pour un module de placard de 120 × 250 cm — 800 € en mélaminé,
 * 1440 € en stratifié, 1410 € en placage massif.
 */
export const MATERIALS: Record<MaterialKey, MaterialInfo> = {
  chene:      { color: 0xC4935A, hex: '#C4935A', name: 'Chêne naturel',  mult: 1.0 },
  noyer:      { color: 0x5C3D1E, hex: '#5C3D1E', name: 'Noyer massif',   mult: 1.16 },
  blanc:      { color: 0xF0EDE8, hex: '#F0EDE8', name: 'Blanc mat',      mult: 0.94 },
  anthracite: { color: 0x3A3835, hex: '#3A3835', name: 'Anthracite',     mult: 0.96 },
  // Mult calé sur le seul repère donné par l'atelier (escalier 300×90 : 3800 € chêne, 3400 € hêtre).
  hetre:      { color: 0xE3C9A0, hex: '#E3C9A0', name: 'Hêtre massif',   mult: 0.895 },

  melamine:  {
    color: 0xEDE8E0, hex: '#EDE8E0', name: 'Mélaminé',
    note: 'couleur au choix', mult: 1.0,
  },
  stratifie: {
    color: 0xD3CBBE, hex: '#D3CBBE', name: 'Stratifié',
    note: 'couleur au choix', mult: 1.8,
  },
  placage:   {
    color: 0xC4935A, hex: '#C4935A', name: 'Placage massif',
    note: 'chêne ou noyer, huile au choix', mult: 1.7625,
  },

  // Gamme bardage — tarif au m² fixé par matériau (voir lib/furniture/bardage.ts),
  // le mult ci-dessous ne sert pas puisque le type fournit son priceOverride.
  ayous:      { color: 0xE8D9B0, hex: '#E8D9B0', name: 'Ayous',            mult: 1 },
  autoclave:  { color: 0x2A2A28, hex: '#2A2A28', name: 'Autoclavé noir',   mult: 1 },
  brule:      { color: 0x1C1712, hex: '#1C1712', name: 'Bois brûlé',       mult: 1 },
  filberteck: { color: 0x8A7A63, hex: '#8A7A63', name: 'Filberteck',       mult: 1 },

  // Gamme portes — prix par palier d'ébrasement (voir lib/furniture/portes.ts),
  // le mult ci-dessous ne sert pas puisque le type fournit son priceOverride.
  apeindre: { color: 0xF4F1EA, hex: '#F4F1EA', name: 'À peindre', mult: 1 },
  massif:   { color: 0xC4935A, hex: '#C4935A', name: 'Massif',    mult: 1 },

  // Chêne avec note « huile au choix » — même essence et même mult que `chene`,
  // reprise à part pour ne pas afficher la note partout où `chene` est proposé.
  cheneHuile: { color: 0xC4935A, hex: '#C4935A', name: 'Chêne', note: 'huile au choix', mult: 1.0 },
  vitree:   { color: 0xBCC4C4, hex: '#BCC4C4', name: 'Vitrée',    mult: 1 },
}

/** Les essences des meubles en bois — la gamme par défaut d'un type. */
export const MATERIAUX_BOIS: MaterialKey[] = ['chene', 'noyer', 'blanc', 'anthracite']

/** La gamme panneau, tarifée au module (voir lib/furniture/placard.ts). */
export const MATERIAUX_PANNEAU: MaterialKey[] = ['melamine', 'stratifie', 'placage']

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
    alt: 'Placard sur mesure à quatre portes en chêne clair, poignées noires, occupant toute la hauteur d\'un mur de chambre.',
  },
  {
    id: 2,
    title: 'Escalier en blocs',
    subtitle: 'Noyer massif',
    desc: 'Marches pleines empilées en quart tournant, débouchant sur une tablette de pierre claire.',
    image: '/realisations/788101954_1377882930992637_6248038658676166447_n.jpg',
    alt: 'Escalier d\'entrée composé de marches massives en noyer empilées en blocs, le long d\'une baie vitrée.',
  },
  {
    id: 3,
    title: 'Cuisine sur mesure',
    subtitle: 'Chêne & pierre noire',
    desc: 'Façades chêne, plan de travail en pierre noire, évier de ferme en céramique.',
    image: '/realisations/cuisine.jpg',
    alt: 'Cuisine sur mesure aux façades en chêne, plan de travail en pierre noire et évier de ferme en céramique blanche.',
  },
  {
    id: 4,
    title: 'Mur d\'armoires rétroéclairé',
    subtitle: 'Placage teinté foncé',
    desc: 'Rangements toute hauteur du sol au plafond, ouverts par deux niches au fond doré.',
    image: '/realisations/788897375_1034073272798570_6417697855803924420_n.jpg',
    alt: 'Séjour bordé d\'un mur d\'armoires toute hauteur en placage foncé, percé de deux niches au fond doré rétroéclairé.',
  },
  {
    id: 5,
    title: 'Escalier quart tournant',
    subtitle: 'Chêne clair',
    desc: 'Marches et palier en chêne, main courante en inox posée au mur.',
    image: '/realisations/786312997_1599146154927814_1786756201932999684_n.jpg',
    alt: 'Escalier intérieur en chêne clair vu depuis le palier, avec une fine main courante métallique fixée au mur.',
  },
  {
    id: 6,
    title: 'Bar à tasseaux',
    subtitle: 'Chêne & pierre noire',
    desc: 'Comptoir habillé de tasseaux verticaux, plan en pierre noire et étagères murales.',
    image: '/realisations/787853309_1383822217185809_4912865275034224301_n.jpg',
    alt: 'Comptoir de bar habillé de tasseaux de chêne verticaux et coiffé d\'un plan en pierre noire, devant un mur vert foncé garni d\'étagères.',
  },
  {
    id: 7,
    title: 'Bibliothèque murale',
    subtitle: 'Chêne & métal noir',
    desc: 'Montants en métal noir, tablettes en chêne, rangements fermés en soubassement.',
    image: '/realisations/bibliotheque.jpg',
    alt: 'Bibliothèque murale à structure métallique noire et tablettes en chêne, posée sur un soubassement de placards bas.',
  },
  {
    id: 8,
    title: 'Escalier droit contrasté',
    subtitle: 'Chêne & anthracite',
    desc: 'Marches en chêne posées sur un limon et des contremarches anthracite.',
    image: '/realisations/788584583_1580308076974548_4986771223904898924_n.jpg',
    alt: 'Escalier droit aux marches en chêne clair contrastant avec les contremarches et le limon peints en anthracite.',
  },
  {
    id: 9,
    title: 'Dressing en niche',
    subtitle: 'Décor chêne',
    desc: 'Penderie, étagères et tiroirs coulissants logés dans un renfoncement peint en noir.',
    image: '/realisations/788195412_1888448582593961_2479209593446428042_n.jpg',
    alt: 'Intérieur de dressing en panneau décor chêne, avec penderie, étagères et six tiroirs, encastré dans une niche noire.',
  },
  {
    id: 10,
    title: 'Extension bardée de bois',
    subtitle: 'Bardage vertical',
    desc: 'Volume vitré en angle, couronné d\'un bardage à lames verticales.',
    image: '/realisations/789463056_874806048902577_5022068689503213366_n.jpg',
    alt: 'Extension de maison en construction, à grandes baies vitrées d\'angle et bardage en bois vertical.',
  },
  {
    id: 11,
    title: 'Meuble télé de séjour',
    subtitle: 'Laque blanche & chêne',
    desc: 'Niches ouvertes, tablettes en chêne et rangements fermés en soubassement.',
    image: '/realisations/788628746_1052473650739378_1042346468735050433_n.jpg',
    alt: 'Meuble de séjour blanc toute hauteur avec niches, tablettes en chêne, téléviseur encastré et portes fermées en partie basse.',
  },
  {
    id: 12,
    title: 'Emmarchement en chêne',
    subtitle: 'Chêne massif',
    desc: 'Premières marches massives, dans le prolongement d\'un parquet en point de Hongrie.',
    image: '/realisations/789398127_1024408467268069_8400186247290019696_n.jpg',
    alt: 'Premières marches d\'un escalier en chêne massif posées au bord d\'un parquet en point de Hongrie.',
  },
  {
    id: 13,
    title: 'Porte à lames verticales',
    subtitle: 'Chêne massif',
    desc: 'Vantail en lames larges et bâti assorti, béquille noire.',
    image: '/realisations/787177963_1389069609315940_6073225092283417716_n.jpg',
    alt: 'Porte intérieure en chêne massif à larges lames verticales, avec son bâti en chêne et une poignée noire.',
  },
  {
    id: 14,
    title: 'Rangement sous pente',
    subtitle: 'Décor chêne',
    desc: 'Penderie, tiroirs et niches épousant la pente, soulignés d\'un bandeau LED.',
    image: '/realisations/793719495_1776894036844635_4991353388253518695_n.jpg',
    alt: 'Meuble de rangement sous pente en panneau décor chêne, composé d\'une penderie, de tiroirs et de niches éclairées par un ruban LED.',
  },
  {
    id: 15,
    title: 'Verrière intérieure',
    subtitle: 'Chêne',
    desc: 'Châssis vitré ouvert dans un mur de briques, tablette assortie sous la baie.',
    image: '/realisations/789324810_2240799266703131_8574074955915313531_n.jpg',
    alt: 'Verrière intérieure à petits bois en chêne percée dans un mur de briques peintes en blanc, sous un plafond lambrissé.',
  },
  {
    id: 16,
    title: 'Table de salle à manger',
    subtitle: 'Frêne teinté',
    desc: 'Plateau massif à chants adoucis sur piètement métal noir, huit couverts.',
    image: '/realisations/788461090_1724204902171976_4448971487916051222_n.jpg',
    alt: 'Grande table de salle à manger au plateau en frêne teinté brun, posée sur de fins pieds métalliques noirs et entourée de chaises.',
  },
  {
    id: 17,
    title: 'Placard toute hauteur',
    subtitle: 'Chêne teinté noir',
    desc: 'Façades sans poignées du sol au plafond, percées d\'une niche en chêne clair.',
    image: '/realisations/789136386_1067199362741388_8855655427770135437_n.jpg',
    alt: 'Mur de placards toute hauteur en chêne teinté noir, sans poignées, avec une niche ouverte en chêne clair en partie basse.',
  },
  {
    id: 18,
    title: 'Garage habillé de bois',
    subtitle: 'Bardage noir',
    desc: 'Volume annexe entièrement bardé de lames verticales teintées noir.',
    image: '/realisations/793090223_1909092770253881_8500901527930312547_n.jpg',
    alt: 'Garage accolé à une maison, habillé d\'un bardage en lames de bois verticales teintées noir, avec porte sectionnelle.',
  },
  {
    id: 19,
    title: 'Sous-escalier aménagé',
    subtitle: 'Décor chêne',
    desc: 'Placards, tiroirs et banquette de lecture au fond terracotta.',
    image: '/realisations/790574249_1123830843306758_6082452332695702300_n.jpg',
    alt: 'Aménagement sous escalier en panneau décor chêne : placards, tiroirs et niche-banquette au fond peint en terracotta.',
  },
  {
    id: 20,
    title: 'Meuble télé et cave à vin',
    subtitle: 'Noir mat & chêne',
    desc: 'Caisson bas noir, cave à vin intégrée et panneau de tasseaux au mur.',
    image: '/realisations/791245033_1874307940617843_5764207563051343259_n.jpg',
    alt: 'Meuble bas noir mat courant le long d\'un mur de séjour, avec cave à vin vitrée et panneau mural en tasseaux de chêne.',
  },
  {
    id: 21,
    title: 'Escalier et placards intégrés',
    subtitle: 'Chêne & laque blanche',
    desc: 'Volée en chêne massif dont le dessous se referme en rangements blancs.',
    image: '/realisations/791383399_1535582045008826_6649169598721179594_n.jpg',
    alt: 'Escalier quart tournant en chêne massif dont le dessous est fermé par des placards blancs sans poignées.',
  },
  {
    id: 22,
    title: 'Table haute de cuisine',
    subtitle: 'Chêne massif',
    desc: 'Plateau à rive naturelle, fentes comblées de noir, sur pied panneau.',
    image: '/realisations/788284397_2491267248053057_1902649665919180825_n.jpg',
    alt: 'Table haute au plateau de chêne massif à bord naturel et fentes remplies de résine noire, posée sur un pied en panneau de chêne.',
  },
  {
    id: 23,
    title: 'Dressing de chambre',
    subtitle: 'Décor chêne & noir',
    desc: 'Quatre portes ouvertes sur penderie, tiroirs noirs et colonnes d\'étagères.',
    image: '/realisations/790307712_1380119097612491_1411862916727891217_n.jpg',
    alt: 'Dressing de chambre en panneau décor chêne, portes ouvertes sur une penderie, des tiroirs noirs et des colonnes d\'étagères.',
  },
  {
    id: 24,
    title: 'Claustra de séparation',
    subtitle: 'Noyer',
    desc: 'Cloison à tasseaux qui sépare la salle à manger du salon sans couper la lumière.',
    image: '/realisations/789923513_1635385711278400_6530855669085882146_n.jpg',
    alt: 'Cloison claustra en tasseaux de noyer séparant une salle à manger d\'un salon, projetant son ombre sur le sol en béton ciré.',
  },
  {
    id: 25,
    title: 'Cuisine à cadres',
    subtitle: 'Chêne & plan noir',
    desc: 'Façades à cadre en chêne, plan de travail noir et crédence en carreaux métro.',
    image: '/realisations/790224644_1065644252854438_2520101953342533362_n.jpg',
    alt: 'Bloc de cuisine aux façades en chêne à cadre, plan de travail noir et crédence en carreaux métro blancs.',
  },
  {
    id: 26,
    title: 'Escalier en cours de pose',
    subtitle: 'Chêne massif',
    desc: 'Volée droite posée avant les finitions, marches déjà à leur cote définitive.',
    image: '/realisations/793108625_1067725615615351_1154241717792498555_n.jpg',
    alt: 'Escalier droit en chêne massif fraîchement posé dans une cage d\'escalier encore en chantier.',
  },
  {
    id: 27,
    title: 'Armoire quatre portes',
    subtitle: 'Décor chêne clair',
    desc: 'Volume toute hauteur ajusté entre les murs, poignées bâton noires.',
    image: '/realisations/792223763_1037755635745623_5678568919595555928_n.jpg',
    alt: 'Armoire quatre portes toute hauteur en panneau décor chêne clair, ajustée entre deux murs, avec poignées bâton noires.',
  },
  {
    id: 28,
    title: 'Rehausse en bardage bois',
    subtitle: 'Bardage vertical',
    desc: 'Étage habillé de lames verticales, posé sur le volume de brique existant.',
    image: '/realisations/790385276_1275114727995932_8379671089652142921_n.jpg',
    alt: 'Maison en rénovation dont l\'étage est habillé d\'un bardage en lames de bois verticales, un matin de brouillard.',
  },
  {
    id: 29,
    title: 'Hall d\'entrée',
    subtitle: 'Laque blanche & noyer',
    desc: 'Placards toute hauteur et niche-banquette pour se déchausser.',
    image: '/realisations/793850047_1766170271289431_5730982367664216458_n.jpg',
    alt: 'Hall d\'entrée fermé par des placards blancs toute hauteur, avec une niche-banquette en noyer.',
  },
  {
    id: 30,
    title: 'Table et mur d\'armoires',
    subtitle: 'Chêne teinté',
    desc: 'Table massive face aux rangements toute hauteur et à leurs niches éclairées.',
    image: '/realisations/790058067_2310291206472512_7290377960668429556_n.jpg',
    alt: 'Table de repas en chêne teinté dans un séjour ouvert, face à un mur d\'armoires foncé percé de niches rétroéclairées.',
  },
  {
    id: 31,
    title: 'Placard sous rampant',
    subtitle: 'Placage teinté foncé',
    desc: 'Façades taillées dans la pente, sans poignée apparente.',
    image: '/realisations/791560613_1602732984839803_7768045856309688245_n.jpg',
    alt: 'Placard toute hauteur en placage teinté foncé, dont les portes suivent la pente du plafond, dans une pièce sous comble.',
  },
  {
    id: 32,
    title: 'Habillage d\'entrée',
    subtitle: 'Bardage bois',
    desc: 'Retour de façade habillé de lames verticales, entre brique et baie vitrée.',
    image: '/realisations/794327093_1546313804202341_8250877302570564663_n.jpg',
    alt: 'Pilier d\'entrée de maison habillé d\'un bardage en lames de bois verticales, entre un mur de briques et une baie vitrée.',
  },
  {
    id: 33,
    title: 'Comptoir d\'accueil',
    subtitle: 'Chêne cintré & marbre',
    desc: 'Banque courbe en chêne, plan en marbre, poste de service intégré.',
    image: '/realisations/793899651_1094149776600352_4725430280892109084_n.jpg',
    alt: 'Comptoir d\'accueil aux flancs cintrés en chêne et plan en marbre blanc, dans une pièce aux murs rouges.',
  },
  {
    id: 34,
    title: 'Meuble télé encastré',
    subtitle: 'Noir mat & chêne',
    desc: 'Écran logé dans un caisson noir, rangements refermés par des portes coulissantes.',
    image: '/realisations/791659503_1393475636261175_6123274772489856752_n.jpg',
    alt: 'Meuble de séjour noir mat encastré entre deux murs, avec téléviseur, tablettes en chêne et portes coulissantes.',
  },
  {
    id: 35,
    title: 'Placards sous pente',
    subtitle: 'Laque blanche',
    desc: 'Portes et tiroirs sans poignée, recoupés à l\'exacte inclinaison du toit.',
    image: '/realisations/788461089_1047585321525674_1705890451927056770_n.jpg',
    alt: 'Alignement de placards blancs toute hauteur sans poignées, recoupés en biais pour suivre la pente d\'un toit.',
  },
  {
    id: 36,
    title: 'Portes d\'angle',
    subtitle: 'Placage chêne',
    desc: 'Deux vantaux dans l\'angle du hall, bâtis et quincaillerie assortis.',
    image: '/realisations/790912214_1087333063976976_8344994360426564244_n.jpg',
    alt: 'Deux portes intérieures en placage de chêne posées dans l\'angle d\'un hall, avec bâtis assortis et poignées noires.',
  },
  {
    id: 37,
    title: 'Claustra d\'un bar à vin',
    subtitle: 'Panneau noir',
    desc: 'Étagères verticales en quinconce, à la fois vitrine et séparation de salle.',
    image: '/realisations/788985236_2130395014541890_7403161509429380385_n.jpg',
    alt: 'Cloison ajourée en panneaux noirs formant des étagères à bouteilles, séparant deux salles d\'un bar à vin.',
  },
  {
    id: 38,
    title: 'Extension sur deux niveaux',
    subtitle: 'Bardage vertical',
    desc: 'Volume vitré greffé sur un pignon de pierre, encadré de lames verticales.',
    image: '/realisations/791659503_1780322962994019_7569707740422434387_n.jpg',
    alt: 'Extension vitrée sur deux niveaux encadrée d\'un bardage en lames de bois verticales, accolée à une maison en pierre.',
  },
  {
    id: 39,
    title: 'Soubassement en bois brûlé',
    subtitle: 'Bois brûlé',
    desc: 'Habillage sombre au pied d\'une véranda, protégé par une couvertine.',
    image: '/realisations/790224644_2360856131389636_4660753495062662396_n.jpg',
    alt: 'Soubassement de véranda habillé de planches de bois brûlé noir, sous des châssis en aluminium gris.',
  },
  {
    id: 40,
    title: 'Porte à panneau',
    subtitle: 'Chêne massif',
    desc: 'Vantail à grand panneau, bâti chêne et quincaillerie noire.',
    image: '/realisations/789593306_1733971324484193_6956362626000810975_n.jpg',
    alt: 'Porte intérieure en chêne massif à grand panneau, poignée et charnières noires, dans un logement en chantier.',
  },
  {
    id: 41,
    title: 'Banquette de restaurant',
    subtitle: 'Placage chêne',
    desc: 'Dosseret pleine hauteur, étagères filantes et assise sur mesure.',
    image: '/realisations/789593330_2023482724968532_3194447601134892771_n.jpg',
    alt: 'Banquette de restaurant adossée à un panneau de chêne garni d\'étagères, devant deux tables en marbre.',
  },
  {
    id: 42,
    title: 'Séjour tout en bois',
    subtitle: 'Placage teinté foncé',
    desc: 'Rangements toute hauteur, niches dorées et table de repas assortie.',
    image: '/realisations/793350695_1059789953513272_5790946404795607982_n.jpg',
    alt: 'Séjour ouvert bordé de rangements toute hauteur en placage foncé, avec niches rétroéclairées et table de repas en bois.',
  },
  {
    id: 43,
    title: 'Portes de palier',
    subtitle: 'Placage chêne teinté',
    desc: 'Deux vantaux et leurs bâtis, posés sur un sol en marbre.',
    image: '/realisations/793850047_2514856445691431_6209855805279881723_n.jpg',
    alt: 'Deux portes intérieures en placage de chêne teinté avec leurs bâtis, dans une pièce au sol en marbre blanc.',
  },
  {
    id: 44,
    title: 'Placard de couloir',
    subtitle: 'Laque blanche',
    desc: 'Colonne toute hauteur qui referme un renfoncement étroit.',
    image: '/realisations/791042725_1077312714679189_4904092722448745244_n.jpg',
    alt: 'Placard blanc toute hauteur à deux portes et poignées noires, encastré dans un couloir étroit.',
  },
  {
    id: 45,
    title: 'Enfilade de rangements',
    subtitle: 'Placage teinté foncé',
    desc: 'Façades continues sur toute la longueur du séjour, ponctuées de niches rétroéclairées.',
    image: '/realisations/792694911_1084982160947709_8947407516730676536_n.jpg',
    alt: 'Longue enfilade de rangements toute hauteur en placage foncé le long d\'un séjour, ponctuée de niches au fond doré.',
  },
  {
    id: 46,
    title: 'Comptoir de service',
    subtitle: 'Noir mat & chêne',
    desc: 'Banque en L, retour habillé de tasseaux, en cours d\'installation.',
    image: '/realisations/793899651_1391484872955114_3374099368258600558_n.jpg',
    alt: 'Comptoir de service en L à plan noir mat, avec un dosseret en tasseaux de chêne, dans un local en chantier.',
  },
  {
    id: 47,
    title: 'Sous-escalier en vieux bois',
    subtitle: 'Bois de récupération',
    desc: 'Joue et cloison en planches anciennes, éclairées par une ligne de LED.',
    image: '/realisations/790238990_1909504536696171_3494556920727949274_n.jpg',
    alt: 'Habillage de sous-escalier en planches de vieux bois souligné par un éclairage LED, ouvrant sur une cloison assortie.',
  },
  {
    id: 48,
    title: 'Porte et miroir de hall',
    subtitle: 'Laque blanche',
    desc: 'Vantail affleurant et miroir encadré, posés dans le même dégagement.',
    image: '/realisations/786467623_1544098523593850_51849021008856175_n.jpg',
    alt: 'Porte intérieure blanche à poignée noire et grand miroir encadré de blanc, dans un couloir au sol en parquet.',
  },
  {
    id: 49,
    title: 'Cloison de combles',
    subtitle: 'Plâtre & porte laquée',
    desc: 'Cloison montée sous rampant avec sa porte, prête à peindre.',
    image: '/realisations/790424498_1117608487270317_1253244677185517757_n.jpg',
    alt: 'Cloison en plaques de plâtre montée sous rampant avec sa porte blanche, dans des combles en cours d\'aménagement.',
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

/**
 * Les coordonnées affichées dans la section contact.
 *
 * Les valeurs sont dérivées de `BUSINESS` plutôt que recopiées : ce sont les
 * mêmes que celles déclarées à Google dans les données structurées, et un
 * numéro qui diverge entre l'écran et le JSON-LD est une incohérence relevée
 * par les moteurs. Un seul endroit à corriger si l'atelier déménage.
 */
export const CONTACT_DETAILS = [
  {
    icon: '📍',
    label: 'Atelier',
    value: `${BUSINESS.street}, ${BUSINESS.locality} ${BUSINESS.postalCode}`,
  },
  { icon: '📞', label: 'Téléphone', value: BUSINESS.phoneDisplay },
  { icon: '✉',  label: 'Email',     value: BUSINESS.email },
  { icon: '🕐', label: 'Horaires',  value: BUSINESS.hoursDisplay },
]
