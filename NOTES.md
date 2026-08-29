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

## Repli des URL inconnues (dépend de l'hébergeur)

Le build écrit un `index.html` par route, donc les huit URL réelles marchent en
rafraîchissement direct sur n'importe quel hébergeur statique, **sans règle de
réécriture**. Seules les URL inconnues (`/nimportequoi`) ont besoin d'un repli
pour atteindre le 404 de l'application plutôt que celui de l'hébergeur :

- **Netlify** — `public/_redirects` : `/* /index.html 200`
- **Vercel** — `vercel.json` : `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`
- **nginx** — `try_files $uri $uri/ /index.html;`
- **Caddy / GitHub Pages** — `try_files` équivalent, ou une copie de
  `index.html` en `404.html`

Rien n'a été ajouté au dépôt : l'hébergeur actuel n'est pas connu, et poser le
mauvais fichier est pire que de ne rien poser. Une ligne à ajouter le jour du
déploiement.

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
