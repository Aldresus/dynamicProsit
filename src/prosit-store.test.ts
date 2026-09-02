import { describe, expect, it } from "vitest";
import type { Library } from "./domain/storage";
import { type State, historyReducer, opensEntry } from "./prosit-store";

const library = (current: string): Library => ({
	version: 1,
	current,
	prosits: [],
});

const start = (name: string): State => ({
	library: library(name),
	past: [],
	future: [],
});

/** Applies one change, as the provider does: replace the library wholesale. */
const change = (
	state: State,
	name: string,
	push: boolean,
	keepFuture = false,
) =>
	historyReducer(state, {
		type: "change",
		change: () => library(name),
		push,
		keepFuture,
	});

describe("opensEntry", () => {
	it("gives every discrete action its own entry", () => {
		expect(opensEntry(null, true, 0)).toBe(true);
		expect(opensEntry({ key: "a", at: 0 }, true, 1)).toBe(true);
		expect(opensEntry({ key: "a", at: 0 }, false, 1)).toBe(false);
	});

	it("groups a burst on one field and splits on a pause or another field", () => {
		expect(opensEntry(null, "p:context", 0)).toBe(true);
		expect(opensEntry({ key: "p:context", at: 0 }, "p:context", 500)).toBe(
			false,
		);
		expect(opensEntry({ key: "p:context", at: 0 }, "p:context", 5000)).toBe(
			true,
		);
		expect(opensEntry({ key: "p:context", at: 0 }, "p:cles", 10)).toBe(true);
	});
});

describe("historyReducer", () => {
	it("never loses typing done after a tracked action — the old Ctrl+Z bug", () => {
		// remove (tracked) then a burst of typing: one entry, then continuations.
		let state = change(start("base"), "removed", true);
		state = change(state, "typed", true);
		state = change(state, "typed more", false);

		state = historyReducer(state, { type: "undo" });
		// One undo goes back to the start of the burst, not over it.
		expect(state.library.current).toBe("removed");
		state = historyReducer(state, { type: "undo" });
		expect(state.library.current).toBe("base");
	});

	it("redoes what it undid, in order", () => {
		let state = change(change(start("a"), "b", true), "c", true);
		state = historyReducer(state, { type: "undo" });
		state = historyReducer(state, { type: "undo" });
		expect(state.library.current).toBe("a");
		state = historyReducer(state, { type: "redo" });
		expect(state.library.current).toBe("b");
		state = historyReducer(state, { type: "redo" });
		expect(state.library.current).toBe("c");
		expect(state.future).toEqual([]);
	});

	it("does nothing at either end of the stack", () => {
		const empty = start("a");
		expect(historyReducer(empty, { type: "undo" })).toBe(empty);
		expect(historyReducer(empty, { type: "redo" })).toBe(empty);
	});

	it("drops the redo stack on a new change, keeps it on navigation", () => {
		const undone = historyReducer(change(start("a"), "b", true), {
			type: "undo",
		});
		expect(undone.future).toHaveLength(1);
		expect(change(undone, "select", false, true).future).toHaveLength(1);
		expect(change(undone, "c", true).future).toEqual([]);
		// A grouped continuation is still a change: it diverges too.
		expect(change(undone, "typing", false).future).toEqual([]);
	});
});
