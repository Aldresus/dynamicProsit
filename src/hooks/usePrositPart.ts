"use client";
import { OrderedItem } from "@/types/orderedItem";
import { Prosit, PrositKeys } from "@/types/prosit";
import { capitalize } from "@/utils/capitalize";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

interface UsePrositPartProps {
	prosit: Prosit;
	setProsit: (prosit: Prosit) => void;
	key: PrositKeys;
}

const usePrositPart = ({ prosit, setProsit, key }: UsePrositPartProps) => {
	const [items, setValues] = useState<OrderedItem[]>([]);
	useEffect(() => {
		setValues(prosit[key] as OrderedItem[]);
	}, [prosit, key]);

	const [workingItem, setWorkingItem] = useState<OrderedItem>({
		content: "",
		id: "",
	});

	const idHandler = (content: string) => {
		// remove any unwanted characters
		const clearedContent = content.replace(/[^a-zA-Z0-9 ]/g, "");
		let id = `${key.toLowerCase()}_${clearedContent
			.split(" ")
			.join("_")
			.toLowerCase()}`;
		for (const step of items) {
			if (step.id === id) {
				id = idHandler(`${content}_2`); // Recursive call to handle duplicates
			}
		}
		return id;
	};

	const findIndex = (id: string) => items.findIndex((item) => item.id === id);

	const addItem = () => {
		if (!workingItem.content) return;

		const finalItem: OrderedItem = {
			id: idHandler(workingItem.content),
			content: capitalize(workingItem.content.trim()),
		};
		setProsit({
			...prosit,
			[key]: [...items, finalItem],
		});
		setValues([...items, finalItem]);
		setWorkingItem({ content: "", id: "" });
	};

	const editItem = (newValue: string, id: string) => {
		if (!newValue) {
			deleteItem(id);
			return;
		}
		const temp = [...items];
		const index = findIndex(id);
		temp[index].content = newValue;

		setValues(temp);
		setProsit({
			...prosit,
			[key]: temp,
		});
	};

	const deleteItem = (id: string) => {
		const temp = [...items];
		const index = findIndex(id);
		temp.splice(index, 1);
		setValues(temp);
		setProsit({
			...prosit,
			[key]: temp,
		});
	};

	// Assuming DragEndEvent type is known and correctly imported
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			let newItems = items;

			const oldIndex = newItems.findIndex((item) => item.id === active.id);
			const newIndex = newItems.findIndex((item) => item.id === over?.id);

			newItems = arrayMove(items, oldIndex, newIndex);

			setValues(newItems);
		}
	};

	return {
		workingItem,
		setWorkingItem,
		items,
		addItem,
		editItem,
		deleteItem,
		handleDragEnd,
	};
};

export default usePrositPart;
