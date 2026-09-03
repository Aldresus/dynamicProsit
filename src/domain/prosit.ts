/**
 * Bumped when the stored shape changes. v4 is the first version to hold more
 * than one document, so a prosit carries an `id` and the version moved up to
 * the library that owns them.
 */
export const PROSIT_VERSION = 4;

export interface OrderedItem {
	id: string;
	content: string;
}

/** The six fields holding an ordered list. */
export type ListField =
	| "motsCles"
	| "contraintes"
	| "problematiques"
	| "pistesDeSolutions"
	| "livrables"
	| "planDAction";

/** The eight free-text fields on the Informations page. */
export type TextField =
	| "titre"
	| "lien"
	| "generalisation"
	| "contexte"
	| "animateur"
	| "gestionnaire"
	| "scribe"
	| "secretaire";

export type Prosit = { id: string } & Record<TextField, string> &
	Record<ListField, OrderedItem[]>;

export const TEXT_FIELDS: readonly TextField[] = [
	"titre",
	"lien",
	"generalisation",
	"contexte",
	"animateur",
	"gestionnaire",
	"scribe",
	"secretaire",
];

export const LIST_FIELDS: readonly ListField[] = [
	"motsCles",
	"contraintes",
	"problematiques",
	"pistesDeSolutions",
	"livrables",
	"planDAction",
];

export function emptyProsit(): Prosit {
	return {
		id: crypto.randomUUID(),
		titre: "",
		lien: "",
		generalisation: "",
		contexte: "",
		animateur: "",
		gestionnaire: "",
		scribe: "",
		secretaire: "",
		motsCles: [],
		contraintes: [],
		problematiques: [],
		pistesDeSolutions: [],
		livrables: [],
		planDAction: [],
	};
}

/** Empty documents are hidden in the presentation view rather than shown as a wall of headings. */
export function isEmpty(prosit: Prosit): boolean {
	return (
		TEXT_FIELDS.every((f) => prosit[f].trim() === "") &&
		LIST_FIELDS.every((f) => prosit[f].length === 0)
	);
}

/** What the switcher shows. An untitled prosit still needs to be pickable. */
export const prositLabel = (prosit: Prosit): string =>
	prosit.titre.trim() || "Prosit sans titre";
