import type { CSSProperties } from 'react'

/**
 * L'épure du hero : le plan d'un meuble se trace au fil des secondes, sa cote
 * s'inscrit, puis tout s'efface et la pièce suivante se dessine.
 *
 * Entièrement en CSS — aucun JavaScript, aucun canvas, aucun compteur à
 * synchroniser. Les quatre meubles sont superposés dans le même SVG ; chacun
 * n'occupe qu'un quart du cycle, décalé par sa variable `--k`.
 *
 * Deux valeurs de trait, comme sur la maquette : l'orange de marque pour ce qui
 * porte le meuble — carcasse et ligne de cote — et un blanc atténué pour les
 * refends et les étagères. C'est ce contraste qui fait lire le dessin.
 *
 * Registre distinct de components/Schematics.tsx : ces dessins-ci sont conçus
 * pour être animés (un `pathLength` normalisé, une cote, un délai par trait),
 * là où les vignettes du configurateur sont des dessins fixes.
 */

type TraceAttrs = {
  'data-trace': 'porteur' | 'refend'
  pathLength: number
  style: CSSProperties & { '--d': number }
}

/** Un trait porteur : carcasse, ligne de cote. `rank` est son rang, en secondes. */
function trace(rank: number): TraceAttrs {
  return { 'data-trace': 'porteur', pathLength: 1, style: { '--d': rank } }
}

/** Un refend ou une étagère : trait secondaire, plus discret. */
function refend(rank: number): TraceAttrs {
  return { 'data-trace': 'refend', pathLength: 1, style: { '--d': rank } }
}

/** La cote chiffrée, qui s'inscrit une fois le meuble tracé. */
const cote = { 'data-trace-text': '' }

/** Un meuble du cycle. `--k` est son rang, donc son quart de cycle. */
function piece(index: number): { style: CSSProperties & { '--k': number } } {
  return { style: { '--k': index } }
}

export default function HeroBlueprint() {
  return (
    <svg
      viewBox="0 0 200 205"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Le plafond en vh évite qu'une fenêtre basse et large ne fasse déborder
      // l'épure sous la barre de navigation. `ml-auto` la garde plaquée à
      // droite quand ce plafond la rétrécit.
      className="blueprint block ml-auto w-full h-auto max-h-[58vh]"
      aria-hidden="true"
    >
      {/* ---------- Placard droit ---------- */}
      <g {...piece(0)}>
        <path {...trace(0)} d="M32 14 H168 V174 H32 Z" />
        <path {...refend(1.1)} d="M77 14 V174" />
        <path {...refend(1.35)} d="M122 14 V174" />
        <path {...refend(1.8)} d="M32 58 H77" />
        <path {...refend(2)} d="M77 52 H122" />
        <path {...refend(2.2)} d="M77 94 H122" />
        <path {...refend(2.4)} d="M77 136 H122" />
        <path {...refend(2.6)} d="M122 70 H168" />
        <path {...refend(2.8)} d="M122 120 H168" />
        <path {...refend(2.95)} d="M129 128 H161 V148 H129 Z" />
        <path {...trace(3.1)} d="M32 192 H168" />
        <path {...trace(3.1)} d="M32 187 V197" />
        <path {...trace(3.1)} d="M168 187 V197" />
        <text {...cote} x="100" y="186" textAnchor="middle">240 cm</text>
      </g>

      {/* ---------- Meuble sous pente ---------- */}
      <g {...piece(1)}>
        <path {...trace(0)} d="M32 174 V78 L168 30 V174 Z" />
        <path {...refend(1.1)} d="M77 174 V62" />
        <path {...refend(1.35)} d="M122 174 V46" />
        <path {...refend(1.8)} d="M32 120 H77" />
        <path {...refend(2)} d="M77 104 H122" />
        <path {...refend(2.2)} d="M77 142 H122" />
        <path {...refend(2.4)} d="M122 92 H168" />
        <path {...refend(2.6)} d="M122 132 H168" />
        <path {...trace(3.1)} d="M32 192 H168" />
        <path {...trace(3.1)} d="M32 187 V197" />
        <path {...trace(3.1)} d="M168 187 V197" />
        <text {...cote} x="100" y="186" textAnchor="middle">300 cm</text>
      </g>

      {/* ---------- Escalier ----------
          La volée part du sol et monte par pas de 20 : les angles rentrants
          tombent tous sur la droite y = 200 − x, qui est donc exactement le
          limon. La rampe lui est parallèle, 22 plus haut.

          Le sol est à 172 et non 180 : la ligne de terre passait sinon sous
          la cote chiffrée, qui monte jusqu'à 178 depuis sa ligne de base. */}
      <g {...piece(2)}>
        <path
          {...trace(0)}
          d="M28 172 V152 H48 V132 H68 V112 H88 V92 H108 V72 H128 V52 H148 V32 H168"
        />
        <path {...refend(1.6)} d="M168 32 L28 172" />
        <path {...trace(2)} d="M18 172 H182" />
        <path {...refend(2.4)} d="M40 138 L172 6" />
        <path {...refend(2.6)} d="M60 132 V118" />
        <path {...refend(2.75)} d="M140 52 V38" />
        <path {...trace(3.1)} d="M28 192 H168" />
        <path {...trace(3.1)} d="M28 187 V197" />
        <path {...trace(3.1)} d="M168 187 V197" />
        <text {...cote} x="98" y="186" textAnchor="middle">16 marches</text>
      </g>

      {/* ---------- Table ---------- */}
      <g {...piece(3)}>
        <path {...trace(0)} d="M28 74 H154 L172 58 H46 Z" />
        <path {...trace(0.8)} d="M28 74 V84 H154 V74" />
        <path {...trace(1.1)} d="M154 84 L172 68 V58" />
        <path {...refend(1.6)} d="M36 84 V150 M44 84 V150 M36 150 H44" />
        <path {...refend(1.9)} d="M138 84 V150 M146 84 V150 M138 150 H146" />
        {/* Le pied arrière-droit démarre sous le plateau, pas devant : son
            sommet suit le dessous du chant, de 79 à 73 selon l'abscisse. */}
        <path {...refend(2.2)} d="M160 79 V134 M166 73 V134 M160 134 H166" />
        {/* Les pieds arrière reposent 16 plus haut que ceux de devant, comme
            le veut le décalage de la perspective. Celui de gauche s'arrêtait
            à 140 : il s'enfonçait de six unités sous le plan du sol. */}
        <path {...refend(2.5)} d="M54 84 V134 M60 84 V134 M54 134 H60" />
        <path {...trace(3.1)} d="M28 170 H172" />
        <path {...trace(3.1)} d="M28 165 V175" />
        <path {...trace(3.1)} d="M172 165 V175" />
        {/* Le chiffre se place au-dessus de sa ligne, comme sur les trois
            autres meubles — il était le seul à passer dessous. */}
        <text {...cote} x="100" y="164" textAnchor="middle">220 cm</text>
      </g>
    </svg>
  )
}
