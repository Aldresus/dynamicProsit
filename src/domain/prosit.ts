/** Bumped when the stored shape changes. Older documents are discarded, not migrated. */
export const PROSIT_VERSION = 3;

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

export type Prosit = { prositVersion: number } & Record<TextField, string> &
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
		prositVersion: PROSIT_VERSION,
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
