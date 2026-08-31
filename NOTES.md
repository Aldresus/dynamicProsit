# Notes de réécriture

Décisions prises pendant la réécriture qui méritent une relecture, et limites
connues. Rien ici n'est un bug bloquant — ce sont des choix à confirmer.

## Validation du formulaire — décoratif pour l'instant

`Field required` affiche l'astérisque rouge sur **Titre**, **Généralisation** et
**Contexte**, et pose `aria-required` sur le champ. Mais rien ne bloque :

- chaque frappe écrit directement dans le store, il n'y a pas d'étape de
  soumission qui valide ;
- le seul `submit` du formulaire Informations navigue vers Mots clefs, il ne
  valide pas ;
- l'export `.docx` marche sur un prosit vide et produit un document avec des
  trous.

**L'ancienne version se comportait exactement pareil** (`required` sur les mêmes
trois champs Mantine, aucune validation réelle). Le comportement a donc été
conservé tel quel plutôt que d'inventer une règle qui n'a jamais été demandée.

Trois issues possibles, par ordre de coût :

1. **Ne rien faire.** Assumer que l'astérisque est une indication, pas une
   contrainte. C'est l'état actuel.
2. **Retirer `required`.** Si rien ne valide, l'astérisque ment. Une ligne.
3. **Valider à l'export.** Refuser l'export (ou avertir dans le toast) quand
   Titre, Généralisation ou Contexte est vide, et pointer le champ fautif via
   `Field error`. C'est le seul moment où l'absence de données a une
   conséquence réelle — un `.docx` incomplet part chez le client.

L'option 3 est celle qui a du sens si on veut vraiment valider : elle place le
contrôle à la frontière qui compte au lieu de gêner la saisie.

## Pont de tokens Tailwind

`src/styles.css` recopie à la main le vocabulaire sémantique du design system
(`--color-surface` → `var(--hcds-surface)`, etc.). Le paquet compile avec
`@theme inline`, donc sa feuille livre les utilitaires déjà résolus et les
entrées `--color-*` ne survivent pas à son build : le Tailwind de l'app ne
connaît pas le vocabulaire sans ce bloc.

À supprimer le jour où `@aldresus/design-system` expose un `theme.css` pour ses
consommateurs. C'est le seul endroit du dépôt qui peut dériver silencieusement
du design system.

## Raccourcis liés deux fois

`useShortcut` ignore une combinaison déclenchée depuis un champ de saisie sauf
si elle porte Meta ou Ctrl. Ici chaque page autofocus un champ et les sauts
d'étape sont en `Alt+Shift`, donc ils sont liés deux fois : globalement via
`useShortcut`, et sur les champs via `matchesShortcut` (`src/shortcuts.ts`).

Si le design system laissait passer Alt, la seconde liaison disparaîtrait.

## Déploiement Vercel

`vercel.json` porte la configuration : pas de framework (le projet était réglé
sur Next.js), sortie dans `dist`, install et build par bun.

La règle de réécriture renvoie tout vers `/index.html`. Elle ne casse pas les
huit pages prérendues : Vercel sert d'abord les fichiers réels et n'applique les
`rewrites` qu'ensuite, donc `/livrables` sert bien `dist/livrables/index.html`
et seules les URL inconnues retombent sur le 404 de l'application.

### Le jeton GitHub Packages

`@aldresus/design-system` vit sur GitHub Packages, donc `bun install` a besoin
de `GITHUB_TOKEN` **à l'installation**, pas seulement au build. Sans lui, le
déploiement échoue sur l'install avec un 401.

À poser une fois, dans les trois environnements :

```bash
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_TOKEN preview
vercel env add GITHUB_TOKEN development
```

Un token classique avec le seul scope `read:packages` suffit. Préférer un token
dédié au déploiement plutôt qu'un token personnel : il expire sans prévenir et
son périmètre est bien plus large que nécessaire.

## Carte sociale

`public/og.png` est générée par `bun run og` et **commitée**. Le design system
ne livre que du woff2, que resvg ne sait pas lire, donc le nom est composé en
Georgia — la police que le paquet désigne lui-même comme substitut de Bitter.
La carte n'est donc pas au pixel près ce que serait la même chose rendue par le
navigateur, mais elle reste dans la famille.

L'ancienne version générait deux images distinctes (`opengraph-image` et
`twitter-image`) par `next/og`, au contenu quasi identique. Il n'y en a plus
qu'une, référencée par les deux jeux de balises.

## Taille du bundle

`docxtemplater` et `pizzip` pèsent ~490 kB et ne servent qu'au clic sur
« Exporter ». Ils sont chargés à ce moment-là (`import()` dans
`src/domain/docx.ts`), ce qui ramène le premier chargement à ~27 kB gzip.
À surveiller si l'export devient utilisé au démarrage.

## Fenêtre de présentation : non vérifiable dans l'aperçu

Le bouton « Présentation » appelle `window.open(url, "prosit-presentation",
"popup=yes,width=1280,height=800")` — une vraie seconde fenêtre, à poser sur le
projecteur, pas un onglet.

**Ce comportement n'a pas pu être vérifié ici.** Le panneau d'aperçu utilisé
pendant la réécriture n'implémente pas les fenêtres multiples : il a navigué
dans l'onglet courant au lieu d'en ouvrir une seconde. Dans un vrai navigateur,
des `features` non vides forcent une fenêtre popup. La logique autour a été
vérifiée avec deux onglets réels (synchronisation, surlignage, demande d'état).

À confirmer d'un clic dans Chrome/Firefox. Si un navigateur ouvre malgré tout un
onglet, tout continue de fonctionner — c'est juste moins pratique à projeter.

## Annuler : un bouton, pas un toast ni Ctrl+Z

Deux impasses ont conduit au bouton dans la barre latérale.

**Le toast ne peut pas porter d'action.** Base UI accepte `actionProps` et
exporte `Toast.Action`, mais le `ToastList` du design system ne rend que le
titre, la description et la fermeture. Un `actionProps` passé à `toast.add()`
n'aboutit nulle part. C'est pourtant là que « Annuler » devrait vivre, juste
après la suppression qu'il annule.

**`Mod+Z` casserait l'annulation native.** `useShortcut` appelle
`preventDefault()` dès que la combinaison correspond, y compris dans un champ de
saisie. Le lier reviendrait à supprimer le Ctrl+Z du navigateur dans tous les
champs du formulaire — un échange perdant.

L'historique ne retient que les changements structurels (ajout, édition,
suppression, réordonnancement, réinitialisation), pas la frappe : vingt entrées
consommées par vingt caractères n'auraient rien annulé d'utile.

## Plusieurs prosits : la version 4

L'ancienne application n'en connaissait qu'un — la clé de stockage était la
chaîne littérale `"prosit"`, donc en commencer un nouveau détruisait le
précédent. Le stockage porte maintenant `{ version, current, prosits }`.

**La migration depuis la v3 est faite, pas sautée.** La forme a changé, le
contenu était bon : un document v3 devient une bibliothèque d'un élément. Les
v1 et v2 restent écartées silencieusement, comme convenu.

**Supprimer et réinitialiser ne cohabitent pas.** Tant qu'il n'y a qu'un
prosit, supprimer serait une réinitialisation avec une étape de plus — le
bouton n'apparaît qu'à partir du deuxième. Les deux passent par l'historique
d'annulation.

**`items` sur le `Select` n'est pas décoratif.** Sans la table
valeur → libellé, Base UI affiche l'identifiant brut dans le déclencheur. Cela
mériterait peut-être d'être documenté côté design system : la prop se lit
comme une optimisation alors qu'elle conditionne l'affichage.

## L'aller-retour passe par le .docx, pas par du JSON

Le prosit exporté voyage dans `customXml/item1.xml`, la partie qu'OOXML
réserve aux données applicatives. Trois parties de plus sont nécessaires et
aucune n'est facultative : `itemProps1.xml` (déclarée dans
`[Content_Types].xml`, sinon Word refuse le fichier entier), les relations de
l'élément, et une relation depuis `document.xml` — une partie que rien ne
référence est une partie que Word peut supprimer.

**Ce qui n'a pas pu être vérifié ici : la survie à un enregistrement Word.**
La spécification garantit la conservation des parties `customXml`, et
l'aller-retour est testé de bout en bout (export réel, réimport réel, y compris
avec des caractères que XML refuserait tels quels). Mais aucune installation de
Word n'était disponible pour confirmer qu'un fichier ouvert puis réenregistré
garde encore ses données. À tester une fois.

**L'identifiant est régénéré à l'import.** Importer deux fois le même fichier
donne deux prosits, pas un document occupant deux emplacements.
