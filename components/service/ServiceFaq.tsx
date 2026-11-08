import type { Service } from '@/lib/services'
import { revealed } from '@/lib/reveal'

/**
 * Les questions fréquentes de la prestation.
 *
 * Rendu avec `<details>` / `<summary>` natifs : les réponses se déplient sans
 * une ligne de JavaScript, et surtout leur texte est présent dans le HTML servi
 * même replié — ce qui est la condition pour que le schéma FAQPage soit
 * reconnu. Un accordéon qui monterait son contenu au clic ne le serait pas.
 */
export default function ServiceFaq({ service }: { service: Service }) {
  return (
    <section className="bg-white px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <p
          {...revealed(0)}
          className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4"
        >
          Questions fréquentes
        </p>
        <h2
          {...revealed(1, 'up', { fontSize: 'clamp(2rem, 4vw, 3rem)' })}
          className="font-playfair text-charcoal font-normal leading-tight mb-10"
        >
          Ce qu&apos;on nous demande
        </h2>

        <div {...revealed(2)} className="flex flex-col">
          {service.faq.map((entry) => (
            <details
              key={entry.q}
              className="group border-b border-brand/20 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none text-charcoal font-playfair text-lg font-normal leading-snug hover:text-brand transition-colors">
                {entry.q}
                <span
                  aria-hidden="true"
                  className="text-brand text-xl leading-none shrink-0 mt-1 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted text-sm font-light leading-relaxed mt-4 pr-10">
                {entry.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
