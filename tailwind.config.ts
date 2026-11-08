import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Seuil propre à la barre de navigation : en dessous, les liens et les
        // réseaux laissent la place au burger. Les 768px de `md` ne suffisent
        // plus depuis l'ajout des icônes sociales à côté du bouton devis.
        nav: '1050px',
      },
      colors: {
        cream: '#F5F1EA',
        charcoal: '#262220',
        muted: '#8A8178',
        // Orange de marque du client — couleur d'accent principale
        brand: '#ec5802',
        'brand-dark': '#c74901', // variante pour les états :hover
      },
      // Les familles passent par les variables CSS posées par `next/font` dans
      // app/layout.tsx, au lieu d'être nommées en clair : c'est Next qui décide
      // du nom réel de la police une fois celle-ci servie depuis notre domaine.
      // Les classes `font-sans` et `font-playfair` des composants ne changent
      // pas. Les familles de secours restent, pour le temps du chargement.
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
