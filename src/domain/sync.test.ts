import { afterEach, describe, expect, it } from "vitest";
import { emptyProsit } from "./prosit";
import { onState, onStateRequest, publishState, requestState } from "./sync";

const stops: (() => void)[] = [];
const track = (stop: () => void) => {
	stops.push(stop);
	return stop;
};
afterEach(() => {
	for (const stop of stops.splice(0)) stop();
});

/** BroadcastChannel delivers on a later tick. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

describe("sync", () => {
	it("carries the document and the current step", async () => {
		const seen: unknown[] = [];
		track(onState((state) => seen.push(state)));

		const prosit = { ...emptyProsit(), titre: "Oh non mon fromage" };
		publishState({ prosit, section: "contraintes" });
		await settle();

		expect(seen).toEqual([{ prosit, section: "contraintes" }]);
	});

	// A window opened mid-prosit knows the document but not the step.
	it("lets a listener ask for the current state", async () => {
		let asked = 0;
		track(onStateRequest(() => asked++));

		requestState();
		await settle();

		expect(asked).toBe(1);
	});

	it("keeps the two message types apart", async () => {
		let states = 0;
		let requests = 0;
		track(onState(() => states++));
		track(onStateRequest(() => requests++));

		publishState({ prosit: emptyProsit(), section: null });
		requestState();
		await settle();

		expect({ states, requests }).toEqual({ states: 1, requests: 1 });
	});
});
