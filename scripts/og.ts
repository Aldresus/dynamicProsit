import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../src/seo";

/**
 * Regenerates the social card. Run with `bun run og` after changing the wording;
 * the PNG is committed, so a normal build does not need this or its native dep.
 *
 * The design system only ships woff2, which resvg cannot read, so the wordmark is
 * set in Georgia — the very face the package names as Bitter's fallback, so the
 * card stays in the family rather than picking something at random.
 */
const ACCENT = "#479EFA";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="0" y="0" width="1200" height="10" fill="${ACCENT}"/>
  <g transform="translate(600 300)">
    <text text-anchor="middle" font-family="Georgia" font-size="86" font-weight="700" fill="#020817">${SITE.name}</text>
    <text y="70" text-anchor="middle" font-family="Arial" font-size="30" fill="#5A6473">${SITE.shortDescription}</text>
  </g>
  <g transform="translate(555 385) scale(3.75)" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </g>
</svg>`;

const png = new Resvg(svg, {
	fitTo: { mode: "width", value: 1200 },
	font: { loadSystemFonts: true, defaultFontFamily: "Georgia" },
})
	.render()
	.asPng();

const out = join(import.meta.dirname, "..", "public", "og.png");
writeFileSync(out, png);
console.log(`og.png ${(png.length / 1024).toFixed(1)} kB → public/og.png`);
