import { type ColorScheme, useColorScheme } from "@aldresus/design-system";
import { type ReactNode, createContext, use, useEffect } from "react";

const STORAGE_KEY = "dynamicprosit-theme";

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
	const { scheme, setScheme, clear } = useColorScheme(STORAGE_KEY);

	/**
	 * Each window keeps its own copy of the choice and only reads storage on
	 * mount, so switching theme in the form left the présentation window on the
	 * old one — permanently, and on the screen the room is looking at.
	 *
	 * `storage` fires in *other* windows when localStorage changes, which is
	 * exactly this case. (The old build's cross-window bug was misusing this
	 * same event: it hand-dispatched a bare `Event`, which carries no `key`.)
	 */
	useEffect(() => {
		const onStorage = (event: StorageEvent) => {
			if (event.key !== STORAGE_KEY) return;
			const next = event.newValue;
			if (next === null) clear();
			// Guarded: writing back an identical value would bounce the event
			// between two open windows forever.
			else if (next !== scheme && (next === "dark" || next === "light"))
				setScheme(next);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [scheme, setScheme, clear]);

	const toggle = () => setScheme(scheme === "dark" ? "light" : "dark");

	return <Context value={{ scheme, toggle }}>{children}</Context>;
}

export function useTheme(): Theme {
	const theme = use(Context);
	if (!theme) throw new Error("useTheme hors de ThemeProvider");
	return theme;
}
