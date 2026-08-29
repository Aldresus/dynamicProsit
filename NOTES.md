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
