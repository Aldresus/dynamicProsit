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
import { type Library, load, save } from "./domain/storage";

/** Deep enough to cover a bad afternoon, shallow enough to stay free. */
const HISTORY_LIMIT = 20;

interface PrositStore {
	/** The document the form is editing. */
	prosit: Prosit;
	/** Every document, in creation order — what the switcher lists. */
	prosits: Prosit[];
	setText: (field: TextField, value: string) => void;
	setList: (field: ListField, items: OrderedItem[]) => void;
	reset: () => void;
	select: (id: string) => void;
	/** Adds a document and switches to it. Returns nothing; the switch is the point. */
	add: (prosit: Prosit) => void;
	create: () => void;
	remove: (id: string) => void;
	undo: () => void;
	canUndo: boolean;
}

const Context = createContext<PrositStore | null>(null);

interface State {
	library: Library;
	past: Library[];
}

const currentOf = (library: Library): Prosit =>
	library.prosits.find((p) => p.id === library.current) ?? emptyProsit();

export function PrositProvider({ children }: { children: ReactNode }) {
	const [{ library, past }, setState] = useState<State>(() => ({
		library: load(),
		past: [],
	}));

	/**
	 * `track` decides whether the change is undoable. Typing is not: a history
	 * of twenty keystrokes would be spent before it reached anything anyone
	 * wanted back. Deleting an item, reordering, resetting and deleting a whole
	 * prosit are — they are the changes that lose work in one click.
	 *
	 * ponytail: persisted on every change. The library is a few kB and setItem
	 * is fast; debounce only if a profile says so.
	 */
	const update = useCallback(
		(change: (previous: Library) => Library, track: boolean) => {
			setState((state) => {
				const next = change(state.library);
				save(next);
				return {
					library: next,
					past: track
						? [...state.past, state.library].slice(-HISTORY_LIMIT)
						: state.past,
				};
			});
		},
		[],
	);

	/** The same, narrowed to the document being edited. */
	const editCurrent = useCallback(
		(change: (previous: Prosit) => Prosit, track: boolean) =>
			update(
				(previous) => ({
					...previous,
					prosits: previous.prosits.map((p) =>
						p.id === previous.current ? change(p) : p,
					),
				}),
				track,
			),
		[update],
	);

	const prosit = currentOf(library);

	const store = useMemo<PrositStore>(
		() => ({
			prosit,
			prosits: library.prosits,
			canUndo: past.length > 0,
			setText: (field, value) =>
				editCurrent((previous) => ({ ...previous, [field]: value }), false),
			setList: (field, items) =>
				editCurrent((previous) => ({ ...previous, [field]: items }), true),
			// Keeping the id means `current` still points somewhere and the
			// switcher does not jump to another document under the user.
			reset: () =>
				editCurrent(
					(previous) => ({ ...emptyProsit(), id: previous.id }),
					true,
				),
			select: (id) =>
				update((previous) => ({ ...previous, current: id }), false),
			add: (added) =>
				update(
					(previous) => ({
						...previous,
						current: added.id,
						prosits: [...previous.prosits, added],
					}),
					true,
				),
			create: () =>
				update((previous) => {
					const created = emptyProsit();
					return {
						...previous,
						current: created.id,
						prosits: [...previous.prosits, created],
					};
				}, true),
			remove: (id) =>
				update((previous) => {
					const kept = previous.prosits.filter((p) => p.id !== id);
					// A library with nothing in it has no document to edit, so the
					// last deletion is a reset instead.
					if (kept.length === 0) {
						const fresh = emptyProsit();
						return { ...previous, current: fresh.id, prosits: [fresh] };
					}
					return {
						...previous,
						// biome-ignore lint/style/noNonNullAssertion: length checked above.
						current: previous.current === id ? kept[0]!.id : previous.current,
						prosits: kept,
					};
				}, true),
			undo: () =>
				setState((state) => {
					const previous = state.past.at(-1);
					if (!previous) return state;
					save(previous);
					return { library: previous, past: state.past.slice(0, -1) };
				}),
		}),
		[prosit, library.prosits, past, update, editCurrent],
	);

	return <Context value={store}>{children}</Context>;
}

export function useProsit(): PrositStore {
	const store = use(Context);
	if (!store) throw new Error("useProsit hors de PrositProvider");
	return store;
}
