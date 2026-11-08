import Link from 'next/link'
import { SERVICES, type Service } from '@/lib/services'
import { revealed } from '@/lib/reveal'

/**
 * Les autres prestations, en bas de page.
 *
 * Ce n'est pas un ornement : une page que rien ne lie n'est pas explorée, et
 * ces liens croisés font que les quatre pages se soutiennent au lieu de
 * dépendre chacune du seul lien venu de la page d'accueil.
 */
export default function ServiceCrossLinks({ current }: { current: Service }) {
  const others = SERVICES.filter((service) => service.slug !== current.slug)

  return (
    <section className="bg-cream border-t border-brand/20 px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <p
          {...revealed(0)}
          className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-8"
        >
          Nos autres prestations
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {others.map((service, i) => (
            <Link
              key={service.slug}
              {...revealed(1 + i, 'zoom')}
              href={`/${service.slug}`}
              className="block border-t border-brand/30 pt-5 group"
            >
              <h2 className="font-playfair text-charcoal text-xl font-normal group-hover:text-brand transition-colors">
                {service.label}
              </h2>
              <p className="text-muted text-sm leading-relaxed mt-2">
                {service.name} à Charleroi et en Hainaut.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
