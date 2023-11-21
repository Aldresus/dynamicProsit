import { Etape } from "@/types/etape";

export interface Prosit {
  titre: string;
  lien: string;
  generalisation: string;
  contexte: string;
  animateur: string;
  gestionnaire: string;
  scribe: string;
  secretaire: string;

  problematiques: string[];
  planDAction: Etape[];
  pistesDeSolutions: string[];
  livrables: string[];
  motsCles: string[];
}