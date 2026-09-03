import {
	type ReactNode,
	createContext,
	use,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
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

/**
 * A pause this long in the same field ends the current typing entry. Short
 * enough that a sentence and the paragraph after it undo separately, long
 * enough that one phrase never eats two slots of the twenty.
 */
const TYPING_GROUP_MS = 1000;

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
	redo: () => void;
	canRedo: boolean;
}

const Context = createContext<PrositStore | null>(null);

export interface State {
	library: Library;
	past: Library[];
	future: Library[];
}

export type Action =
	| {
			type: "change";
			change: (previous: Library) => Library;
			/** False continues the entry already on `past` — see `group` below. */
			push: boolean;
			/** Only navigation keeps a redo stack it did not diverge from. */
			keepFuture?: boolean;
	  }
	| { type: "undo" }
	| { type: "redo" };

/**
 * Every change is undoable, including typing — an untracked edit used to make
 * the next Ctrl+Z jump over it and delete it for good. Typing is *grouped*
 * instead: a burst in one field is a single entry (see `group`), so a sentence
 * costs one slot of the twenty rather than twenty.
 *
 * Exported for the test: it is the whole of the undo semantics and the only
 * part worth checking.
 */
export function historyReducer(state: State, action: Action): State {
	switch (action.type) {
		case "change":
			return {
				library: action.change(state.library),
				past: action.push
					? [...state.past, state.library].slice(-HISTORY_LIMIT)
					: state.past,
				future: action.keepFuture ? state.future : [],
			};
		case "undo": {
			const previous = state.past.at(-1);
			if (!previous) return state;
			return {
				library: previous,
				past: state.past.slice(0, -1),
				future: [state.library, ...state.future].slice(0, HISTORY_LIMIT),
			};
		}
		case "redo": {
			const [next, ...rest] = state.future;
			if (!next) return state;
			return {
				library: next,
				past: [...state.past, state.library].slice(-HISTORY_LIMIT),
				future: rest,
			};
		}
	}
}

/**
 * Whether a change opens a new undo entry. A string `track` is a group key:
 * consecutive changes under the same key, less than `TYPING_GROUP_MS` apart,
 * extend the entry already recorded instead of each taking a slot.
 */
export function opensEntry(
	previous: { key: string; at: number } | null,
	track: boolean | string,
	now: number,
): boolean {
	if (typeof track !== "string") return track;
	return (
		!previous || previous.key !== track || now - previous.at > TYPING_GROUP_MS
	);
}

const currentOf = (library: Library): Prosit =>
	library.prosits.find((p) => p.id === library.current) ?? emptyProsit();

export function PrositProvider({ children }: { children: ReactNode }) {
	const [{ library, past, future }, dispatch] = useReducer(
		historyReducer,
		undefined,
		() => ({ library: load(), past: [], future: [] }),
	);

	// ponytail: persisted on every change. The library is a few kB and setItem
	// is fast; debounce only if a profile says so. An effect rather than a call
	// inside the reducer, which must stay pure and runs twice in StrictMode.
	useEffect(() => save(library), [library]);

	/**
	 * The last grouped edit, so a burst on one field extends its entry instead of
	 * opening another. A ref, not state: it steers the next dispatch and must
	 * never cause a render.
	 */
	const group = useRef<{ key: string; at: number } | null>(null);

	/**
	 * `track` is `false` for changes that lose nothing (picking another
	 * document), `true` for a discrete action, or a string key grouping
	 * consecutive edits of the same thing into one undo step.
	 */
	const update = useCallback(
		(change: (previous: Library) => Library, track: boolean | string) => {
			const previous = group.current;
			const now = Date.now();
			group.current =
				typeof track === "string" ? { key: track, at: now } : null;
			dispatch({
				type: "change",
				change,
				push: opensEntry(previous, track, now),
				keepFuture: track === false,
			});
		},
		[],
	);

	/** The same, narrowed to the document being edited. */
	const editCurrent = useCallback(
		(change: (previous: Prosit) => Prosit, track: boolean | string) =>
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
			canRedo: future.length > 0,
			// Grouped per field *and* per document, so switching either one starts a
			// new entry rather than letting the burst swallow the change.
			setText: (field, value) =>
				editCurrent(
					(previous) => ({ ...previous, [field]: value }),
					`${prosit.id}:${field}`,
				),
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
			// Both end the open typing entry: what you type next is its own step.
			undo: () => {
				group.current = null;
				dispatch({ type: "undo" });
			},
			redo: () => {
				group.current = null;
				dispatch({ type: "redo" });
			},
		}),
		[prosit, library.prosits, past, future, update, editCurrent],
	);

	return <Context value={store}>{children}</Context>;
}

export function useProsit(): PrositStore {
	const store = use(Context);
	if (!store) throw new Error("useProsit hors de PrositProvider");
	return store;
}
