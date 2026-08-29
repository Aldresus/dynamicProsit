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

/** Deep enough to cover a bad afternoon, shallow enough to stay free. */
const HISTORY_LIMIT = 20;

interface PrositStore {
	prosit: Prosit;
	setText: (field: TextField, value: string) => void;
	setList: (field: ListField, items: OrderedItem[]) => void;
	reset: () => void;
	undo: () => void;
	canUndo: boolean;
}

const Context = createContext<PrositStore | null>(null);

interface State {
	prosit: Prosit;
	past: Prosit[];
}

export function PrositProvider({ children }: { children: ReactNode }) {
	const [{ prosit, past }, setState] = useState<State>(() => ({
		prosit: load(),
		past: [],
	}));

	/**
	 * `track` decides whether the change is undoable. Typing is not: a history
	 * of twenty keystrokes would be spent before it reached anything anyone
	 * wanted back. Deleting an item, reordering, and resetting are — they are
	 * the changes that lose work in one click.
	 *
	 * ponytail: persisted on every change. The document is a few kB and setItem
	 * is fast; debounce only if a profile says so.
	 */
	const update = useCallback(
		(change: (previous: Prosit) => Prosit, track: boolean) => {
			setState((state) => {
				const next = change(state.prosit);
				save(next);
				return {
					prosit: next,
					past: track
						? [...state.past, state.prosit].slice(-HISTORY_LIMIT)
						: state.past,
				};
			});
		},
		[],
	);

	const store = useMemo<PrositStore>(
		() => ({
			prosit,
			canUndo: past.length > 0,
			setText: (field, value) =>
				update((previous) => ({ ...previous, [field]: value }), false),
			setList: (field, items) =>
				update((previous) => ({ ...previous, [field]: items }), true),
			reset: () => update(emptyProsit, true),
			undo: () =>
				setState((state) => {
					const previous = state.past.at(-1);
					if (!previous) return state;
					save(previous);
					return { prosit: previous, past: state.past.slice(0, -1) };
				}),
		}),
		[prosit, past, update],
	);

	return <Context value={store}>{children}</Context>;
}

export function useProsit(): PrositStore {
	const store = use(Context);
	if (!store) throw new Error("useProsit hors de PrositProvider");
	return store;
}
