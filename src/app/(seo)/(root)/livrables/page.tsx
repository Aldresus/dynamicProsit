"use client";

import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import SortableItem from "@/components/sortableItem";
import useNavigator from "@/hooks/useNavigator";
import usePrositPart from "@/hooks/usePrositPart";
import { AnchorsKeys } from "@/types/anchors";
import { PrositKeys } from "@/types/prosit";
import {
	DndContext,
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
import { Button, Kbd, Text, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import clsx from "clsx";
import React, { useContext } from "react";
import classes from "@/app/Demo.module.css";

export default function Livrables() {
	const { prosit, setProsit } = useContext(PrositContext);
	const { navigate } = useNavigator({
		prosit,
		setProsit,
	});

	const {
		addItem,
		deleteItem,
		editItem,
		handleDragEnd,
		items,
		setWorkingItem,
		workingItem,
	} = usePrositPart({
		prosit: prosit,
		setProsit,
		key: PrositKeys.LIVRABLES,
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => navigate(AnchorsKeys.PLAN_D_ACTION)],
		["ctrl+shift+enter", () => navigate(AnchorsKeys.PISTES_DE_SOLUTION)],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		["enter", () => addItem()],
		["shift+enter", () => addItem()],
		...globalHotKeys(navigate),
		...pageHotkeys,
	]);

	return (
		<div className="h-full flex flex-col gap-9 py-3">
			<form
				onSubmit={(event) => {
					event.preventDefault();
					addItem();
				}}
				className={clsx(
					"flex flex-col sticky gap-2 z-10 top-0 p-2 pt-4 rounded-md w-full",
					[classes.inputOverlay],
				)}
			>
				<Textarea
					onKeyDown={hotkeys}
					className="flex-1"
					w="100%"
					autoFocus
					label={
						<Title order={2} className="pb-3">
							Livrables
						</Title>
					}
					placeholder="Un rapport de 10 pages sur le voleur de fromage, son histoire, ses motivations, et comment il a fait pour voler le fromage"
					value={workingItem.content}
					onInput={(event) => {
						setWorkingItem({
							...workingItem,
							content: event.currentTarget.value,
						});
					}}
				/>
				<div className="w-full flex justify-between items-start">
					<div className="flex flex-col justify-between">
						<Text c="dimmed" size="sm">
							<Kbd>double clic</Kbd> pour éditer la ligne
						</Text>
					</div>
					<Button
						w="40%"
						type="submit"
						onClick={(event) => {
							event.preventDefault();
							addItem();
						}}
					>
						Ajouter le livrable
					</Button>
				</div>
			</form>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="w-full flex flex-col gap-1">
						{/*todo avoir des sous truc jor 1. a. b. c. */}
						{items.map((value) => (
							<SortableItem
								key={value.id}
								value={value}
								deleteItem={() => deleteItem(value.id)}
								editItem={(newValue: string) => editItem(newValue, value.id)}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
}
