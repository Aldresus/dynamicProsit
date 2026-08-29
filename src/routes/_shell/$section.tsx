import { Button, Field, Kbd, Textarea } from "@aldresus/design-system";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { type KeyboardEvent, useState } from "react";
import { SortableItem } from "../../components/sortable-item";
import { addItem, editItem, moveItem, removeItem } from "../../domain/items";
import { useProsit } from "../../prosit-store";
import { findSection } from "../../sections";
import { metaTags, pageFor } from "../../seo";
import { useStepKeyDown } from "../../shortcuts";

export const Route = createFileRoute("/_shell/$section")({
	// An unknown slug is a 404, not an empty page pretending to be a step.
	loader: ({ params }) => {
		if (!findSection(params.section)) throw notFound();
	},
	head: ({ params }) => ({ meta: metaTags(pageFor(`/${params.section}`)) }),
	component: Section,
});

/**
 * One route for all six list steps. The old build had six page files of ~145
 * lines that differed only in the field they wrote to and the words on screen.
 */
function Section() {
	const { section: slug } = Route.useParams();
	const section = findSection(slug);
	const { prosit, setList } = useProsit();
	const [draft, setDraft] = useState("");
	const stepKeyDown = useStepKeyDown();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// The loader has already 404'd an unknown slug.
	if (!section) return null;

	const items = prosit[section.field];

	const add = () => {
		setList(section.field, addItem(items, draft));
		setDraft("");
	};

	/**
	 * dnd-kit announces "Picked up draggable item <id>" by default — English, in
	 * a French app, and reading out a UUID since ids stopped being derived from
	 * the content. Anyone on a screen reader got a string of hex.
	 */
	const labelOf = (id: string | number) =>
		items.find((item) => item.id === String(id))?.content ?? "cet élément";
	const positionOf = (id: string | number) =>
		items.findIndex((item) => item.id === String(id)) + 1;

	const accessibility = {
		screenReaderInstructions: {
			draggable:
				"Appuyez sur la barre d'espace pour saisir l'élément, les flèches pour le déplacer, la barre d'espace pour le déposer, Échap pour annuler.",
		},
		announcements: {
			onDragStart: ({ active }: { active: { id: string | number } }) =>
				`${labelOf(active.id)} saisi, position ${positionOf(active.id)} sur ${items.length}.`,
			onDragOver: ({ over }: { over: { id: string | number } | null }) =>
				over
					? `Déplacé en position ${positionOf(over.id)} sur ${items.length}.`
					: undefined,
			onDragEnd: ({ over }: { over: { id: string | number } | null }) =>
				over
					? `Déposé en position ${positionOf(over.id)} sur ${items.length}.`
					: "Déposé.",
			onDragCancel: ({ active }: { active: { id: string | number } }) =>
				`Déplacement de ${labelOf(active.id)} annulé.`,
		},
	};

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (over)
			setList(section.field, moveItem(items, `${active.id}`, `${over.id}`));
	};

	const onKeyDown = (event: KeyboardEvent) => {
		stepKeyDown(event);
		if (event.defaultPrevented) return;
		// Enter submits rather than inserting a newline — an item is one line.
		if (event.key === "Enter") {
			event.preventDefault();
			add();
		}
	};

	return (
		<div className="flex flex-col gap-6 py-4">
			<form
				onSubmit={(event) => {
					event.preventDefault();
					add();
				}}
				className="sticky top-0 z-10 flex flex-col gap-3 bg-surface pt-2 pb-4"
			>
				<Field label={<span className="hcds-heading">{section.label}</span>}>
					<Textarea
						autosize
						rows={1}
						maxRows={6}
						value={draft}
						placeholder={section.placeholder}
						onChange={(event) => setDraft(event.currentTarget.value)}
						onKeyDown={onKeyDown}
						autoFocus
					/>
				</Field>
				<div className="flex items-center justify-between gap-4">
					<p className="hcds-caption text-fg-muted">
						<Kbd keys="Enter" /> pour ajouter · cliquez une ligne pour la
						modifier
					</p>
					<Button type="submit" disabled={!draft.trim()}>
						{section.addLabel}
					</Button>
				</div>
			</form>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={onDragEnd}
				accessibility={accessibility}
			>
				<SortableContext
					items={items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="flex flex-col gap-1">
						{items.map((item, index) => (
							<SortableItem
								key={item.id}
								item={item}
								index={section.ordered ? index : undefined}
								onEdit={(content) =>
									setList(section.field, editItem(items, item.id, content))
								}
								onDelete={() =>
									setList(section.field, removeItem(items, item.id))
								}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
}
