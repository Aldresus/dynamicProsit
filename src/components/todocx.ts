import { Prosit } from "@/types/prosit";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/app/Notifications.module.css";
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
            titre: prosit.titre.trim(),
            contexte: prosit.contexte.trim(),
            generalisation: prosit.generalisation.trim(),
            lien: prosit.lien.trim(),
            animateur: prosit.animateur.trim(),
            secretaire: prosit.secretaire.trim(),
            gestionnaire: prosit.gestionnaire.trim(),
            scribe: prosit.scribe.trim(),
            motsCles: prosit.motsCles.map((motCle) => motCle.content.trim()),
            contraintes: prosit.contraintes.map((contrainte) =>
                contrainte.content.trim()
            ),
            problematiques: prosit.problematiques.map((problematique) =>
                problematique.content.trim()
            ),
            livrables: prosit.livrables.map((livrable) =>
                livrable.content.trim()
            ),
            pistesDeSolutions: prosit.pistesDeSolutions.map((pisteDeSolution) =>
                pisteDeSolution.content.trim()
            ),
            planDAction: prosit.planDAction.map((etape) =>
                etape.content.trim()
            ),
        });
        const blob = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        // Output the document using Data-URI
        saveAs(blob, `PA-${prosit.titre.trim().replaceAll(" ", "_")}.docx`);
        notifications.show({
            title: "Téléchargement en cours...",
            message: "Votre prosit est en cours de téléchargement.",
            classNames: notifClasses,
            autoClose: 3000,
            withBorder: true,
            withCloseButton: true,
        });
    });
};
