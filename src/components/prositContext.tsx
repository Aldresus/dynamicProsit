"use client";
import { Prosit } from "@/types/prosit";
import { createContext } from "react";

export const defaultPrositValue: Prosit = {
	// Provide default values
	prositVersion: 2,
	currentAnchor: "",
	titre: "",
	lien: "",
	generalisation: "",
	contexte: "",
	animateur: "",
	gestionnaire: "",
	scribe: "",
	secretaire: "",
	problematiques: [],
	planDAction: [],
	pistesDeSolutions: [],
	livrables: [],
	motsCles: [],
	contraintes: [],
};

const PrositContext = createContext({
	prosit: defaultPrositValue,
	setProsit: (prosit: Prosit) => {},
	clearProsit: () => {},
});

export default PrositContext;
