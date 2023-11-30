import { HotkeyItem } from "@mantine/hooks";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const globalHotKeys: (router: AppRouterInstance) => HotkeyItem[] = (
	router,
) => [
	["alt+shift+a", () => router.push("/")],
	["alt+shift+z", () => router.push("/mots-clefs")],
	["alt+shift+e", () => router.push("/contraintes")],
	["alt+shift+r", () => router.push("/problematiques")],
	["alt+shift+t", () => router.push("/pistes-de-solution")],
	["alt+shift+y", () => router.push("/livrables")],
	["alt+shift+u", () => router.push("/plan-d-action")],
];
