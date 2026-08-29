import { LIST_SECTIONS } from "./sections";

export const SITE = {
	origin: "https://prosit.hugochampy.fr",
	name: "DynamicPrositX",
	title: "DynamicPrositX, l'outil pour vos prosits réussis !",
	description:
		"Une interface intuitive et efficace pour accompagner vos prosits. Enfin un outil pour vous aider à faire vos prosits !",
	shortDescription:
		"Une interface intuitive et efficace pour accompagner vos prosits.",
	image: "/og.png",
	twitter: "@Aldresus",
	author: { name: "Hugo Champy", url: "https://hugochampy.fr" },
	keywords: [
		"prosit",
		"prosits",
		"dynamic",
		"prositx",
		"dynamicprositx",
		"dynamicp",
		"dynamicprosit",
		"cesi",
		"outil prosit",
		"dynamic prosit",
		"prosit dynamique",
	],
} as const;

export interface PageSeo {
	path: string;
	title: string;
	description: string;
	/** Kept out of the sitemap and disallowed in robots.txt. */
	indexable: boolean;
}

/** Genitive used in each step's description, as the old per-route metadata had it. */
const PURPOSE: Record<string, string> = {
	"mots-clefs": "votre recherche de mots-clefs",
	contraintes: "votre recherche de contraintes",
	problematiques: "votre recherche de problématiques",
	"pistes-de-solution": "votre recherche de pistes de solution",
	livrables: "votre recherche de livrables",
	"plan-d-action": "l'écriture de votre plan d'action",
};

export const HOME: PageSeo = {
	path: "/",
	title: SITE.title,
	description: SITE.description,
	indexable: true,
};

export const PAGES: PageSeo[] = [
	HOME,
	...LIST_SECTIONS.map((section) => ({
		path: `/${section.slug}`,
		title: `${SITE.name} | ${section.label}`,
		description: `Une interface intuitive et efficace pour accompagner ${PURPOSE[section.slug] ?? section.label.toLowerCase()}. Enfin un outil pour vous aider à faire vos prosits !`,
		indexable: true,
	})),
	{
		path: "/presentation",
		title: `${SITE.name} | Présentation`,
		description: "Vue de présentation, pensée pour être projetée.",
		// robots.txt disallows it; the old sitemap listed it anyway, which was a
		// contradiction — a projector view is of no use to anyone arriving cold.
		indexable: false,
	},
];

export const pageFor = (path: string): PageSeo =>
	PAGES.find((page) => page.path === path) ?? HOME;

/** One shape, used both by the router at runtime and by the prerender step. */
export function metaTags(page: PageSeo) {
	const url = `${SITE.origin}${page.path === "/" ? "" : page.path}`;
	const image = `${SITE.origin}${SITE.image}`;
	return [
		{ title: page.title },
		{ name: "description", content: page.description },
		{ name: "keywords", content: SITE.keywords.join(", ") },
		{ name: "author", content: SITE.author.name },
		...(page.indexable ? [] : [{ name: "robots", content: "noindex" }]),

		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: SITE.name },
		{ property: "og:title", content: page.title },
		{ property: "og:description", content: page.description },
		{ property: "og:url", content: url },
		{ property: "og:image", content: image },
		{ property: "og:image:alt", content: SITE.name },

		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:site", content: SITE.twitter },
		{ name: "twitter:title", content: page.title },
		{ name: "twitter:description", content: page.description },
		{ name: "twitter:image", content: image },
	];
}
