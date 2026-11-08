'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/#savoir-faire', label: 'Savoir-faire' },
  { href: '/#realisations', label: 'Réalisations' },
  { href: '/#configurateur', label: 'Configurateur' },
  { href: '/#contact', label: 'Contact' },
]

// Glyphes officiels des marques : gris au repos, couleur de la marque au
// survol. Le bleu Facebook est une couleur simple ; l'identité Instagram est un
// dégradé, qui ne peut donc pas passer par `color` — le tracé bascule sur le
// dégradé SVG déclaré une fois pour toutes par <SocialGradients />.
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/atelierbomboi?igsh=MWV6bnpmOXdjdWlyYw==',
    hover: 'group-hover:fill-[url(#instagram-gradient)]',
    path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18x861waoN/?mibextid=wwXIfr',
    hover: 'group-hover:fill-[#1877F2]',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
]

/**
 * Le dégradé Instagram, déclaré une seule fois dans le document : les deux
 * exemplaires de la barre (bureau et menu mobile) le référencent par son id.
 * Le porteur reste dans le flux avec une taille nulle — un `display: none`
 * casserait la référence `url(#…)` sur certains navigateurs.
 */
function SocialGradients() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="25%" stopColor="#FA7E1E" />
          <stop offset="50%" stopColor="#D62976" />
          <stop offset="75%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SocialLinks({
  gap = 'gap-4',
  size = 'w-5 h-5',
  onClick,
}: {
  gap?: string
  size?: string
  onClick?: () => void
}) {
  return (
    <div className={`flex items-center ${gap}`}>
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          aria-label={social.label}
          className="group text-muted"
        >
          <svg viewBox="0 0 24 24" className={size} aria-hidden="true">
            <path d={social.path} className={`fill-current transition-colors ${social.hover}`} />
          </svg>
        </a>
      ))}
    </div>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Bloquer le scroll body quand menu ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <SocialGradients />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-cream/90 backdrop-blur-md border-b border-brand/20 transition-all">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-bomboi.png"
            alt="L'atelier Bomboi — Menuiserie"
            width={648}
            height={182}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Liens desktop */}
        <ul className="hidden nav:flex gap-10 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-sm font-normal uppercase tracking-widest hover:text-brand transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Réseaux + CTA desktop */}
        <div className="hidden nav:flex items-center gap-5">
          <SocialLinks />
          <a
            href="/#configurateur"
            className="bg-charcoal text-white text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-brand transition-colors"
          >
            Obtenir un devis
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav:hidden flex flex-col mr-1 justify-center gap-[5px] p-1 z-[110] bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-charcoal rounded transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-charcoal rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-charcoal rounded transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Menu mobile plein écran */}
      <div
        className={`fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center gap-10 transition-all duration-300 nav:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="font-playfair text-4xl text-charcoal hover:text-brand transition-colors"
          >
            {link.label}
          </a>
        ))}
        <a
          href="/#configurateur"
          onClick={closeMenu}
          className="mt-4 bg-charcoal text-white text-base font-medium px-10 py-3.5 rounded-sm hover:bg-brand transition-colors"
        >
          Obtenir un devis
        </a>
        <SocialLinks gap="gap-8" size="w-7 h-7" onClick={closeMenu} />
      </div>
    </>
  )
}
