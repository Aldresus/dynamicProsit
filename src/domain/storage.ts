import {
	LIST_FIELDS,
	type OrderedItem,
	PROSIT_VERSION,
	type Prosit,
	TEXT_FIELDS,
	emptyProsit,
} from "./prosit";

const KEY = "prosit";

/** Every prosit the user has, and which one the form is editing. */
export interface Library {
	version: number;
	/** The id of the prosit being edited. Always present in `prosits`. */
	current: string;
	prosits: Prosit[];
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

const isItem = (v: unknown): v is OrderedItem =>
	isRecord(v) && typeof v.id === "string" && typeof v.content === "string";

/**
 * Stored documents are untrusted input — localStorage is user-writable and a
 * .docx can come from anywhere — so every field is checked and anything
 * unusable falls back to its empty value rather than reaching the UI as the
 * wrong type. Exported because the .docx import needs the very same check.
 */
export function parseProsit(value: unknown): Prosit {
	const prosit = emptyProsit();
	if (!isRecord(value)) return prosit;

	if (typeof value.id === "string" && value.id !== "") prosit.id = value.id;
	for (const field of TEXT_FIELDS) {
		const text = value[field];
		if (typeof text === "string") prosit[field] = text;
	}
	for (const field of LIST_FIELDS) {
		const list = value[field];
		if (Array.isArray(list)) prosit[field] = list.filter(isItem);
	}
	return prosit;
}

export const emptyLibrary = (): Library => {
	const prosit = emptyProsit();
	return { version: PROSIT_VERSION, current: prosit.id, prosits: [prosit] };
};

function parse(raw: string): Library {
	const stored: unknown = JSON.parse(raw);
	if (!isRecord(stored)) return emptyLibrary();

	// v1 and v2 are discarded silently. v3 held a single document at the root,
	// so it becomes a library of one rather than being thrown away — the shape
	// changed, the content is still perfectly good.
	if (stored.prositVersion === 3) {
		const only = parseProsit(stored);
		return { version: PROSIT_VERSION, current: only.id, prosits: [only] };
	}
	if (stored.version !== PROSIT_VERSION || !Array.isArray(stored.prosits))
		return emptyLibrary();

	const prosits = stored.prosits.map(parseProsit);
	if (prosits.length === 0) return emptyLibrary();

	// A `current` naming a prosit that is not there would leave the form with
	// nothing to edit.
	const current = prosits.some((p) => p.id === stored.current)
		? (stored.current as string)
		: // biome-ignore lint/style/noNonNullAssertion: length checked above.
			prosits[0]!.id;
	return { version: PROSIT_VERSION, current, prosits };
}

export function load(): Library {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? parse(raw) : emptyLibrary();
	} catch {
		// Unparseable JSON, or storage blocked entirely (private mode, disabled cookies).
		return emptyLibrary();
	}
}

export function save(library: Library): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(library));
	} catch {
		// ponytail: a failed write costs the user persistence, not their session —
		// nothing useful to do here beyond not crashing. Revisit if quota bites.
	}
}

/** The présentation window has no store; it only ever wants the current document. */
export function loadCurrent(): Prosit {
	const library = load();
	return library.prosits.find((p) => p.id === library.current) ?? emptyProsit();
}
