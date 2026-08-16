'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { GALLERY_ITEMS } from '@/lib/constants'
import { revealed } from '@/lib/reveal'

/** Écart entre deux cartes, en pixels — doit suivre la classe `gap-6` du rail. */
const GAP = 24

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  // Cartes par page : 1 sur mobile, 3 sur grand écran. La valeur n'est pas
  // codée en dur mais mesurée sur le rail, pour qu'elle suive toujours le CSS.
  const [perPage, setPerPage] = useState(3)
  const [page, setPage] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const pageCount = Math.ceil(GALLERY_ITEMS.length / perPage)

  /** Relit la position réelle du rail : c'est lui qui fait foi, pas un compteur. */
  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const slides = Array.from(track.children) as HTMLElement[]
    if (slides.length === 0) return

    const slideWidth = slides[0].getBoundingClientRect().width
    const perView = Math.max(1, Math.round((track.clientWidth + GAP) / (slideWidth + GAP)))
    setPerPage(perView)

    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 2)
    setAtEnd(track.scrollLeft >= max - 2)

    // Carte la plus proche du bord gauche, ramenée à sa page.
    const left = track.getBoundingClientRect().left
    let nearest = 0
    let best = Infinity
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - left)
      if (distance < best) {
        best = distance
        nearest = i
      }
    })
    setPage(Math.round(nearest / perView))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }

    sync()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sync])

  /** Amène la première carte de la page demandée contre le bord gauche. */
  const goToPage = (target: number) => {
    const track = trackRef.current
    if (!track) return

    const clamped = Math.max(0, Math.min(target, pageCount - 1))
    const slide = track.children[clamped * perPage]
    if (!slide) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // On mesure l'écart plutôt qu'une position absolue : juste quel que soit
    // le nombre de cartes visibles à cette largeur d'écran.
    const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left
    track.scrollBy({ left: delta, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section id="realisations" className="bg-cream px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p
              {...revealed(0)}
              className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4"
            >
              Réalisations
            </p>
            <h2
              {...revealed(1, 'up', { fontSize: 'clamp(2rem, 4vw, 3rem)' })}
              className="font-playfair text-charcoal font-normal leading-tight"
            >
              Quelques projets<br />signés de notre atelier
            </h2>
          </div>

          {/* Tant que les réalisations tiennent sur une seule page, les
              commandes n'auraient rien à faire défiler : on les retire plutôt
              que de les afficher grisées. Elles reviennent d'elles-mêmes à la
              quatrième photo. */}
          {pageCount > 1 && (
            <div {...revealed(2, 'right')} className="hidden md:flex gap-3 shrink-0">
              <Arrow direction="prev" disabled={atStart} onClick={() => goToPage(page - 1)} />
              <Arrow direction="next" disabled={atEnd} onClick={() => goToPage(page + 1)} />
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-label="Carrousel des réalisations"
          tabIndex={0}
          className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {GALLERY_ITEMS.map((item, i) => (
            <article
              key={item.id}
              {...revealed(2 + (i % 3), 'zoom')}
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${GALLERY_ITEMS.length} — ${item.title}`}
              // Mobile : une image par écran. Grand écran : trois de front.
              // Les `_` deviennent des espaces : `calc()` refuse un `-` collé.
              className="group cursor-pointer snap-start shrink-0 w-full md:w-[calc((100%_-_3rem)/3)]"
            >
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-charcoal/5">
                {/* Le visuel grossit au survol ; le cartouche reste immobile. */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  // Une carte occupe toute la largeur sur mobile, un tiers au-delà :
                  // le navigateur choisit ainsi la bonne taille de fichier.
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
                <span className="absolute top-4 left-4 bg-cream/90 text-charcoal text-[0.65rem] font-medium tracking-widest uppercase px-3 py-1 rounded-sm">
                  {item.subtitle}
                </span>
              </div>
              <h3 className="font-playfair text-lg font-normal mt-4 group-hover:text-brand transition-colors">
                {item.title}
              </h3>
              <p className="text-muted text-sm mt-1">{item.desc}</p>
            </article>
          ))}
        </div>

        {/* Une puce par page. Aucune quand tout tient sur un écran : une puce
            solitaire n'indique rien et ne mène nulle part. Sur mobile, où les
            photos défilent une à une, elles réapparaissent d'elles-mêmes. */}
        {pageCount > 1 && (
          <>
            <div className="flex items-center justify-center gap-1 mt-6">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Aller à la page ${i + 1} sur ${pageCount}`}
                  aria-current={i === page}
                  // La zone cliquable fait 44 px de haut ; seule la barre se voit.
                  className="group px-1 py-4"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === page
                        ? 'w-7 bg-brand'
                        : 'w-1.5 bg-charcoal/20 group-hover:bg-charcoal/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="md:hidden text-muted text-xs text-center">
              Faites glisser pour parcourir les projets
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Projets précédents' : 'Projets suivants'}
      className="w-11 h-11 flex items-center justify-center rounded-sm border border-brand/30 text-charcoal transition-colors hover:border-brand hover:text-brand disabled:opacity-30 disabled:pointer-events-none"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 ${direction === 'prev' ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}
