import { AnchorsKeys } from "@/types/anchors";
import { HotkeyItem } from "@mantine/hooks";

export const globalHotKeys: (
	navigate: (anchor: AnchorsKeys) => void,
) => HotkeyItem[] = (navigate: (anchor: AnchorsKeys) => void) => [
	["alt+shift+a", () => navigate(AnchorsKeys.INFORMATIONS)],
	["alt+shift+z", () => navigate(AnchorsKeys.MOTSCLEFS)],
	["alt+shift+e", () => navigate(AnchorsKeys.CONTRAINTES)],
	["alt+shift+r", () => navigate(AnchorsKeys.PROBLEMATIQUES)],
	["alt+shift+t", () => navigate(AnchorsKeys.PISTESDESOLUTION)],
	["alt+shift+y", () => navigate(AnchorsKeys.LIVRABLES)],
	["alt+shift+u", () => navigate(AnchorsKeys.PLANDACTION)],
];
