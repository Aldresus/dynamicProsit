import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/presentation"
			],
		},
		sitemap: "https://prosit.hugochampy.fr/sitemap.xml",
	};
}
