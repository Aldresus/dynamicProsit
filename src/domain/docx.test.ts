import { readFileSync } from "node:fs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { describe, expect, it } from "vitest";
import { documentName, embedProsit, importDocx, templateData } from "./docx";
import { addItem } from "./items";
import { emptyProsit } from "./prosit";

const TEMPLATE = "src/assets/template.docx";

const filled = () => {
	const prosit = emptyProsit();
	prosit.titre = "  Oh non mon fromage  ";
	prosit.generalisation = "pasteurisation, vol";
	prosit.contexte = "Quelqu'un a volé mon fromage";
	prosit.lien = "https://hugochampy.fr";
	prosit.animateur = "Pierre";
	prosit.scribe = "Paul";
	prosit.gestionnaire = "Jacques";
	prosit.secretaire = "Jeanne";
	prosit.motsCles = addItem(addItem([], "fromage"), "alibi");
	prosit.planDAction = addItem([], "interroger les suspects");
	return prosit;
};

/** Placeholders the template actually declares — read from the file, not assumed. */
function placeholders(): Set<string> {
	const zip = new PizZip(readFileSync(TEMPLATE));
	const text =
		zip
			.file("word/document.xml")
			?.asText()
			.replace(/<[^>]+>/g, "") ?? "";
	const names = [...text.matchAll(/\{[#/]?([a-zA-Z]+)\}/g)].map((m) => m[1]);
	return new Set(
		names.filter((name): name is string => !!name && name !== "."),
	);
}

/** Word stores text as XML, so `'` arrives as `&apos;`. */
const decode = (xml: string): string =>
	xml
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");

const renderedText = (prosit: ReturnType<typeof filled>): string => {
	const zip = new PizZip(readFileSync(TEMPLATE));
	const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
	doc.render(templateData(prosit));
	return decode(
		doc
			.getZip()
			.file("word/document.xml")
			?.asText()
			.replace(/<[^>]+>/g, "") ?? "",
	);
};

describe("docx export", () => {
	it("supplies exactly the placeholders the template declares", () => {
		expect(new Set(Object.keys(templateData(filled())))).toEqual(
			placeholders(),
		);
	});

	it("trims the values it sends", () => {
		expect(templateData(filled()).titre).toBe("Oh non mon fromage");
	});

	// The whole point: the rendered document carries the data, with no {tags} left.
	it("renders the values into the document", () => {
		const text = renderedText(filled());
		for (const value of [
			"Oh non mon fromage",
			"pasteurisation, vol",
			"Quelqu'un a volé mon fromage",
			"Pierre",
			"Jeanne",
			"Fromage",
			"Alibi",
			"Interroger les suspects",
		]) {
			expect(text).toContain(value);
		}
	});

	it("leaves no unsubstituted placeholder behind", () => {
		expect(renderedText(filled())).not.toMatch(/\{[#/]?[a-zA-Z.]+\}/);
	});

	it("names the file after the title, and falls back when there is none", () => {
		expect(documentName(filled())).toBe("PA-Oh_non_mon_fromage.docx");
		expect(documentName(emptyProsit())).toBe("PA-prosit.docx");
	});
});

describe("documentName", () => {
	const named = (titre: string) => documentName({ ...emptyProsit(), titre });

	it("strips characters a filesystem would reject", () => {
		expect(named("Prosit 1/2")).toBe("PA-Prosit_12.docx");
		// Note the doubled backslash: a literal one, not an escape.
		expect(named('a\\b:c*d?e"f<g>h|i')).toBe("PA-abcdefghi.docx");
		// A real control character is stripped along with it.
		expect(named("a\bb")).toBe("PA-ab.docx");
	});

	it("collapses whitespace and keeps accents", () => {
		expect(named("  Oh non   mon fromage ")).toBe("PA-Oh_non_mon_fromage.docx");
		// The em dash is not in the allowlist; accents are.
		expect(named("Prosit — édition")).toBe("PA-Prosit_édition.docx");
	});

	it("falls back when the title has nothing usable in it", () => {
		expect(named("   ")).toBe("PA-prosit.docx");
		expect(named("///")).toBe("PA-prosit.docx");
	});

	it("does not produce a hidden file", () => {
		expect(named("...caché")).toBe("PA-caché.docx");
	});
});

/** Export and re-import, through the very functions the app uses. */
const roundTrip = async (prosit: ReturnType<typeof filled>) => {
	const doc = new Docxtemplater(new PizZip(readFileSync(TEMPLATE)), {
		paragraphLoop: true,
		linebreaks: true,
	});
	doc.render(templateData(prosit));
	embedProsit(doc.getZip(), prosit);
	const bytes: ArrayBuffer = doc.getZip().generate({ type: "arraybuffer" });
	return importDocx(new File([bytes], "prosit.docx"));
};

describe("docx round-trip", () => {
	it("brings every field back", async () => {
		const original = filled();
		const back = await roundTrip(original);
		expect(back.titre).toBe(original.titre);
		expect(back.contexte).toBe(original.contexte);
		expect(back.motsCles).toEqual(original.motsCles);
		expect(back.planDAction).toEqual(original.planDAction);
	});

	// Two imports of one file are two prosits, not one document in two slots.
	it("gives the imported document an id of its own", async () => {
		const original = filled();
		expect((await roundTrip(original)).id).not.toBe(original.id);
	});

	it("survives characters XML would otherwise choke on", async () => {
		const original = filled();
		original.contexte = 'a < b & c > d "e" <w:p/>';
		expect((await roundTrip(original)).contexte).toBe(original.contexte);
	});

	it("keeps the document readable as a .docx", async () => {
		const doc = new Docxtemplater(new PizZip(readFileSync(TEMPLATE)), {
			paragraphLoop: true,
			linebreaks: true,
		});
		doc.render(templateData(filled()));
		embedProsit(doc.getZip(), filled());
		const zip = new PizZip(doc.getZip().generate({ type: "arraybuffer" }));
		// The properties part must be declared or Word refuses the whole file.
		expect(zip.file("[Content_Types].xml")?.asText()).toContain(
			"/customXml/itemProps1.xml",
		);
		// A part nothing points at is a part Word is free to drop.
		expect(zip.file("word/_rels/document.xml.rels")?.asText()).toContain(
			"../customXml/item1.xml",
		);
	});

	it("refuses a .docx that carries no prosit", async () => {
		const bare = new File([readFileSync(TEMPLATE)], "vierge.docx");
		await expect(importDocx(bare)).rejects.toThrow(/ne contient pas/);
	});

	it("refuses something that is not a .docx at all", async () => {
		await expect(
			importDocx(new File(["pas un zip"], "note.txt")),
		).rejects.toThrow(/lisible/);
	});
});
