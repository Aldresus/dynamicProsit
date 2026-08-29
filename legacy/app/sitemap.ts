import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://prosit.hugochampy.fr",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/mots-clefs",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/contraintes",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/problematiques",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/pistes-de-solution",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/livrables",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/plan-d-action",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://prosit.hugochampy.fr/presentation",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
	];
}
