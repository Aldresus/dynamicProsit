"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Prosit } from "@/types/prosit";

const defaultPrositValue: Prosit = {
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
});

export const PrositProvider: React.FC<PrositProviderProps> = ({ children }) => {
  const [prosit, setProsit] = useState<Prosit>(() => {
    // Attempt to get stored value from localStorage
    const storedProsit = localStorage.getItem("prosit");
    return storedProsit ? JSON.parse(storedProsit) : defaultPrositValue;
  });

  useEffect(() => {
    // Store prosit in localStorage whenever it changes
    localStorage.setItem("prosit", JSON.stringify(prosit));
  }, [prosit]);
  return (
    <PrositContext.Provider value={{ prosit, setProsit }}>
      {children}
    </PrositContext.Provider>
  );
};

export default PrositContext;
