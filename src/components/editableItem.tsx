import classes from "@/app/(seo)/(root)/plan-d-action/Demo.module.css";
import { Button, Title } from "@mantine/core";
import clsx from "clsx";
import React from "react";

interface EditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	onEdit: (value: string) => void;
	onDelete: () => void;
}
export default function EditableItem({
	value,
	onEdit,
	onDelete,
	...props
}: EditableItemProps) {
	const [editMode, setEditMode] = React.useState(false);
	const [editValue, setEditValue] = React.useState(value);

	return (
		<div
			className={clsx(
				"group w-full flex items-center justify-between gap-1 rounded",
				{
					[classes.bgInput]: editMode,
				},
			)}
			onDoubleClick={() => {
				setEditMode(true);
				onEdit(editValue);
			}}
			{...props}
		>
			{editMode ? (
				<form
					className="flex-1"
					onSubmit={(event) => {
						event.preventDefault();
						setEditMode(false);
						onEdit(editValue);
					}}
				>
					<Title order={3} className="flex gap-1">
						<div>-</div>

						<input
							className={clsx("border-none flex-1 focus:outline-none m-0 p-0", {
								[classes.bgInput]: editMode,
							})}
							// biome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus
							value={editValue}
							onChange={(event) => {
								setEditValue(event.target.value);
							}}
							onBlur={() => {
								setEditMode(false);
								onEdit(editValue);
							}}
						/>
					</Title>
				</form>
			) : (
				<Title className="flex gap-1" order={3}>
					<div>-</div>
					{value}
				</Title>
			)}
			{/*<Title order={3}>- {value}</Title>*/}
			<div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
				<Button
					variant="transparent"
					size="compact-md"
					color="red"
					onClick={() => {
						onDelete();
					}}
				>
					Supprimer
				</Button>
			</div>
		</div>
	);
}
