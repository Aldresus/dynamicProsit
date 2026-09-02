import { Button, Textarea, cn } from "@aldresus/design-system";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { OrderedItem } from "../domain/prosit";

interface SortableItemProps {
	item: OrderedItem;
	onEdit: (content: string) => void;
	onDelete: () => void;
}

export function SortableItem({ item, onEdit, onDelete }: SortableItemProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(item.content);
	/*
	 * Enter and Escape unmount the textarea, and focus falls to <body> — the next
	 * Tab restarts at the top of the page. Only the keyboard exits restore it:
	 * blur closes the editor too, and there the user has already chosen where
	 * focus should go.
	 */
	const trigger = useRef<HTMLButtonElement>(null);
	const restore = useRef(false);
	useEffect(() => {
		if (!editing && restore.current) trigger.current?.focus();
		restore.current = false;
	}, [editing]);
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id });

	const commit = () => {
		setEditing(false);
		if (draft !== item.content) onEdit(draft);
	};

	const cancel = () => {
		setEditing(false);
		setDraft(item.content);
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault();
			restore.current = true;
			commit();
		}
		if (event.key === "Escape") {
			event.preventDefault();
			restore.current = true;
			cancel();
		}
	};

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"rounded-control",
				isDragging && "relative z-10 bg-surface-raised shadow-panel",
			)}
		>
			{/*
				The row is a div, not the <li>: `display: flex` on a list item drops
				`display: list-item` with it, and the marker the browser would have
				drawn goes with it. That is what the hand-rolled step number used to
				stand in for.

				`inline-flex` + `items-baseline` so the row has a baseline to give the
				li's first line box: a plain block wrapper leaves the marker nothing to
				align to and the number sinks to the bottom of a row that wraps. An
				icon-only button baselines on its bottom edge, though, so the two
				controls leave the baseline group and pad onto the first line instead.
			*/}
			<div className="inline-flex w-full items-baseline gap-2 rounded-control px-1 py-0.5">
				<button
					type="button"
					className="self-start cursor-grab px-1 py-2 text-fg-subtle hover:text-fg active:cursor-grabbing"
					aria-label={`Déplacer « ${item.content} »`}
					{...attributes}
					{...listeners}
				>
					<GripVertical className="size-5" />
				</button>

				{editing ? (
					<Textarea
						autosize
						rows={1}
						value={draft}
						onChange={(event) => setDraft(event.currentTarget.value)}
						onBlur={commit}
						onKeyDown={onKeyDown}
						autoFocus
						className="flex-1"
						aria-label={`Modifier « ${item.content} »`}
					/>
				) : (
					/*
					 * The old build opened the editor from `onDoubleClick` on a div, which
					 * no keyboard could ever reach. A real button gets Enter and Space for
					 * free, and a single click is one fewer than a double.
					 */
					<button
						ref={trigger}
						type="button"
						// Le brouillon est semé à l'ouverture, pas au montage : entre les
						// deux, le texte a pu changer sous nos pieds (une annulation), et
						// un brouillon périmé réécrirait la version restaurée à la sortie.
						onClick={() => {
							setDraft(item.content);
							setEditing(true);
						}}
						// The text is its own label on screen; a reader needs the verb too.
						aria-label={`Modifier « ${item.content} »`}
						className="hcds-body flex-1 cursor-text whitespace-pre-wrap rounded-control px-2 py-1.5 text-left hover:bg-surface-sunken"
					>
						{item.content}
					</button>
				)}

				<Button
					variant="ghost"
					size="sm"
					onClick={onDelete}
					aria-label={`Supprimer « ${item.content} »`}
					// ponytail: le survol est la teinte du ghost, pas un rouge. Repasser
					// au rouge le jour où le design system aura un ghost destructeur.
					className="mt-0.5 self-start text-fg-subtle"
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		</li>
	);
}
