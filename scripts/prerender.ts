import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PAGES, SITE, metaTags } from "../src/seo";

/**
 * Writes one HTML file per route, each carrying that route's head tags.
 *
 * This is not SSR — the body stays the empty SPA root and the router paints it.
 * It exists because crawlers that matter for a link preview (Twitter, Slack,
 * Discord, Facebook) never run JavaScript, so metadata injected at runtime by
 * `HeadContent` is metadata they never see. A static host serves these files
 * directly, so the eight real URLs also work on a hard refresh with no rewrite
 * rule at all.
 */
const escapeAttr = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const renderTags = (page: (typeof PAGES)[number]) =>
	metaTags(page)
		.map((tag) => {
			if ("title" in tag && tag.title)
				return `<title>${escapeAttr(tag.title)}</title>`;
			const key = "property" in tag ? "property" : "name";
			const attr = (tag as Record<string, string>)[key];
			const content = (tag as Record<string, string>).content;
			if (!attr || content === undefined) return "";
			return `<meta ${key}="${escapeAttr(attr)}" content="${escapeAttr(content)}" />`;
		})
		.filter(Boolean)
		.join("\n\t\t");

function prerender(dist: string) {
	const shell = readFileSync(join(dist, "index.html"), "utf8");

	for (const page of PAGES) {
		const canonical = `${SITE.origin}${page.path === "/" ? "" : page.path}`;
		const head = `${renderTags(page)}\n\t\t<link rel="canonical" href="${canonical}" />`;

		// The template's own <title> is the default; swap it for this route's head.
		const html = shell.replace(/<title>[\s\S]*?<\/title>/, head);

		const file =
			page.path === "/"
				? join(dist, "index.html")
				: join(dist, page.path, "index.html");
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, html);
		console.log(`  ${page.path.padEnd(22)} → ${file.replace(dist, "dist")}`);
	}

	const indexable = PAGES.filter((page) => page.indexable);
	const today = new Date().toISOString().slice(0, 10);
	writeFileSync(
		join(dist, "sitemap.xml"),
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
	.map(
		(page) => `\t<url>
\t\t<loc>${SITE.origin}${page.path === "/" ? "/" : page.path}</loc>
\t\t<lastmod>${today}</lastmod>
\t\t<changefreq>yearly</changefreq>
\t\t<priority>${page.path === "/" ? "1.0" : "0.8"}</priority>
\t</url>`,
	)
	.join("\n")}
</urlset>
`,
	);

	writeFileSync(
		join(dist, "robots.txt"),
		`User-agent: *
Allow: /
${PAGES.filter((page) => !page.indexable)
	.map((page) => `Disallow: ${page.path}`)
	.join("\n")}

Sitemap: ${SITE.origin}/sitemap.xml
`,
	);

	console.log(`  sitemap.xml (${indexable.length} urls) and robots.txt`);
}

prerender(join(import.meta.dirname, "..", "dist"));
