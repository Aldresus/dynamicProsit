import {
	LIST_FIELDS,
	type OrderedItem,
	PROSIT_VERSION,
	type Prosit,
	TEXT_FIELDS,
	emptyProsit,
} from "./prosit";

const KEY = "prosit";

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

const isItem = (v: unknown): v is OrderedItem =>
	isRecord(v) && typeof v.id === "string" && typeof v.content === "string";

/**
 * localStorage is user-writable, so a stored document is untrusted input: every
 * field is checked and anything unusable falls back to the empty value rather
 * than reaching the UI as the wrong type.
 */
function parse(raw: string): Prosit {
	const stored: unknown = JSON.parse(raw);
	if (!isRecord(stored)) return emptyProsit();

	// v1 and v2 documents are discarded silently — no migration path is kept.
	if (stored.prositVersion !== PROSIT_VERSION) return emptyProsit();

	const prosit = emptyProsit();
	for (const field of TEXT_FIELDS) {
		const value = stored[field];
		if (typeof value === "string") prosit[field] = value;
	}
	for (const field of LIST_FIELDS) {
		const value = stored[field];
		if (Array.isArray(value)) prosit[field] = value.filter(isItem);
	}
	return prosit;
}

export function load(): Prosit {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? parse(raw) : emptyProsit();
	} catch {
		// Unparseable JSON, or storage blocked entirely (private mode, disabled cookies).
		return emptyProsit();
	}
}

export function save(prosit: Prosit): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(prosit));
	} catch {
		// ponytail: a failed write costs the user persistence, not their session —
		// nothing useful to do here beyond not crashing. Revisit if quota bites.
	}
}
