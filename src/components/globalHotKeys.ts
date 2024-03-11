import { AnchorsKeys } from "@/types/anchors";
import { HotkeyItem } from "@mantine/hooks";

export const globalHotKeys: (
	navigate: (anchor: AnchorsKeys) => void,
) => HotkeyItem[] = (navigate: (anchor: AnchorsKeys) => void) => [
	["alt+shift+a", () => navigate(AnchorsKeys.INFORMATIONS)],
	["alt+shift+z", () => navigate(AnchorsKeys.MOTS_CLEFS)],
	["alt+shift+e", () => navigate(AnchorsKeys.CONTRAINTES)],
	["alt+shift+r", () => navigate(AnchorsKeys.PROBLEMATIQUES)],
	["alt+shift+t", () => navigate(AnchorsKeys.PISTES_DE_SOLUTION)],
	["alt+shift+y", () => navigate(AnchorsKeys.LIVRABLES)],
	["alt+shift+u", () => navigate(AnchorsKeys.PLAN_D_ACTION)],
];
