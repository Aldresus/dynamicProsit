import React from "react";
import clsx from "clsx";
import EditableItem from "@/components/editableItem";
import { Kbd, Text } from "@mantine/core";

interface ListCrudProps extends React.HTMLAttributes<HTMLDivElement> {
	items: string[];
	onEdit: (newValue: string, index: number) => void;
	onDelete: (index: number) => void;
}

export const EditableItemList = React.forwardRef<HTMLDivElement, ListCrudProps>(
	(
		{ children, items, onEdit, onDelete, className, ...props }: ListCrudProps,
		ref,
	) => {
		return (
			<div className={clsx("w-full", className)} {...props} ref={ref}>
				<div className="flex gap-3 mb-3">
					<Text c="dimmed" size="sm">
						<Kbd>double clic</Kbd> pour éditer la ligne
					</Text>
					<Text c="dimmed" size="sm">
						<Kbd>entrer</Kbd> pour valider
					</Text>
				</div>

				<div className="flex flex-col gap-1">
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
