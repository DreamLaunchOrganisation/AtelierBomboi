/**
 * Les pages services.
 *
 * Chaque entrée est une page indexable, faite pour accueillir un visiteur venu
 * d'une recherche précise — « escalier chêne sur mesure Charleroi » plutôt que
 * « menuisier ». La page d'accueil reste la vitrine complète ; celles-ci
 * répondent à une intention et renvoient vers le configurateur.
 *
 * Volontairement sans prix : les tarifs vivent dans lib/furniture/ et le
 * configurateur les calcule. Recopiés ici, ils finiraient par mentir.
 */

export type ServiceSlug =
  | 'dressing-sur-mesure'
  | 'escalier-sur-mesure'
  | 'cuisine-sur-mesure'
  | 'bardage-bois'

export interface Service {
  slug: ServiceSlug
  /** Le nom court de la prestation, pour le fil d'Ariane et les liens. */
  label: string
  /** Le nom complet, pour les données structurées. */
  name: string
  /** Le titre d'onglet. Google en coupe l'affichage vers 60 caractères. */
  metaTitle: string
  /** La description sous le lien dans les résultats. Viser 150 à 160 caractères. */
  metaDescription: string
  /** Le libellé en petites capitales au-dessus du titre. */
  eyebrow: string
  /** Le titre de la page. Un seul h1, et il porte la requête visée. */
  h1: string
  /** Le paragraphe d'attaque. */
  intro: string
  /**
   * Les requêtes visées, de la principale aux variantes. La première sert de
   * `serviceType` dans les données structurées.
   */
  keywords: readonly string[]
  sections: readonly { title: string; body: string }[]
  /** Les finitions proposées, telles que les nomme l'atelier. */
  materials: readonly string[]
  faq: readonly { q: string; a: string }[]
  /**
   * Les réalisations de GALLERY_ITEMS qui illustrent cette prestation.
   *
   * La correspondance vit ici et non dans la galerie : elle appartient au
   * service, et les 49 entrées de GALLERY_ITEMS n'ont pas à savoir que ces
   * pages existent.
   */
  galleryIds: readonly number[]
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'dressing-sur-mesure',
    label: 'Dressings & placards',
    name: 'Dressing et placard sur mesure',
    metaTitle: 'Dressing sur mesure à Charleroi',
    metaDescription:
      "Dressings, placards et rangements sur mesure fabriqués dans notre atelier de Jumet. Sous pente, en niche, toute hauteur. Visite technique et devis gratuits.",
    eyebrow: 'Dressings & placards',
    h1: 'Dressing et placard sur mesure à Charleroi',
    intro:
      "Un placard du commerce s'arrête là où votre mur continue. Nous fabriquons des rangements taillés au centimètre pour l'espace que vous avez : toute hauteur du sol au plafond, en biais sous un rampant, logés dans une niche ou filant sur toute la longueur d'un séjour.",
    keywords: [
      'dressing sur mesure',
      'placard sur mesure',
      'rangement sur mesure',
      'armoire sur mesure',
      'dressing sous pente',
    ],
    sections: [
      {
        title: 'Taillé pour votre mur, pas pour un catalogue',
        body: "Nos menuisiers relèvent les cotes chez vous avant de dessiner quoi que ce soit. Les murs ne sont jamais d'aplomb et les plafonds jamais plats : c'est précisément ce que le sur mesure rattrape. Les façades viennent au contact des murs existants, sans joint de dilatation visible ni bandeau de finition pour masquer l'écart.",
      },
      {
        title: 'Les espaces que personne ne sait meubler',
        body: "Sous un escalier, sous une pente de toit, dans un couloir de quatre-vingts centimètres : ce sont les volumes où le sur mesure change le plus de choses. Nous y logeons penderies, tiroirs coulissants, colonnes d'étagères et parfois une banquette de lecture. Les portes se recoupent à l'inclinaison exacte du toit.",
      },
      {
        title: "L'intérieur se décide avec vous",
        body: "Penderie haute ou double, nombre de tiroirs, hauteur des étagères, bandeau LED en applique ou encastré, miroir intégré, portes coulissantes plutôt que battantes quand le dégagement manque. Chaque aménagement se discute à la visite, puis se retrouve sur le plan que vous validez avant fabrication.",
      },
    ],
    materials: [
      'Mélaminé (couleur au choix)',
      'Stratifié (couleur au choix)',
      'Placage massif chêne ou noyer',
      'Laque blanche',
      'Chêne teinté',
    ],
    faq: [
      {
        q: 'Combien coûte un dressing sur mesure ?',
        a: "Le prix dépend des dimensions, de la finition et des aménagements intérieurs. Le configurateur en ligne donne une estimation immédiate à partir de vos mesures ; le devis définitif est établi après la visite technique, qui est gratuite et sans engagement.",
      },
      {
        q: 'Vous fabriquez des placards sous pente ou sous escalier ?',
        a: "Oui, c'est une grande part de notre travail. Les façades sont recoupées à l'inclinaison relevée sur place, et l'aménagement intérieur s'adapte à la hauteur disponible à chaque endroit du meuble.",
      },
      {
        q: 'Quel délai entre la commande et la pose ?',
        a: "Comptez la fabrication en atelier après validation du plan, puis une journée à deux sur place selon la taille du chantier. Le délai exact vous est confirmé au devis, en fonction du planning de l'atelier.",
      },
      {
        q: 'Intervenez-vous en dehors de Charleroi ?',
        a: "Notre atelier est à Jumet. Nous nous déplaçons dans tout le grand Charleroi — Gilly, Marcinelle, Montignies, Gosselies, Fleurus, Châtelet, Courcelles — et plus largement en Hainaut.",
      },
    ],
    galleryIds: [1, 9, 14, 17, 19, 23, 27, 29, 31, 35, 44, 45, 4],
  },

  {
    slug: 'escalier-sur-mesure',
    label: 'Escaliers',
    name: 'Escalier en bois sur mesure',
    metaTitle: 'Escalier bois sur mesure à Charleroi',
    metaDescription:
      "Escaliers sur mesure en chêne ou hêtre massif, droits ou quart tournant, fabriqués et posés par notre atelier de Jumet. Relevé de cotes et devis gratuits.",
    eyebrow: 'Escaliers',
    h1: 'Escalier en bois sur mesure à Charleroi',
    intro:
      "Un escalier se calcule avant de se dessiner. Hauteur d'étage, trémie disponible, giron et hauteur de marche : ces quatre chiffres décident de tout le reste. Nous les relevons chez vous, puis nous fabriquons la volée en chêne ou en hêtre massif dans notre atelier de Jumet.",
    keywords: [
      'escalier sur mesure',
      'escalier bois',
      'escalier chêne massif',
      'escalier quart tournant',
      'fabricant escalier Charleroi',
    ],
    sections: [
      {
        title: 'Droit, quart tournant, ou en blocs',
        body: "La forme suit la place disponible. Une volée droite quand la trémie le permet, un quart tournant pour rattraper un angle et gagner du dégagement en bas, des marches massives empilées en blocs quand l'escalier devient un élément du séjour plutôt qu'un passage. Nous dessinons les trois et vous montrons ce que chacun coûte en encombrement.",
      },
      {
        title: 'Le massif, et ce qui va avec',
        body: "Marches et paliers en chêne ou en hêtre massif, limon et contremarches assortis ou volontairement contrastés — du chêne clair sur un limon anthracite, par exemple. Main courante en bois tourné, ou fine lisse inox fixée au mur quand on veut dégager la vue. L'huile de finition se choisit sur échantillon.",
      },
      {
        title: 'Le dessous se récupère',
        body: "Le volume sous une volée est le rangement le moins cher de la maison, puisqu'il existe déjà. Nous le refermons par des placards sans poignée, des tiroirs, une niche-banquette, parfois un habillage en planches anciennes. Dessiné en même temps que l'escalier, cet aménagement tombe juste au millimètre.",
      },
    ],
    materials: [
      'Chêne massif (huile au choix)',
      'Hêtre massif',
      'Noyer massif',
      'Limon et contremarches anthracite',
      'Bois de récupération',
    ],
    faq: [
      {
        q: 'Combien coûte un escalier sur mesure en bois ?',
        a: "Le prix dépend de la hauteur d'étage, du nombre de marches, de la forme — une volée droite coûte moins qu'un quart tournant — et de l'essence choisie. Le configurateur donne une estimation à partir de vos dimensions ; le devis définitif suit le relevé de cotes sur place, gratuit.",
      },
      {
        q: 'Chêne ou hêtre, lequel choisir ?',
        a: "Le hêtre est sensiblement moins cher et très dur, avec un grain fin et clair. Le chêne est plus marqué, plus stable dans le temps et prend mieux les huiles foncées. Nous présentons les deux sur échantillon à la visite.",
      },
      {
        q: 'Posez-vous un escalier dans une maison déjà habitée ?',
        a: "Oui. L'escalier est fabriqué en atelier puis posé en une à deux journées, ce qui réduit fortement le chantier chez vous. Les finitions et réglages se font sur place.",
      },
      {
        q: 'Pouvez-vous remplacer un escalier existant ?',
        a: "Oui, en reprenant la trémie existante si elle convient, ou en la retouchant. Le relevé de cotes détermine ce que la configuration actuelle autorise avant qu'on s'engage sur une forme.",
      },
    ],
    galleryIds: [2, 5, 8, 12, 21, 26, 47],
  },

  {
    slug: 'cuisine-sur-mesure',
    label: 'Cuisines',
    name: 'Cuisine sur mesure',
    metaTitle: 'Cuisine sur mesure à Charleroi',
    metaDescription:
      "Cuisines sur mesure fabriquées à Jumet : façades chêne ou laquées, plans de travail pierre, îlots et tables hautes. Visite technique et devis gratuits.",
    eyebrow: 'Cuisines',
    h1: 'Cuisine sur mesure à Charleroi',
    intro:
      "Une cuisine en kit impose ses largeurs de caisson, et c'est le mur qui doit s'y plier — d'où les bandeaux de remplissage et les angles perdus. En fabriquant les caissons à la cote, on récupère ces centimètres et on place les rangements là où le plan de travail en a besoin.",
    keywords: [
      'cuisine sur mesure',
      'cuisine équipée sur mesure',
      'façade cuisine chêne',
      'îlot de cuisine sur mesure',
      'cuisiniste Charleroi',
    ],
    sections: [
      {
        title: 'Façades et plans de travail',
        body: "Façades en chêne massif, à cadre ou à panneau plat, placage teinté, ou laque mate dans la couleur de votre choix. Plans de travail en pierre noire, en marbre ou en bois massif selon l'usage que vous en faites. Évier de ferme en céramique, crédence en carreaux métro : nous coordonnons ces postes avec les fournisseurs plutôt que de vous laisser les assembler.",
      },
      {
        title: "L'implantation avant l'esthétique",
        body: "Le triangle évier-cuisson-froid, la hauteur du plan selon votre taille, la place réelle pour ouvrir un four quand quelqu'un passe derrière : ces contraintes se règlent sur le plan, pas après la pose. Nous relevons les arrivées d'eau, les évacuations et les points électriques à la visite pour éviter les percements de rattrapage.",
      },
      {
        title: 'Îlots, bars et tables hautes',
        body: "Un comptoir habillé de tasseaux verticaux, un îlot coiffé de pierre noire, une table haute en chêne massif à rive naturelle dont les fentes sont comblées de résine noire. Ces pièces prolongent la cuisine vers la pièce à vivre, et c'est souvent là que le sur mesure se voit le plus.",
      },
    ],
    materials: [
      'Chêne massif',
      'Placage chêne ou noyer teinté',
      'Laque mate (couleur au choix)',
      'Plan de travail pierre noire ou marbre',
      'Tasseaux de chêne',
    ],
    faq: [
      {
        q: 'Combien coûte une cuisine sur mesure ?',
        a: "Le prix dépend du linéaire, du nombre de caissons, de la finition des façades et du plan de travail choisi. Le devis est établi après la visite technique, qui est gratuite et sans engagement, sur la base du plan d'implantation validé avec vous.",
      },
      {
        q: 'Fournissez-vous aussi l’électroménager ?',
        a: "Nous fabriquons et posons les meubles, et nous intégrons l'électroménager que vous choisissez — four, plaque, hotte, lave-vaisselle — aux cotes de ses niches. Vous pouvez nous confier l'achat ou le gérer vous-même.",
      },
      {
        q: 'Rénovez-vous une cuisine en gardant les meubles existants ?',
        a: "C'est possible quand les caissons sont sains : on remplace alors les façades, le plan de travail et la crédence. La visite technique dit si cela tient la route ou si une cuisine neuve coûtera moins cher à l'arrivée.",
      },
      {
        q: 'Qui s’occupe du plan de travail en pierre ?',
        a: "Nous le coordonnons. Les caissons sont posés et mis de niveau, le marbrier relève les cotes définitives sur l'ouvrage réel, puis nous revenons pour les finitions et les réglages.",
      },
    ],
    galleryIds: [3, 25, 22, 6],
  },

  {
    slug: 'bardage-bois',
    label: 'Bardage bois',
    name: 'Bardage bois de façade',
    metaTitle: 'Bardage bois de façade à Charleroi',
    metaDescription:
      "Bardage bois de façade posé par notre atelier de Jumet : ayous, autoclavé noir, bois brûlé, Filberteck. Extensions, rehausses, garages. Devis gratuit.",
    eyebrow: 'Bardage bois',
    h1: 'Bardage bois de façade à Charleroi',
    intro:
      "Le bardage change une façade sans y toucher. Posé sur une ossature ventilée devant le mur existant, il habille une extension, une rehausse ou un garage, et laisse le support respirer derrière lui. C'est souvent la manière la moins lourde de rattraper une façade disparate.",
    keywords: [
      'bardage bois',
      'bardage façade',
      'habillage façade bois',
      'bardage lames verticales',
      'bardage bois brûlé',
    ],
    sections: [
      {
        title: 'Les essences et leurs finitions',
        body: "L'ayous est léger, stable et clair, bon marché au mètre carré. L'autoclavé noir est traité en profondeur et demande peu d'entretien. Le bois brûlé, noirci en surface selon le principe du shou sugi ban, résiste naturellement aux insectes et à l'humidité. Le Filberteck tient un gris chaud sans griser de façon irrégulière.",
      },
      {
        title: 'Lames verticales ou horizontales',
        body: "Les lames verticales étirent le volume vers le haut et évacuent l'eau le long du fil du bois ; c'est le sens que nous posons le plus souvent. L'horizontale allonge le bâtiment et se marie mieux aux longues façades basses. Dans les deux cas, l'écartement entre lames se décide sur place : c'est lui qui donne le rythme de la façade.",
      },
      {
        title: 'Ossature, ventilation et couvertines',
        body: "Un bardage mal ventilé pourrit par l'arrière. Nous posons une ossature qui ménage une lame d'air continue, protégée en bas par une grille anti-rongeurs et en haut par une couvertine qui coupe l'eau. Les retours d'angle, les encadrements de baie et les soubassements se traitent au même détail que les grandes surfaces.",
      },
    ],
    materials: [
      'Ayous',
      'Autoclavé noir',
      'Bois brûlé',
      'Filberteck',
    ],
    faq: [
      {
        q: 'Combien coûte un bardage bois au mètre carré ?',
        a: "Le tarif est fixé au mètre carré et varie selon l'essence : l'ayous est le plus accessible, le bois brûlé le plus cher. Le configurateur donne une estimation à partir de la surface ; le devis définitif suit le relevé de façade.",
      },
      {
        q: 'Quel entretien pour un bardage en bois ?',
        a: "L'autoclavé noir et le bois brûlé ne demandent pratiquement rien et grisent lentement. Une essence claire laissée brute grise aussi, de façon inégale selon l'exposition : un saturateur tous les quelques années conserve la teinte d'origine si c'est ce que vous voulez.",
      },
      {
        q: 'Peut-on barder par-dessus une façade en briques ?',
        a: "Oui, c'est le cas le plus courant. L'ossature se fixe dans la maçonnerie existante et ménage la lame d'air ventilée. Nous vérifions l'état du support et les appuis de baie avant de nous engager.",
      },
      {
        q: 'Faut-il un permis pour changer de façade ?',
        a: "Modifier l'aspect extérieur d'un bâtiment relève des règles d'urbanisme de votre commune, et la réponse dépend du bien. Renseignez-vous auprès du service urbanisme avant la commande ; nous vous fournissons les détails techniques du bardage pour le dossier.",
      },
    ],
    galleryIds: [10, 18, 28, 32, 38, 39],
  },
]

/** Retourne le service correspondant au slug, ou `undefined` s'il n'existe pas. */
export function findService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug)
}

/** Les services réduits à ce dont les données structurées de la home ont besoin. */
export const SERVICE_OFFERS = SERVICES.map((service) => ({
  name: service.name,
  description: service.intro,
  path: `/${service.slug}`,
}))
