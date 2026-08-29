import {
	type ReactNode,
	createContext,
	use,
	useCallback,
	useMemo,
	useState,
} from "react";
import type {
	ListField,
	OrderedItem,
	Prosit,
	TextField,
} from "./domain/prosit";
import { emptyProsit } from "./domain/prosit";
import { load, save } from "./domain/storage";

interface PrositStore {
	prosit: Prosit;
	setText: (field: TextField, value: string) => void;
	setList: (field: ListField, items: OrderedItem[]) => void;
	reset: () => void;
}

const Context = createContext<PrositStore | null>(null);

export function PrositProvider({ children }: { children: ReactNode }) {
	const [prosit, setProsit] = useState(load);

	// ponytail: persisted on every keystroke. The document is a few KB and
	// setItem is synchronous-but-fast; debounce only if a profile says so.
	const update = useCallback((change: (previous: Prosit) => Prosit) => {
		setProsit((previous) => {
			const next = change(previous);
			save(next);
			return next;
		});
	}, []);

	const store = useMemo<PrositStore>(
		() => ({
			prosit,
			setText: (field, value) =>
				update((previous) => ({ ...previous, [field]: value })),
			setList: (field, items) =>
				update((previous) => ({ ...previous, [field]: items })),
			reset: () => update(emptyProsit),
		}),
		[prosit, update],
	);

	return <Context value={store}>{children}</Context>;
}

export function useProsit(): PrositStore {
	const store = use(Context);
	if (!store) throw new Error("useProsit hors de PrositProvider");
	return store;
}
