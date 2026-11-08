import type { Service } from '@/lib/services'
import { revealed } from '@/lib/reveal'

/**
 * Le corps rédigé d'une page service : trois sections, puis les finitions.
 *
 * C'est ce texte qui fait le référencement de la page. Les intertitres sont en
 * `h2` et portent le vocabulaire du métier — « quart tournant », « lame d'air
 * ventilée » — parce que c'est ce que les clients tapent quand ils savent déjà
 * ce qu'ils cherchent, et que ce sont les requêtes les mieux converties.
 */
export default function ServiceDetails({ service }: { service: Service }) {
  return (
    <section className="bg-white px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2 flex flex-col gap-12">
          {service.sections.map((section, i) => (
            <article key={section.title} {...revealed(i, 'left')}>
              <h2 className="font-playfair text-charcoal text-2xl md:text-3xl font-normal leading-tight mb-4">
                {section.title}
              </h2>
              <p className="text-muted text-base font-light leading-relaxed">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        {/* Les finitions, en colonne : une liste courte se lit mieux à côté du
            texte qu'intercalée dedans. */}
        <aside {...revealed(1, 'right')} className="lg:pt-2">
          <div className="border-t border-brand/30 pt-6">
            <h2 className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-5">
              Finitions proposées
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {service.materials.map((material) => (
                <li
                  key={material}
                  className="text-charcoal text-sm font-light leading-snug flex gap-3"
                >
                  <span aria-hidden="true" className="text-brand">
                    ✦
                  </span>
                  {material}
                </li>
              ))}
            </ul>
            <p className="text-muted text-xs leading-relaxed mt-6">
              Les échantillons sont présentés à la visite technique, qui est
              gratuite et sans engagement.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
