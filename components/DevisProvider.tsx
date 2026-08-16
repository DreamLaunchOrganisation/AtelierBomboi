'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Le passe-plat entre le configurateur et le formulaire de contact.
 *
 * Les deux sections sont voisines dans la page, sans lien de parenté : ce
 * contexte leur donne le seul état qu'elles partagent, le brouillon de message
 * déposé au moment où le client demande son devis.
 */

type Brouillon = {
  texte: string
  /** Incrémenté à chaque dépôt : redéposer un texte identique doit tout de
   *  même réarmer le formulaire, sinon un second clic resterait sans effet. */
  tour: number
}

type DevisContexte = {
  brouillon: Brouillon | null
  deposerBrouillon: (texte: string) => void
}

const Contexte = createContext<DevisContexte | null>(null)

export function DevisProvider({ children }: { children: ReactNode }) {
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null)

  const deposerBrouillon = useCallback((texte: string) => {
    setBrouillon((precedent) => ({ texte, tour: (precedent?.tour ?? 0) + 1 }))
  }, [])

  const valeur = useMemo(
    () => ({ brouillon, deposerBrouillon }),
    [brouillon, deposerBrouillon],
  )

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
}

export function useDevis(): DevisContexte {
  const contexte = useContext(Contexte)
  if (!contexte) {
    throw new Error('useDevis doit être appelé à l’intérieur d’un DevisProvider.')
  }
  return contexte
}
