import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HotkeyItem } from "@mantine/hooks";

export const globalHotKeys: (router: AppRouterInstance) => HotkeyItem[] = (
  router,
) => [
  ["alt+shift+a", () => router.push("/")],
  ["alt+shift+z", () => router.push("/mots-clefs")],
  ["alt+shift+e", () => router.push("/problematiques")],
  ["alt+shift+r", () => router.push("/pistes-de-solution")],
  ["alt+shift+t", () => router.push("/livrables")],
  ["alt+shift+y", () => router.push("/plan-d-action")],
];
