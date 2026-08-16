import { NextResponse } from 'next/server'
import { Resend } from 'resend'

/**
 * Réception du formulaire de contact et envoi du mail à l'atelier.
 *
 * Le navigateur ne peut pas envoyer un mail lui-même : il poste ici, et c'est
 * ce code serveur qui appelle Resend. La clé d'API reste donc côté serveur et
 * n'apparaît jamais dans le code livré au visiteur.
 *
 * L'expéditeur est une variable d'environnement, et non l'adresse du visiteur :
 * envoyer « de la part de » quelqu'un d'autre est une usurpation que les
 * messageries rejettent ou classent en indésirable. L'adresse du client part
 * donc en Reply-To — répondre au message lui écrit directement.
 */

/** Bornes de saisie : au-delà, c'est un robot ou une erreur, pas un client. */
const LIMITES = { nom: 120, telephone: 40, email: 200, projet: 8000 }

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Charge = {
  nom?: unknown
  telephone?: unknown
  email?: unknown
  projet?: unknown
  /** Piège à robots : un humain ne le voit pas, donc ne le remplit jamais. */
  societe?: unknown
}

function texteValide(valeur: unknown, limite: number): string | null {
  if (typeof valeur !== 'string') return null
  const propre = valeur.trim()
  if (propre.length === 0 || propre.length > limite) return null
  return propre
}

export async function POST(request: Request) {
  let charge: Charge
  try {
    charge = await request.json()
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 })
  }

  // Champ piège rempli : on répond comme si tout allait bien, sans rien envoyer.
  // Signaler l'échec apprendrait au robot à contourner le piège.
  if (typeof charge.societe === 'string' && charge.societe.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const nom = texteValide(charge.nom, LIMITES.nom)
  const email = texteValide(charge.email, LIMITES.email)
  const projet = texteValide(charge.projet, LIMITES.projet)
  const telephone =
    typeof charge.telephone === 'string' && charge.telephone.trim().length <= LIMITES.telephone
      ? charge.telephone.trim()
      : ''

  if (!nom) return NextResponse.json({ erreur: 'Indiquez votre nom.' }, { status: 400 })
  if (!email || !EMAIL_VALIDE.test(email)) {
    return NextResponse.json({ erreur: 'Indiquez une adresse email valide.' }, { status: 400 })
  }
  if (!projet) {
    return NextResponse.json({ erreur: 'Décrivez votre projet.' }, { status: 400 })
  }

  const cle = process.env.RESEND_API_KEY
  const expediteur = process.env.CONTACT_FROM
  const destinataire = process.env.CONTACT_TO

  if (!cle || !expediteur || !destinataire) {
    // Message volontairement distinct : c'est une erreur de configuration du
    // site, pas une faute du visiteur.
    console.error(
      'Envoi impossible : RESEND_API_KEY, CONTACT_FROM ou CONTACT_TO est absent.',
    )
    return NextResponse.json(
      { erreur: "L'envoi est momentanément indisponible. Écrivez-nous directement." },
      { status: 503 },
    )
  }

  // Le début du projet en objet : l'atelier voit de quoi il s'agit sans ouvrir.
  const premiereLigne = projet.split('\n')[0].slice(0, 70)

  try {
    const resend = new Resend(cle)
    const { error } = await resend.emails.send({
      from: expediteur,
      to: [destinataire],
      replyTo: email,
      subject: `Site — ${premiereLigne} — ${nom}`,
      text: [
        `Nom : ${nom}`,
        `Email : ${email}`,
        `Téléphone : ${telephone || 'non communiqué'}`,
        '',
        '--- Projet ---',
        projet,
      ].join('\n'),
    })

    if (error) {
      console.error('Resend a refusé l’envoi :', error)
      if (expediteur.endsWith('@resend.dev')) {
        console.error(
          `Rappel : l'expéditeur de test n'écrit qu'au titulaire du compte Resend. ` +
            `CONTACT_TO vaut « ${destinataire} » — est-ce bien l'adresse du compte ? ` +
            `Pour écrire ailleurs, il faut un domaine vérifié.`,
        )
      }
      return NextResponse.json(
        { erreur: "Le message n'est pas parti. Réessayez dans un instant." },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (cause) {
    console.error('Envoi du formulaire de contact impossible :', cause)
    return NextResponse.json(
      { erreur: "Le message n'est pas parti. Réessayez dans un instant." },
      { status: 502 },
    )
  }
}
