import Link from 'next/link'
import type { Service } from '@/lib/services'
import { BUSINESS } from '@/lib/seo'
import { revealed } from '@/lib/reveal'

/**
 * L'en-tête d'une page service.
 *
 * Le visiteur arrive d'une recherche précise : il doit lire le nom de la
 * prestation dans le premier écran, pas le découvrir après avoir défilé. D'où
 * un `h1` qui porte la requête visée au lieu d'une formule d'accroche.
 *
 * Le `pt-32` dégage la barre de navigation, qui est en position fixe.
 */
export default function ServiceHero({ service }: { service: Service }) {
  return (
    <section className="relative bg-charcoal overflow-hidden px-6 md:px-12 pt-32 pb-16 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#2E2A24] to-charcoal" />
      <div className="absolute inset-0 hero-pattern opacity-100" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Le fil d'Ariane visible double le BreadcrumbList des données
            structurées : Google préfère voir à l'écran ce qu'on lui déclare. */}
        <nav
          {...revealed(0, 'left')}
          aria-label="Fil d'Ariane"
          className="text-xs text-white/40 mb-8"
        >
          <Link href="/" className="hover:text-brand transition-colors">
            Accueil
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/70">{service.label}</span>
        </nav>

        <p
          {...revealed(1, 'left')}
          className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4"
        >
          {service.eyebrow}
        </p>

        <h1
          {...revealed(2, 'left', { fontSize: 'clamp(2rem, 5vw, 3.75rem)' })}
          className="font-playfair text-white font-normal leading-[1.08] mb-6 max-w-3xl"
        >
          {service.h1}
        </h1>

        <p
          {...revealed(3, 'left')}
          className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-2xl mb-10"
        >
          {service.intro}
        </p>

        <div {...revealed(4, 'left')} className="flex flex-col sm:flex-row gap-3">
          {/* Racine-relatif : depuis une page service, le lien revient sur la
              home et descend au configurateur. */}
          <Link
            href="/#configurateur"
            className="bg-brand text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-brand-dark transition-colors text-center"
          >
            Estimer mon projet
          </Link>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="border border-white/25 text-white/70 text-sm px-8 py-3.5 rounded-sm hover:border-brand hover:text-brand transition-colors text-center"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
