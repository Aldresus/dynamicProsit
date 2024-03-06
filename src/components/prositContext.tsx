"use client";
import { Prosit } from "@/types/prosit";
import { createContext } from "react";

export const defaultPrositValue: Prosit = {
	// Provide default values
	currentAnchor: "",
	touched: false,
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
