import { Prosit } from "@/types/prosit";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
// biome-ignore lint/suspicious/noExplicitAny: any is required for dynamic import
let PizZipUtils: any = null;
if (typeof window !== "undefined") {
	import("pizzip/utils/index.js").then((r) => {
		PizZipUtils = r;
	});
}

// biome-ignore lint/suspicious/noExplicitAny: the lib doesn't specify the type
function loadFile(url: string, callback: (error: any, content: any) => void) {
	PizZipUtils.getBinaryContent(url, callback);
}
export const todocx = (prosit: Prosit) => {
	loadFile("/template.docx", (error, content) => {
		if (error) {
			throw error;
		}
		const zip = new PizZip(content);
		const doc = new Docxtemplater()
			.loadZip(zip)
			.setOptions({ paragraphLoop: true, linebreaks: true });
		// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
		doc.render({
			titre: prosit.titre,
			motsCles: prosit.motsCles,
			contexte: prosit.contexte,
			contraintes: prosit.contraintes,
			problematiques: prosit.problematiques,
			livrables: prosit.livrables,
			generalisation: prosit.generalisation,
			pistesDeSolutions: prosit.pistesDeSolutions,
			planDAction: prosit.planDAction.map((etape) => etape.content),
			lien: prosit.lien,
			animateur: prosit.animateur,
			secretaire: prosit.secretaire,
			gestionnaire: prosit.gestionnaire,
			scribe: prosit.scribe,
		});
		const blob = doc.getZip().generate({
			type: "blob",
			mimeType:
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});
		// Output the document using Data-URI
		saveAs(blob, `${prosit.titre.replaceAll(" ", "_")}.docx`);
	});
};
