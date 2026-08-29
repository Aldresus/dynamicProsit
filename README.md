[![Code quality](https://github.com/Aldresus/dynamicProsit/actions/workflows/biome.yml/badge.svg?branch=main)](https://github.com/Aldresus/dynamicProsit/actions/workflows/biome.yml)

# DynamicPrositX

Un outil pour accompagner les prosits : un formulaire en sept étapes, un export
`.docx`, et une vue de présentation à projeter qui suit le formulaire en direct.

<https://prosit.hugochampy.fr>

## Démarrer

Le design system est publié sur GitHub Packages, il faut donc un `GITHUB_TOKEN`
(token classique, scope `read:packages`) dans l'environnement — `.npmrc` le lit,
et n'est jamais commité avec sa valeur.

```bash
bun install
bun run dev
```

| Commande | Ce qu'elle fait |
| --- | --- |
| `bun run dev` | serveur de développement |
| `bun run build` | typecheck, bundle, puis prérendu des huit pages |
| `bun run test` | tests unitaires (Vitest) |
| `bun run lint` | Biome |
| `bun run og` | régénère `public/og.png` (uniquement si le texte change) |

## Architecture

Vite + React 19 + TanStack Router, en SPA statique. Tailwind v4 et
[`@aldresus/design-system`](https://github.com/Aldresus/hcds) pour l'interface.

```
src/
  domain/      types, stockage, opérations sur les listes, export .docx, sync
  routes/      arbre TanStack Router (fichiers)
  components/  vues réutilisables
  sections.ts  LA table des sept étapes
  seo.ts       métadonnées par page
scripts/       prérendu et génération de la carte sociale
```

Deux points portent le reste :

**`sections.ts` est la source unique des étapes.** Ajouter une étape à un prosit
est une ligne dans ce tableau : la navigation, les raccourcis, la route, la vue
de présentation, le sitemap et les métadonnées en découlent. Les six pages de
liste partagent une seule route `$section`.

**Le document vit dans `localStorage` et voyage par `BroadcastChannel`.** La
fenêtre de présentation n'a pas d'état propre : elle lit le stockage une fois
pour s'afficher, puis suit le canal que le formulaire publie.

## Format des données

`prositVersion` vaut **3**. Les documents v1 et v2 ne sont plus migrés : un
prosit enregistré dans une version antérieure est ignoré silencieusement au
chargement et remplacé par un document vide.

Le stockage est traité comme une entrée non fiable — il est modifiable par
l'utilisateur — donc chaque champ est vérifié au chargement.

## Déploiement

`bun run build` produit un `dist/` entièrement statique, avec un `index.html`
par route. N'importe quel hébergeur de fichiers convient ; voir `NOTES.md` pour
la règle de repli des URL inconnues selon l'hébergeur.

## Notes

`NOTES.md` liste les décisions de la réécriture qui méritent une relecture.
