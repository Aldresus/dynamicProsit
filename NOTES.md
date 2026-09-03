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

## Styles : rien que les deux imports

`src/styles.css` ne fait plus que les deux imports de la documentation. Le bloc
`@theme inline` qui recopiait le vocabulaire (`--color-surface` →
`var(--hcds-surface)`) a été retiré : recopier des jetons, c'est les écraser au
prochain changement du design system.

Ce que ça implique. Le paquet compile avec `@theme inline`, donc sa feuille
livre les utilitaires déjà résolus, pas le vocabulaire. L'app hérite donc de
**ce que le design system utilise lui-même** — ce qui couvre tout ce qu'elle
écrit (`bg-surface`, `text-fg-muted`, `max-w-measure`, `hover:bg-surface-sunken`
…), vérifié classe par classe sur le CSS émis. Une classe qu'aucun composant du
paquet n'emploie ne serait générée par personne, et sans erreur.

La seule qui était dans ce cas, `hover:text-danger` sur la corbeille de
`sortable-item.tsx`, a disparu : la ligne s'appuie maintenant sur la teinte de
survol du ghost. Reste à demander au design system, dans l'ordre :

1. **un ghost destructeur** — `danger` est un bouton rouge plein, trop lourd
   pour une icône de ligne ; il manque le cran discret qui rougit au survol ;
2. **un `theme.css` pour les consommateurs** (ou un `@theme` non-`inline`), qui
   rendrait tout le vocabulaire utilisable côté app sans le recopier.

Avec le premier, la corbeille retrouve son rouge. Avec le second, la question ne
se pose plus du tout.

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


## Annuler : le toast, Ctrl+Z, et le bouton

Les deux impasses qui avaient imposé le seul bouton dans la barre latérale sont
levées depuis le design system 2.3.0.

**Le toast porte son action.** `ToastList` rend maintenant `Toast.Action`, donc
l'`actionProps` de `toast.add()` aboutit : « Annuler » vit là où la suppression
vient d'avoir lieu.

**`Mod+Z` est lié.** `useShortcut` laisse passer les touches d'édition natives
(z, y, x, c, v, a) quand le focus est dans un champ, donc le Ctrl+Z du
navigateur y survit et le raccourci n'annule que hors saisie.

Le bouton de la barre latérale reste : il couvre ce qu'aucun toast ne rapporte
— ajout, édition, réordonnancement — et reste la seule cible tactile.

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

**L'identifiant est régénéré à l'import.** Importer deux fois le même fichier
donne deux prosits, pas un document occupant deux emplacements.
