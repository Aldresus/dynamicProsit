import EditableItem from "@/components/editableItem";
import { Kbd, Text } from "@mantine/core";
import clsx from "clsx";
import React from "react";

interface ListCrudProps extends React.HTMLAttributes<HTMLDivElement> {
	items: string[];
	onEdit: (newValue: string, index: number) => void;
	onDelete: (index: number) => void;
	id: string;
}

export const EditableItemList = React.forwardRef<HTMLDivElement, ListCrudProps>(
	(
		{
			children,
			items,
			onEdit,
			onDelete,
			className,
			id,
			...props
		}: ListCrudProps,
		ref,
	) => {
		return (
			<div
				className={clsx("w-full", className)}
				id={`editable-item-list-wrapper-${id}`}
				{...props}
				ref={ref}
			>
				<div className="flex gap-3 mb-3">
					<Text c="dimmed" size="sm">
						<Kbd>double clic</Kbd> pour éditer la ligne
					</Text>
					<Text c="dimmed" size="sm">
						<Kbd>entrer</Kbd> pour valider
					</Text>
				</div>

				<div className="flex flex-col gap-1" id={`editable-item-list-${id}`}>
					{items.map((value, index) => (
						<EditableItem
							key={value + index}
							value={value}
							onEdit={(value: string) => {
								onEdit(value, index);
							}}
							onDelete={
								() => {
									onDelete(index);
								}
								// onDelete(index)
							}
						/>
					))}
				</div>
			</div>
		);
	},
);

EditableItemList.displayName = "EditableItemList";
export default EditableItemList;
