import { readFileSync } from "node:fs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { describe, expect, it } from "vitest";
import { documentName, templateData } from "./docx";
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
