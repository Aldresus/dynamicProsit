import { OrderedItem } from "@/types/orderedItem";

export interface Prosit {
	prositVersion: number;
	currentAnchor: string;

	titre: string;
	lien: string;
	generalisation: string;
	contexte: string;
	animateur: string;
	gestionnaire: string;
	scribe: string;
	secretaire: string;

	problematiques: OrderedItem[];
	planDAction: OrderedItem[];
	pistesDeSolutions: OrderedItem[];
	livrables: OrderedItem[];
	motsCles: OrderedItem[];
	contraintes: OrderedItem[];
}

export enum PrositKeys {
	PROBLEMATIQUES = "problematiques",
	PLAN_D_ACTION = "planDAction",
	PISTES_DE_SOLUTIONS = "pistesDeSolutions",
	LIVRABLES = "livrables",
	MOTS_CLES = "motsCles",
	CONTRAINTES = "contraintes",
}
