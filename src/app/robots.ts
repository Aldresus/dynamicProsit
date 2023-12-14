import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/presentation",
				"/mots-clefs",
				"/contraintes",
				"/problematiques",
				"/pistes-de-solution",
				"/livrables",
				"/plan-d-action",
			],
		},
		sitemap: "https://prosit.hugochampy.fr/sitemap.xml",
	};
}
