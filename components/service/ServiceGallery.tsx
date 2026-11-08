import Image from 'next/image'
import Link from 'next/link'
import { GALLERY_ITEMS } from '@/lib/constants'
import type { Service } from '@/lib/services'
import { revealed } from '@/lib/reveal'

/**
 * Les réalisations qui illustrent cette prestation.
 *
 * Une grille statique, et non le carrousel de la page d'accueil : toutes les
 * photos sont alors présentes dans le HTML servi, avec leur `alt`, donc toutes
 * indexables dans Google Images. Un carrousel n'expose que la page courante.
 *
 * L'ordre est celui de `service.galleryIds` — c'est celui qu'a choisi la page,
 * pas celui de la galerie générale.
 */
export default function ServiceGallery({ service }: { service: Service }) {
  const items = service.galleryIds
    .map((id) => GALLERY_ITEMS.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  if (items.length === 0) return null

  return (
    <section className="bg-cream px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <p
          {...revealed(0)}
          className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4"
        >
          Nos réalisations
        </p>
        <h2
          {...revealed(1, 'up', { fontSize: 'clamp(2rem, 4vw, 3rem)' })}
          className="font-playfair text-charcoal font-normal leading-tight mb-12"
        >
          {items.length} projets déjà posés
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <figure key={item.id} {...revealed(2 + (i % 3), 'zoom')} className="m-0 group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-charcoal/5">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute top-4 left-4 bg-cream/90 text-charcoal text-[0.65rem] font-medium tracking-widest uppercase px-3 py-1 rounded-sm">
                  {item.subtitle}
                </span>
              </div>
              <figcaption>
                <h3 className="font-playfair text-lg font-normal mt-4 text-charcoal">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mt-1">{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <Link
          {...revealed(5)}
          href="/#realisations"
          className="inline-block mt-12 text-brand text-sm tracking-widest uppercase border-b border-brand/40 pb-1 hover:border-brand transition-colors"
        >
          Voir toutes les réalisations
        </Link>
      </div>
    </section>
  )
}
