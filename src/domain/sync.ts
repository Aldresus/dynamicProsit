import type { Prosit } from "./prosit";

const CHANNEL = "prosit";

/** What the présentation window needs: the document, and where the form is. */
export interface PrositBroadcast {
	prosit: Prosit;
	/** Section slug, or `null` on the Informations page. */
	section: string | null;
}

/**
 * The old build wrote to localStorage and hand-dispatched `new Event("storage")`
 * to wake the présentation window. That never worked: the listener tested
 * `event.key === "prosit"` and a bare Event has no `key`, so only the browser's
 * genuine cross-window StorageEvent ever got through. BroadcastChannel is the
 * API for this, and it reaches every window including the one that posted.
 */
const open = (): BroadcastChannel | null =>
	typeof BroadcastChannel === "undefined"
		? null
		: new BroadcastChannel(CHANNEL);

export function publish(message: PrositBroadcast): void {
	const channel = open();
	if (!channel) return;
	channel.postMessage(message);
	channel.close();
}

export function subscribe(
	onMessage: (message: PrositBroadcast) => void,
): () => void {
	const channel = open();
	if (!channel) return () => {};
	channel.onmessage = (event: MessageEvent<PrositBroadcast>) =>
		onMessage(event.data);
	return () => channel.close();
}
