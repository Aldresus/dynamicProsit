import templateUrl from "../assets/template.docx?url";
import type { Prosit } from "./prosit";

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

export const documentName = (prosit: Prosit): string => {
	const titre = prosit.titre.trim().replaceAll(" ", "_");
	return `PA-${titre || "prosit"}.docx`;
};

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
