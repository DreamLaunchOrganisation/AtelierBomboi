/**
 * Dépose un bloc de données structurées dans la page.
 *
 * Le JSON est injecté par `dangerouslySetInnerHTML` parce que c'est la seule
 * façon d'écrire un `<script type="application/ld+json">` : React échapperait
 * les guillemets d'un enfant textuel et produirait un JSON illisible pour les
 * robots. Le contenu vient de nos propres modules, jamais d'une saisie
 * utilisateur, et les `<` sont malgré tout neutralisés pour qu'aucune chaîne ne
 * puisse refermer la balise.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
