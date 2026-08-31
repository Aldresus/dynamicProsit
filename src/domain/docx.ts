import templateUrl from "../assets/template.docx?url";
import { type Prosit, emptyProsit } from "./prosit";
import { parseProsit } from "./storage";

const DOCX_MIME =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * The template is a bundled asset, not a runtime fetch of `/template.docx`.
 * Vite hashes it and the import fails the build if it ever goes missing, where
 * the old path only failed in the user's face at the moment they clicked export.
 */
const loadTemplate = async (): Promise<ArrayBuffer> => {
	const response = await fetch(templateUrl);
	if (!response.ok) throw new Error(`Modèle illisible (${response.status})`);
	return response.arrayBuffer();
};

/** The template's loops (`{#motsCles}{.}{/motsCles}`) want plain strings. */
const contents = (prosit: Prosit, field: keyof Prosit): string[] =>
	(prosit[field] as { content: string }[]).map((item) => item.content.trim());

/** Every placeholder the template declares, and nothing else. Exported to be tested. */
export const templateData = (
	prosit: Prosit,
): Record<string, string | string[]> => ({
	titre: prosit.titre.trim(),
	lien: prosit.lien.trim(),
	generalisation: prosit.generalisation.trim(),
	contexte: prosit.contexte.trim(),
	animateur: prosit.animateur.trim(),
	gestionnaire: prosit.gestionnaire.trim(),
	scribe: prosit.scribe.trim(),
	secretaire: prosit.secretaire.trim(),
	motsCles: contents(prosit, "motsCles"),
	contraintes: contents(prosit, "contraintes"),
	problematiques: contents(prosit, "problematiques"),
	pistesDeSolutions: contents(prosit, "pistesDeSolutions"),
	livrables: contents(prosit, "livrables"),
	planDAction: contents(prosit, "planDAction"),
});

/**
 * An allowlist, not a list of forbidden characters: letters (accents included),
 * digits, combining marks, spaces and `._-`. Everything else goes — path
 * separators, the Windows-reserved set, control characters, emoji. Naming what
 * is safe is shorter than naming everything that is not, and it cannot be
 * outflanked by a character nobody thought of.
 */
const UNSAFE_IN_FILENAME = /[^\p{L}\p{N}\p{M} ._-]/gu;

export const documentName = (prosit: Prosit): string => {
	// A prosit titled "Prosit 1/2" was producing `PA-Prosit_1/2.docx`.
	const titre = prosit.titre
		.trim()
		.replace(UNSAFE_IN_FILENAME, "")
		.replace(/\s+/g, "_")
		// A leading dot would make it a hidden file on unix.
		.replace(/^\.+/, "")
		.slice(0, 80);
	return `PA-${titre || "prosit"}.docx`;
};

/*
 * The round-trip. A .docx is an OPC package — a zip of XML parts — and OOXML
 * reserves `customXml` for exactly this: application data riding along with the
 * document, ignored by Word's renderer and preserved across its saves. So the
 * exported file carries the prosit itself rather than the app having to read
 * back its own prose, which would be a lossy guess at best.
 */

type PizZipInstance = InstanceType<typeof import("pizzip").default>;

const NAMESPACE = "https://lesprositsla.super/prosit";

/** XML text nodes admit only these three. Order matters on the way back. */
const escapeXml = (value: string): string =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const unescapeXml = (value: string): string =>
	value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

/** rId1–rId6 are the template's own; this one cannot collide with them. */
const RELATIONSHIP_ID = "rId100";

const ITEM_ID = "{1E4A1C5B-6F2D-4A7E-9C3B-8D5E7F1A2B3C}";

/** Exported so the round-trip can be tested against the real template. */
export function embedProsit(zip: PizZipInstance, prosit: Prosit): void {
	zip.file(
		"customXml/item1.xml",
		`${DECLARATION}<prosit xmlns="${NAMESPACE}">${escapeXml(
			JSON.stringify(prosit),
		)}</prosit>`,
	);
	zip.file(
		"customXml/itemProps1.xml",
		`${DECLARATION}<ds:datastoreItem xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml" ds:itemID="${ITEM_ID}"><ds:schemaRefs><ds:schemaRef ds:uri="${NAMESPACE}"/></ds:schemaRefs></ds:datastoreItem>`,
	);
	zip.file(
		"customXml/_rels/item1.xml.rels",
		`${DECLARATION}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps" Target="itemProps1.xml"/></Relationships>`,
	);

	// A part nothing points at is a part Word is free to drop.
	const rels = "word/_rels/document.xml.rels";
	zip.file(
		rels,
		text(zip, rels).replace(
			"</Relationships>",
			`<Relationship Id="${RELATIONSHIP_ID}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml" Target="../customXml/item1.xml"/></Relationships>`,
		),
	);

	// item1.xml is covered by the package's Default for .xml; its properties
	// part is not, and an unlisted part makes the whole file unopenable.
	const types = "[Content_Types].xml";
	zip.file(
		types,
		text(zip, types).replace(
			"</Types>",
			'<Override PartName="/customXml/itemProps1.xml" ContentType="application/vnd.openxmlformats-officedocument.customXmlProperties+xml"/></Types>',
		),
	);
}

/** `asText` on a part that is not there would throw somewhere less legible. */
function text(zip: PizZipInstance, path: string): string {
	const part = zip.file(path);
	if (!part) throw new Error(`Partie manquante dans le .docx : ${path}`);
	return part.asText();
}

/**
 * Reads a prosit back out of a .docx this app produced. Word renumbers custom
 * XML parts when other add-ins add their own, so the part is found by its
 * namespace rather than by being item1.
 */
export async function importDocx(file: File): Promise<Prosit> {
	const { default: PizZip } = await import("pizzip");

	let zip: PizZipInstance;
	try {
		zip = new PizZip(await file.arrayBuffer());
	} catch {
		throw new Error("Ce fichier n'est pas un .docx lisible.");
	}

	for (const path of Object.keys(zip.files)) {
		if (!path.startsWith("customXml/item") || !path.endsWith(".xml")) continue;
		const raw = text(zip, path);
		if (!raw.includes(NAMESPACE)) continue;

		// String slicing rather than a regex: the payload is JSON, and a greedy
		// pattern over an arbitrary document is a worse way to find its edges.
		const open = raw.indexOf(">", raw.indexOf("<prosit"));
		const close = raw.lastIndexOf("</prosit>");
		if (open === -1 || close <= open) continue;
		const payload = raw.slice(open + 1, close);

		// The file came from the user's disk, so it is untrusted input and goes
		// through the same check as anything read out of localStorage.
		const imported = parseProsit(JSON.parse(unescapeXml(payload)));
		// A fresh id: importing the same file twice makes two prosits rather
		// than one document occupying two slots in the library.
		return { ...imported, id: emptyProsit().id };
	}

	throw new Error(
		"Ce .docx ne contient pas de prosit — seuls les fichiers exportés par cette application peuvent être réimportés.",
	);
}

export async function exportDocx(prosit: Prosit): Promise<void> {
	// docxtemplater and pizzip are ~490 kB and matter only once someone clicks
	// export, so they load then rather than sitting in the first paint.
	const [{ default: Docxtemplater }, { default: PizZip }, template] =
		await Promise.all([
			import("docxtemplater"),
			import("pizzip"),
			loadTemplate(),
		]);

	const zip = new PizZip(template);
	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
	});

	doc.render(templateData(prosit));

	embedProsit(doc.getZip(), prosit);

	const blob = doc.getZip().generate({
		type: "blob",
		mimeType: DOCX_MIME,
	});

	// ponytail: `<a download>` is the native save. file-saver bought nothing.
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = documentName(prosit);
	link.click();
	URL.revokeObjectURL(url);
}
