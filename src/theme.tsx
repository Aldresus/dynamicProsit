import { type ColorScheme, useColorScheme } from "@aldresus/design-system";
import { type ReactNode, createContext, use } from "react";

interface Theme {
	scheme: ColorScheme;
	toggle: () => void;
}

const Context = createContext<Theme | null>(null);

/**
 * `useColorScheme` writes `.dark` on `<html>` and keeps its state per caller, so
 * it has to be called once above every route — including the ones outside the
 * shell (the présentation window, the 404), which would otherwise render light
 * whatever the user chose.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
	const { scheme, toggle } = useColorScheme("dynamicprosit-theme");
	return <Context value={{ scheme, toggle }}>{children}</Context>;
}

export function useTheme(): Theme {
	const theme = use(Context);
	if (!theme) throw new Error("useTheme hors de ThemeProvider");
	return theme;
}
