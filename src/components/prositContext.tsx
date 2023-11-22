"use client";
import { createContext, ReactNode } from "react";
import { Prosit } from "@/types/prosit";

export const defaultPrositValue: Prosit = {
  // Provide default values
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
};

interface PrositProviderProps {
  children: ReactNode;
}

const PrositContext = createContext({
  prosit: defaultPrositValue,
  setProsit: (prosit: Prosit) => {},
  clearProsit: () => {},
});

export default PrositContext;
