import type { OrderedItem } from "./prosit";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Ids are random rather than derived from the content, which is what the old
 * `idHandler` did: it stripped `_` from its own `${content}_2` collision suffix,
 * so a third duplicate regenerated an id that already existed.
 */
export const newItem = (content: string): OrderedItem => ({
	id: crypto.randomUUID(),
	content: capitalize(content.trim()),
});

export const addItem = (
	items: OrderedItem[],
	content: string,
): OrderedItem[] => (content.trim() ? [...items, newItem(content)] : items);

/** Clearing an item's text deletes it — the row has no other affordance for that. */
export const editItem = (
	items: OrderedItem[],
	id: string,
	content: string,
): OrderedItem[] =>
	content.trim()
		? items.map((item) => (item.id === id ? { ...item, content } : item))
		: items.filter((item) => item.id !== id);

export const removeItem = (items: OrderedItem[], id: string): OrderedItem[] =>
	items.filter((item) => item.id !== id);

export function moveItem(
	items: OrderedItem[],
	activeId: string,
	overId: string,
): OrderedItem[] {
	const from = items.findIndex((item) => item.id === activeId);
	const to = items.findIndex((item) => item.id === overId);
	if (from === -1 || to === -1 || from === to) return items;

	const next = [...items];
	const [moved] = next.splice(from, 1);
	if (moved) next.splice(to, 0, moved);
	return next;
}
