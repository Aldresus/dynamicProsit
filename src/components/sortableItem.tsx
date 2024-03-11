"use client";

import classes from "@/app/Demo.module.css";
import { OrderedItem } from "@/types/orderedItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Group, Text, Textarea, Title } from "@mantine/core";
import clsx from "clsx";
import { GripVertical, Minus, Trash } from "lucide-react";
import React from "react";

interface SortableItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: OrderedItem;
	index?: number;
	editItem: (newValue: string) => void;
	deleteItem: (id: string) => void;
	undraggable?: boolean;
}

export default function SortableItem({
	deleteItem,
	editItem,
	value,
	index,
	undraggable = false,
	...props
}: SortableItemProps) {
	const [editMode, setEditMode] = React.useState(false);
	const [editValue, setEditValue] = React.useState(value.content);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: value.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Box
			className={clsx(
				"group flex items-center justify-between w-full rounded",
				{
					[classes.bgInput]: editMode,
				},
			)}
			ref={setNodeRef}
			style={style}
			onDoubleClick={() => {
				setEditMode(true);
				editItem(editValue);
			}}
		>
			<div className="flex gap-1 flex-1 items-center">
				<Group gap={1}>
					<Text c="blue" className="flex items-center ">
						{undraggable ? (
							<Minus size={24} />
						) : (
							<GripVertical
								className="cursor-move"
								size={24}
								{...attributes}
								{...listeners}
							/>
						)}
					</Text>
					{index !== undefined && (
						<Title order={3} pr="sm">
							{index + 1}.
						</Title>
					)}
				</Group>
				<form
					className="flex-1"
					onSubmit={(event) => {
						event.preventDefault();
						setEditMode(false);
						editItem(editValue);
					}}
				>
					{/* <Text  className="flex"> */}
					<Textarea
						fw="500"
						variant="unstyled"
						p={0}
						readOnly={!editMode}
						autosize
						className={clsx("rounded-md flex-1 focus:outline-none p-0", {
							[classes.bgInput]: editMode,
						})}
						classNames={{
							input: "p-1 m-0 text-base leading-1",
							root: "p-0 m-0",
						}}
						// biome-ignore lint/a11y/noAutofocus: <explanation>
						autoFocus
						value={editValue}
						onChange={(event) => {
							setEditValue(event.target.value);
						}}
						onBlur={() => {
							setEditMode(false);
							editItem(editValue);
						}}
					/>
					{/* </Text> */}
				</form>

				<ActionIcon
					variant="subtle"
					onClick={() => deleteItem(value.id)}
					color="red"
					className="opacity-10 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100"
				>
					<Trash size={24} />
				</ActionIcon>
			</div>
			{/* <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
				<Button
					variant="transparent"
					size="compact-md"
					color="red"
					onClick={() => deleteItem(value.id)}
				>
					Supprimer
				</Button>
			</div> */}
		</Box>
	);
}
