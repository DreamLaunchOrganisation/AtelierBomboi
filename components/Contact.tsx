'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT_DETAILS } from '@/lib/constants'
import { revealed } from '@/lib/reveal'
import { useDevis } from './DevisProvider'

/** Au-delà, le champ défile plutôt que de repousser le bouton d'envoi. */
const HAUTEUR_MAX = 460

/** Habillage commun aux champs de saisie. */
const champ =
  'bg-transparent border-b border-white/20 py-2 text-white text-sm font-sans focus:border-brand outline-none transition-colors disabled:opacity-50'

type Etat = 'saisie' | 'envoi' | 'envoye'

export default function Contact() {
  const { brouillon } = useDevis()
  const [projet, setProjet] = useState('')
  const champProjet = useRef<HTMLTextAreaElement>(null)
  const brouillonFrais = useRef(false)

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [societe, setSociete] = useState('')
  const [etat, setEtat] = useState<Etat>('saisie')
  const [erreur, setErreur] = useState<string | null>(null)

  async function envoyer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (etat === 'envoi') return

    setEtat('envoi')
    setErreur(null)

    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, telephone, email, projet, societe }),
      })
      const corps = await reponse.json().catch(() => ({}))

      if (!reponse.ok) {
        setErreur(corps.erreur ?? "Le message n'est pas parti. Réessayez dans un instant.")
        setEtat('saisie')
        return
      }

      setEtat('envoye')
      setNom('')
      setTelephone('')
      setEmail('')
      setProjet('')
    } catch {
      // Coupure réseau : on nomme la cause probable plutôt qu'un échec vague.
      setErreur('Connexion interrompue. Vérifiez votre réseau et réessayez.')
      setEtat('saisie')
    }
  }

  // Le configurateur vient de déposer un brouillon : on remplit le champ, et on
  // le laisse entièrement modifiable — c'est un point de départ, pas un verrou.
  useEffect(() => {
    if (!brouillon) return
    setProjet(brouillon.texte)
    brouillonFrais.current = true
  }, [brouillon])

  // Le champ épouse la hauteur de son contenu : le client relit son récapitulatif
  // d'un seul coup d'œil, au lieu de faire défiler un cadre de quatre lignes.
  //
  // Cet effet dépend de `projet`, pas de `brouillon` : il ne s'exécute donc
  // qu'une fois la nouvelle valeur réellement posée dans le DOM. C'est ce
  // décalage d'un rendu qui manquait — le champ restait déroulé sur sa
  // dernière ligne, montrant la fin du message au lieu du début.
  useEffect(() => {
    const champ = champProjet.current
    if (!champ) return

    champ.style.height = 'auto'
    champ.style.height = `${Math.min(champ.scrollHeight, HAUTEUR_MAX)}px`

    if (brouillonFrais.current) {
      brouillonFrais.current = false
      champ.scrollTop = 0
    }
  }, [projet])

  return (
    <section id="contact" className="bg-charcoal px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Texte */}
        <div>
          <p
            {...revealed(0, 'left')}
            className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4"
          >
            Contact
          </p>
          <h2
            {...revealed(1, 'left', { fontSize: 'clamp(2rem, 4vw, 3rem)' })}
            className="font-playfair text-white font-normal leading-tight mb-6"
          >
            Parlons de<br />votre projet
          </h2>
          <p
            {...revealed(2, 'left')}
            className="text-white/55 text-base font-light leading-relaxed max-w-md"
          >
            Une idée, un espace à aménager&nbsp;? Contactez-nous pour une visite technique
            gratuite et un devis personnalisé sans engagement.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {CONTACT_DETAILS.map((detail, i) => (
              <div key={detail.label} {...revealed(3 + i, 'left')} className="flex items-start gap-4">
                <span className="text-2xl leading-none">{detail.icon}</span>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-widest">
                    {detail.label}
                  </div>
                  <div className="text-white/85 text-sm mt-0.5">{detail.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form
          {...revealed(2, 'right')}
          className="bg-white/5 border border-white/10 rounded-sm p-8 flex flex-col gap-5"
          onSubmit={envoyer}
        >
          {/* Piège à robots : hors écran et invisible aux lecteurs d'écran, un
              visiteur ne peut pas le remplir. S'il l'est, le serveur ignore. */}
          <input
            type="text"
            name="societe"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={societe}
            onChange={(e) => setSociete(e.target.value)}
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2 text-white/60 text-xs uppercase tracking-widest">
              Nom
              <input
                type="text"
                required
                autoComplete="name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={champ}
              />
            </label>
            <label className="flex flex-col gap-2 text-white/60 text-xs uppercase tracking-widest">
              Téléphone
              <input
                type="tel"
                autoComplete="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className={champ}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-white/60 text-xs uppercase tracking-widest">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={champ}
            />
          </label>
          <label className="flex flex-col gap-2 text-white/60 text-xs uppercase tracking-widest">
            Votre projet
            <textarea
              ref={champProjet}
              rows={4}
              required
              value={projet}
              onChange={(e) => setProjet(e.target.value)}
              placeholder="Décrivez votre projet, ou configurez un meuble ci-dessus pour remplir ce champ automatiquement."
              className="bg-transparent border-b border-white/20 py-2 text-white text-sm font-sans leading-relaxed focus:border-brand outline-none transition-colors resize-none overflow-y-auto placeholder:text-white/25"
            />
          </label>

          <button
            type="submit"
            disabled={etat === 'envoi'}
            className="mt-2 bg-brand text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:pointer-events-none"
          >
            {etat === 'envoi' ? 'Envoi en cours…' : 'Envoyer ma demande'}
          </button>

          {/* `aria-live` fait annoncer le retour par les lecteurs d'écran : sans
              lui, un utilisateur non voyant ne saurait pas que son message est
              parti. */}
          <div aria-live="polite" className="min-h-[1.25rem]">
            {etat === 'envoye' && (
              <p className="text-brand text-sm">
                Message envoyé. Nous vous répondons sous 48&nbsp;heures ouvrables.
              </p>
            )}
            {erreur && <p className="text-red-300 text-sm">{erreur}</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
