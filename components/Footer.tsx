import Link from 'next/link'
import { revealed } from '@/lib/reveal'
import { BUSINESS } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

/**
 * Le pied de page.
 *
 * Il porte les liens vers les quatre pages services, et c'est sa fonction la
 * plus utile au référencement : présent sur toutes les pages, il garantit
 * qu'aucune n'est orpheline, quel que soit le chemin par lequel un robot entre
 * sur le site.
 *
 * Les coordonnées viennent de `BUSINESS`, la même source que les données
 * structurées — le numéro affiché et le numéro déclaré à Google ne peuvent donc
 * pas diverger.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal border-t border-white/10 px-6 md:px-12 pt-14 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Identité */}
          <div {...revealed(0, 'left')}>
            <Link href="/" className="font-playfair text-xl text-white tracking-tight">
              L&apos;atelier <span className="text-brand italic">Bomboi</span>
            </Link>
            <p className="text-white/45 text-sm font-light leading-relaxed mt-4 max-w-xs">
              Artisan menuisier depuis {BUSINESS.founded}. Dressings, cuisines,
              escaliers et bardages sur mesure, fabriqués et posés par l&apos;atelier.
            </p>
          </div>

          {/* Prestations */}
          <nav {...revealed(1)} aria-label="Nos prestations">
            <h2 className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-5">
              Prestations
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/${service.slug}`}
                    className="text-white/60 text-sm hover:text-brand transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coordonnées */}
          <div {...revealed(2, 'right')}>
            <h2 className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-5">
              L&apos;atelier
            </h2>
            {/* `address` est l'élément prévu pour des coordonnées de contact,
                et le style par défaut en italique est neutralisé. */}
            <address className="not-italic flex flex-col gap-2 text-white/60 text-sm">
              <span>
                {BUSINESS.street}, {BUSINESS.locality} {BUSINESS.postalCode}
              </span>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="hover:text-brand transition-colors"
              >
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="hover:text-brand transition-colors"
              >
                {BUSINESS.email}
              </a>
              <span className="text-white/40">{BUSINESS.hoursDisplay}</span>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {year} {BUSINESS.name} — {BUSINESS.tagline}. Tous droits réservés.
          </p>
          <div className="flex gap-5 text-white/40 text-xs">
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              Instagram
            </a>
            <a
              href={BUSINESS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
