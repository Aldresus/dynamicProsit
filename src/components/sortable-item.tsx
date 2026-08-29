import { Button, Textarea, cn } from "@aldresus/design-system";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import type { OrderedItem } from "../domain/prosit";

interface SortableItemProps {
	item: OrderedItem;
	/** Given only for an ordered list; renders the step number. */
	index?: number;
	onEdit: (content: string) => void;
	onDelete: () => void;
}

export function SortableItem({
	item,
	index,
	onEdit,
	onDelete,
}: SortableItemProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(item.content);
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
			commit();
		}
		if (event.key === "Escape") {
			event.preventDefault();
			cancel();
		}
	};

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"group flex items-start gap-2 rounded-control px-1 py-0.5",
				isDragging && "relative z-10 bg-surface-raised shadow-panel",
			)}
		>
			<button
				type="button"
				className="cursor-grab p-1 text-fg-subtle hover:text-fg active:cursor-grabbing"
				aria-label={`Déplacer « ${item.content} »`}
				{...attributes}
				{...listeners}
			>
				<GripVertical className="size-5" />
			</button>

			{index !== undefined && (
				<span className="hcds-body w-6 shrink-0 pt-1.5 text-right font-semibold tabular-nums">
					{index + 1}.
				</span>
			)}

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
					aria-label="Modifier la ligne"
				/>
			) : (
				/*
				 * The old build opened the editor from `onDoubleClick` on a div, which
				 * no keyboard could ever reach. A real button gets Enter and Space for
				 * free, and a single click is one fewer than a double.
				 */
				<button
					type="button"
					onClick={() => setEditing(true)}
					className="hcds-body flex-1 whitespace-pre-wrap rounded-control px-2 py-1.5 text-left hover:bg-surface-sunken"
				>
					{item.content}
				</button>
			)}

			<Button
				variant="ghost"
				size="sm"
				onClick={onDelete}
				aria-label={`Supprimer « ${item.content} »`}
				className="text-fg-subtle hover:text-danger"
			>
				<Trash2 className="size-4" />
			</Button>
		</li>
	);
}
