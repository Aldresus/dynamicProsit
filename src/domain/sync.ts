import type { Prosit } from "./prosit";

const CHANNEL = "prosit";

/** What the présentation window needs: the document, and where the form is. */
export interface PrositState {
	prosit: Prosit;
	/** Section slug, or `null` on the Informations page. */
	section: string | null;
}

type Message =
	| { type: "state"; state: PrositState }
	/** Sent by a présentation window on mount: "someone tell me where we are". */
	| { type: "request" };

/**
 * The old build wrote to localStorage and hand-dispatched `new Event("storage")`
 * to wake the présentation window. That never worked: the listener tested
 * `event.key === "prosit"` and a bare Event has no `key`, so only the browser's
 * genuine cross-window StorageEvent got through. BroadcastChannel is the API for
 * this, and it reaches every window including the one that posted.
 */
const open = (): BroadcastChannel | null =>
	typeof BroadcastChannel === "undefined"
		? null
		: new BroadcastChannel(CHANNEL);

function post(message: Message): void {
	const channel = open();
	if (!channel) return;
	channel.postMessage(message);
	channel.close();
}

function listen(handler: (message: Message) => void): () => void {
	const channel = open();
	if (!channel) return () => {};
	channel.onmessage = (event: MessageEvent<Message>) => handler(event.data);
	return () => channel.close();
}

export const publishState = (state: PrositState): void =>
	post({ type: "state", state });

/**
 * A window opened mid-prosit has the document from localStorage but no idea
 * which step the form is on, so it asks rather than highlighting Informations
 * until the next keystroke happens to tell it.
 */
export const requestState = (): void => post({ type: "request" });

export const onStateRequest = (handler: () => void): (() => void) =>
	listen((message) => {
		if (message.type === "request") handler();
	});

export const onState = (handler: (state: PrositState) => void): (() => void) =>
	listen((message) => {
		if (message.type === "state") handler(message.state);
	});
