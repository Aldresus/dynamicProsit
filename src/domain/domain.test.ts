import { beforeEach, describe, expect, it } from "vitest";
import {
	LIST_SECTIONS,
	STEPS,
	findSection,
	nextStep,
	pathOf,
	previousStep,
} from "../sections";
import { addItem, editItem, moveItem, newItem, removeItem } from "./items";
import { PROSIT_VERSION, emptyProsit, isEmpty } from "./prosit";
import { emptyLibrary, load, loadCurrent, parseProsit, save } from "./storage";

// A stand-in for the real thing: enough of the Storage surface for load/save.
function stubStorage() {
	let data: Record<string, string> = {};
	Object.defineProperty(globalThis, "localStorage", {
		configurable: true,
		value: {
			getItem: (k: string) => data[k] ?? null,
			setItem: (k: string, v: string) => {
				data[k] = v;
			},
			clear: () => {
				data = {};
			},
		},
	});
	return {
		write: (raw: string) => {
			data.prosit = raw;
		},
	};
}

describe("storage", () => {
	let store: ReturnType<typeof stubStorage>;
	beforeEach(() => {
		store = stubStorage();
	});

	it("round-trips a document", () => {
		const prosit = { ...emptyProsit(), titre: "Oh non mon fromage" };
		const library = {
			...emptyLibrary(),
			current: prosit.id,
			prosits: [prosit],
		};
		save(library);
		expect(loadCurrent().titre).toBe("Oh non mon fromage");
	});

	it("starts with one empty document when nothing is stored", () => {
		expect(load().prosits).toHaveLength(1);
		expect(isEmpty(loadCurrent())).toBe(true);
	});

	// v3 held a single document at the root. The shape changed; the content is
	// still good, so it becomes a library of one rather than being discarded.
	it("migrates a v3 document into a library of one", () => {
		store.write(
			JSON.stringify({ prositVersion: 3, titre: "l'ancien", motsCles: [] }),
		);
		const library = load();
		expect(library.prosits).toHaveLength(1);
		expect(loadCurrent().titre).toBe("l'ancien");
	});

	// v2 is what the shipped app writes, so this is the migration that matters.
	it("migrates a v2 document without losing anything", () => {
		store.write(
			JSON.stringify({
				prositVersion: 2,
				currentAnchor: "informations",
				touched: true,
				titre: "Le fromage a disparu",
				lien: "https://example.org",
				contexte: "Un vol au réfectoire",
				animateur: "Alice",
				motsCles: [
					{ id: "m1", content: "Fromage" },
					{ id: "m2", content: "Vol" },
				],
				problematiques: [{ id: "p1", content: "Qui a pris le fromage ?" }],
			}),
		);
		const library = load();
		expect(library.prosits).toHaveLength(1);
		const prosit = loadCurrent();
		expect(prosit.id).not.toBe("");
		expect(prosit.titre).toBe("Le fromage a disparu");
		expect(prosit.lien).toBe("https://example.org");
		expect(prosit.contexte).toBe("Un vol au réfectoire");
		expect(prosit.animateur).toBe("Alice");
		expect(prosit.motsCles).toEqual([
			{ id: "m1", content: "Fromage" },
			{ id: "m2", content: "Vol" },
		]);
		expect(prosit.problematiques).toEqual([
			{ id: "p1", content: "Qui a pris le fromage ?" },
		]);
	});

	// v1 held plain strings in its lists. The shipped app rewrote those to v2 on
	// load years ago, so only the text fields are worth carrying over.
	it("keeps a v1 document but drops its string lists", () => {
		store.write(
			JSON.stringify({
				prositVersion: 1,
				titre: "très ancien",
				motsCles: ["fromage"],
			}),
		);
		expect(loadCurrent().titre).toBe("très ancien");
		expect(loadCurrent().motsCles).toEqual([]);
	});

	it("discards a document with no version at all", () => {
		store.write(JSON.stringify({ titre: "sans version" }));
		expect(loadCurrent().titre).toBe("");
	});

	it("survives unparseable JSON", () => {
		store.write("{ not json");
		expect(isEmpty(loadCurrent())).toBe(true);
	});

	it("survives a non-object payload", () => {
		store.write('"a string"');
		expect(isEmpty(loadCurrent())).toBe(true);
	});

	it("survives a library holding no documents", () => {
		store.write(
			JSON.stringify({ version: PROSIT_VERSION, current: "x", prosits: [] }),
		);
		expect(load().prosits).toHaveLength(1);
	});

	// A `current` naming a document that is not there would leave the form with
	// nothing to edit.
	it("falls back to the first document when current points nowhere", () => {
		store.write(
			JSON.stringify({
				version: PROSIT_VERSION,
				current: "disparu",
				prosits: [{ id: "a", titre: "premier" }],
			}),
		);
		expect(load().current).toBe("a");
		expect(loadCurrent().titre).toBe("premier");
	});

	// localStorage is user-writable, so a well-versioned document can still lie.
	it("replaces a field of the wrong type with its empty value", () => {
		const prosit = parseProsit({ titre: 42, contexte: "ok" });
		expect(prosit.titre).toBe("");
		expect(prosit.contexte).toBe("ok");
	});

	it("drops malformed rows from a list but keeps the good ones", () => {
		const prosit = parseProsit({
			motsCles: [
				{ id: "a", content: "fromage" },
				{ id: "b" },
				"pas un objet",
				null,
				{ id: 7, content: "id numérique" },
			],
		});
		expect(prosit.motsCles).toEqual([{ id: "a", content: "fromage" }]);
	});

	it("replaces a list field that is not an array", () => {
		expect(parseProsit({ livrables: "nope" }).livrables).toEqual([]);
	});

	it("gives a document with no id one of its own", () => {
		expect(parseProsit({ titre: "sans id" }).id).not.toBe("");
	});
});

describe("items", () => {
	const items = [
		{ id: "1", content: "Fromage" },
		{ id: "2", content: "Vol" },
		{ id: "3", content: "Enquête" },
	];

	it("capitalises and trims what it adds", () => {
		expect(addItem([], "  fromage ")[0]?.content).toBe("Fromage");
	});

	it("ignores a blank addition", () => {
		expect(addItem(items, "   ")).toBe(items);
	});

	it("gives colliding content distinct ids", () => {
		const twice = addItem(addItem([], "fromage"), "fromage");
		expect(twice[0]?.id).not.toBe(twice[1]?.id);
	});

	// The old editItem shallow-copied the array then assigned into the shared
	// object, so the pre-edit value mutated too and React saw no change.
	it("does not mutate the array it is given", () => {
		const before = structuredClone(items);
		editItem(items, "2", "Cambriolage");
		removeItem(items, "1");
		moveItem(items, "1", "3");
		expect(items).toEqual(before);
	});

	it("edits by id", () => {
		expect(editItem(items, "2", "Cambriolage")[1]?.content).toBe("Cambriolage");
	});

	it("deletes an item edited down to nothing", () => {
		expect(editItem(items, "2", "  ")).toHaveLength(2);
	});

	it("reorders", () => {
		expect(moveItem(items, "1", "3").map((i) => i.id)).toEqual(["2", "3", "1"]);
	});

	it("leaves the list alone when an id is unknown", () => {
		expect(moveItem(items, "1", "nope")).toBe(items);
	});

	it("mints unique ids", () => {
		const ids = new Set(Array.from({ length: 200 }, () => newItem("x").id));
		expect(ids.size).toBe(200);
	});
});

describe("steps", () => {
	it("has no duplicate slugs, fields or shortcuts", () => {
		const unique = (xs: unknown[]) => new Set(xs).size === xs.length;
		expect(unique(LIST_SECTIONS.map((s) => s.slug))).toBe(true);
		expect(unique(LIST_SECTIONS.map((s) => s.field))).toBe(true);
		expect(unique(STEPS.map((s) => s.shortcut))).toBe(true);
	});

	it("walks forwards and wraps", () => {
		expect(nextStep(null).slug).toBe("mots-clefs");
		expect(nextStep("plan-d-action").slug).toBe(null);
	});

	it("walks backwards and wraps", () => {
		expect(previousStep("mots-clefs").slug).toBe(null);
		expect(previousStep(null).slug).toBe("plan-d-action");
	});

	it("maps steps to paths", () => {
		expect(pathOf(STEPS[0])).toBe("/");
		const motsClefs = findSection("mots-clefs");
		expect(motsClefs && pathOf(motsClefs)).toBe("/mots-clefs");
	});

	it("resolves a known slug and rejects an unknown one", () => {
		expect(findSection("livrables")?.field).toBe("livrables");
		expect(findSection("nimportequoi")).toBeUndefined();
	});
});
