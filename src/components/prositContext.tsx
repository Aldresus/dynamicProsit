"use client";
import { createContext } from "react";
import { Prosit } from "@/types/prosit";

export const defaultPrositValue: Prosit = {
  // Provide default values
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
