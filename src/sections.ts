import {
	AlertCircle,
	AreaChart,
	HelpCircle,
	Info,
	KeyRound,
	Lightbulb,
	MapPinned,
} from "lucide-react";
import type { ListField } from "./domain/prosit";

/**
 * One row per step. Replaces the six parallel enums the old build kept in
 * lockstep by hand (AnchorsKeys, Anchors, AnchorsURL, AnchorsLabels,
 * anchorsOrder, PrositKeys) — adding a step was six edits and is now one.
 */
export interface ListSection {
	/** URL segment, and the `$section` route param. */
	slug: string;
	field: ListField;
	label: string;
	icon: typeof Info;
	/** Heading in the présentation view, which names the list rather than the step. */
	presentationTitle: string;
	placeholder: string;
	addLabel: string;
	/** Numbered in both the editor and the présentation. */
	ordered: boolean;
	/** Shortcut that jumps here, bound globally. */
	shortcut: string;
}

export const LIST_SECTIONS: readonly ListSection[] = [
	{
		slug: "mots-clefs",
		field: "motsCles",
		label: "Mots clefs",
		icon: KeyRound,
		presentationTitle: "Mots-clefs :",
		placeholder: "fromage",
		addLabel: "Ajouter le mot clef",
		ordered: false,
		shortcut: "Alt+Shift+Z",
	},
	{
		slug: "contraintes",
		field: "contraintes",
		label: "Contraintes",
		icon: AlertCircle,
		presentationTitle: "Contraintes :",
		placeholder: "Le fromage doit être retrouvé avant de pourrir",
		addLabel: "Ajouter la contrainte",
		ordered: false,
		shortcut: "Alt+Shift+E",
	},
	{
		slug: "problematiques",
		field: "problematiques",
		label: "Problématiques",
		icon: HelpCircle,
		presentationTitle: "Problématiques :",
		placeholder: "Comment retrouver mon fromage ?",
		addLabel: "Ajouter la problématique",
		ordered: false,
		shortcut: "Alt+Shift+R",
	},
	{
		slug: "pistes-de-solution",
		field: "pistesDeSolutions",
		label: "Pistes de solution",
		icon: Lightbulb,
		presentationTitle: "Pistes de solution :",
		placeholder: "Interroger les suspects",
		addLabel: "Ajouter la piste de solution",
		ordered: false,
		shortcut: "Alt+Shift+T",
	},
	{
		slug: "livrables",
		field: "livrables",
		label: "Livrables",
		icon: AreaChart,
		presentationTitle: "Livrables :",
		placeholder: "Un algorithme en python",
		addLabel: "Ajouter le livrable",
		ordered: false,
		shortcut: "Alt+Shift+Y",
	},
	{
		slug: "plan-d-action",
		field: "planDAction",
		label: "Plan d'action",
		icon: MapPinned,
		presentationTitle: "Plan d'action :",
		placeholder: "Etudier le fromage",
		addLabel: "Ajouter l'étape",
		ordered: true,
		shortcut: "Alt+Shift+U",
	},
];

export const INFORMATIONS = {
	slug: null,
	label: "Informations",
	icon: Info,
	shortcut: "Alt+Shift+A",
} as const;

/** Nav and prev/next order: Informations, then the six lists. */
export const STEPS = [INFORMATIONS, ...LIST_SECTIONS] as const;

export type Step = (typeof STEPS)[number];

export const findSection = (slug: string): ListSection | undefined =>
	LIST_SECTIONS.find((section) => section.slug === slug);

export const pathOf = (step: Step): string =>
	step.slug === null ? "/" : `/${step.slug}`;

const indexOf = (slug: string | null): number =>
	STEPS.findIndex((step) => step.slug === slug);

/** Both wrap, as the old navigator did — the last step's "next" is Informations. */
export const nextStep = (slug: string | null): Step =>
	STEPS[(indexOf(slug) + 1) % STEPS.length] ?? INFORMATIONS;

export const previousStep = (slug: string | null): Step =>
	STEPS[(indexOf(slug) - 1 + STEPS.length) % STEPS.length] ?? INFORMATIONS;
