# SEO — L'Atelier Bomboi

Date : 2026-11-08

## Le problème

Le site est une page unique ([app/page.tsx](../../../app/page.tsx)) qui navigue par ancres.
Google ne peut indexer qu'une URL, donc le site ne peut viser qu'un seul groupe de
requêtes. L'atelier fait des dressings, des escaliers, des cuisines et du bardage —
quatre intentions de recherche distinctes, une seule adresse pour les accueillir.

S'y ajoutent des manques techniques : ni `robots.txt`, ni `sitemap.xml`, ni
`metadataBase` (donc aucune URL canonique), ni données structurées, ni image
Open Graph.

## Ce qui ne sera pas fait, et pourquoi

**Pas de bourrage de mots-clés.** La balise `keywords` est ignorée par Google
depuis 2009 ; elle est retirée plutôt que rallongée. Répéter « menuisier
Charleroi » dans les textes est un signal de spam.

**Pas de pages par commune.** Des pages quasi identiques pour Gilly, Marcinelle
ou Fleurus sont traitées en *doorway pages* par Google. À reconsidérer seulement
avec du contenu réellement distinct (chantiers locaux, photos du quartier).

## Architecture

### Source unique des faits de l'entreprise

`lib/seo.ts` porte `SITE_URL` et l'objet `BUSINESS` (raison sociale, adresse de
Jumet, téléphone, courriel, horaires, réseaux, zone desservie). Les composants
d'affichage et les données structurées lisent le même objet : le téléphone ne
peut pas diverger entre le pied de page et le JSON-LD, et cette cohérence est
elle-même un signal de confiance pour Google.

`CONTACT_DETAILS` dans `lib/constants.ts` dérive désormais de `BUSINESS` au lieu
de recopier ses valeurs.

### Routes de métadonnées

- `app/robots.ts` — autorise tout, interdit `/api/`, pointe le sitemap.
- `app/sitemap.ts` — la home et les quatre pages services.
- `app/opengraph-image.tsx` — image générée par `next/og`, charbon et orange de
  marque. Pas de police distante : `ImageResponse` échouerait au build hors ligne.

### Données structurées

- `HomeAndConstructionBusiness` (sous-type de `LocalBusiness`) sur la home —
  adresse, horaires, zone desservie, réseaux, catalogue de prestations.
- `WebSite` sur la home.
- `Service` + `BreadcrumbList` + `FAQPage` sur chaque page service. Le `FAQPage`
  vise les blocs de questions dépliables dans les résultats de recherche.

### Pages services

Quatre routes servies par un seul composant, `app/[service]/page.tsx`, avec
`generateStaticParams` et `dynamicParams = false` : tout slug inconnu rend un 404
sans code supplémentaire.

| Route | Requêtes visées | Réalisations | Gamme configurateur |
|---|---|---|---|
| `/dressing-sur-mesure` | dressing, placard sur mesure Charleroi | 13 | `placard`, `souspente`, `coulissante` |
| `/escalier-sur-mesure` | escalier bois, chêne sur mesure Charleroi | 7 | `escalier` |
| `/cuisine-sur-mesure` | cuisine sur mesure, équipée Charleroi | 4 | — |
| `/bardage-bois` | bardage bois façade Charleroi | 6 | `bardage` |

`lib/services.ts` décrit chaque page : slug, titre et description de métadonnées,
`h1`, texte d'introduction, sections, questions fréquentes, et les `galleryIds`
qui la rattachent aux réalisations de `GALLERY_ITEMS`.

Le rattachement vit dans `lib/services.ts` sous forme de listes d'identifiants,
et non dans un champ ajouté aux 49 entrées de la galerie : la correspondance
appartient au service, et la galerie n'a pas à connaître l'existence des pages.

**Aucun prix en dur dans les textes.** Les tarifs vivent dans `lib/furniture/` et
le configurateur les calcule ; une page qui les recopierait finirait par mentir.
Les pages renvoient vers le configurateur pour l'estimation.

### Navigation par ancre — préservée

Les liens passent de `#ancre` à `/#ancre` dans `Nav.tsx` et `Hero.tsx`. Sur la
home, Next.js reconnaît la page courante, ne recharge rien, et le `scroll-smooth`
du layout fait son défilement doux : le comportement actuel est strictement
conservé. Depuis une page service, le même lien revient sur la home à la bonne
section.

La home n'est pas découpée. Les pages services sont des URL supplémentaires.

### Maillage interne

Google ne découvre une page que si quelque chose y mène. Les quatre cartes de
`Expertise.tsx` deviennent des liens vers les services correspondants, et le pied
de page reçoit une colonne de liens vers les quatre pages.

## Hors périmètre, à signaler au client

- **Fiche Google Business Profile** — inexistante. C'est le premier levier pour
  « menuisier Charleroi », il est gratuit, et la vérification par courrier postal
  à l'adresse de Jumet demande environ deux semaines. Création déléguée au
  client, qui s'en charge pour sa société.
- **Polices** — `app/globals.css` importe Playfair Display et DM Sans par
  `@import` depuis Google Fonts, ce qui bloque le rendu. `next/font` supprimerait
  ce blocage (gain Core Web Vitals), mais change le chargement des polices :
  changement séparé, à valider à part.

## Décidé après coup

- **Domaine** : `https://www.atelierbomboi.com`, avec le `www`. Posé en repli
  dans `lib/seo.ts` et dans `NEXT_PUBLIC_SITE_URL`. Changer de forme (www ou
  non) sans redirection diviserait le référencement entre deux adresses.
- **`page.tsx` à la racine du dépôt** — doublon mort de `app/page.tsx`, hérité
  d'avant l'App Router et jamais lu par Next. Supprimé.

## Vérification

- `yarn build` passe sans avertissement `metadataBase`.
- `/robots.txt` et `/sitemap.xml` répondent et listent les cinq URL.
- Les JSON-LD passent le validateur schema.org sans erreur.
- Les liens de nav défilent toujours en douceur depuis la home, et ramènent à la
  bonne section depuis une page service.
- Un slug inconnu rend un 404.
