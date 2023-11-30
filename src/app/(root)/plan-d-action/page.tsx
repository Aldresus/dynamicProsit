"use client";

import EtapeSortable from "@/app/(root)/plan-d-action/etape";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import { Etape } from "@/types/etape";
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Textarea, Title } from "@mantine/core";
import { Kbd, Text } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Problematiques() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [etape, setEtape] = useState<Etape>({
		etapeNo: 0,
		content: "",
	});
	const [etapes, setEtapes] = useState<Etape[]>([]);

	useEffect(() => {
		setEtapes(prosit.planDAction);
	}, [prosit]);

	const router = useRouter();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => router.push("/")],
		["ctrl+shift+enter", () => router.push("/livrables")],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		["enter", () => planHandler()],
		["shift+enter", () => planHandler()],
		...globalHotKeys(router),
		...pageHotkeys,
	]);

	const planHandler = () => {
		const finalEtape = {
			etapeNo: prosit.planDAction.length + 1,
			content: etape.content,
		};

		setProsit({
			...prosit,
			planDAction: [...prosit.planDAction, finalEtape],
		});
		setEtape({
			etapeNo: 0,
			content: "",
		});
	};

	const reorganizeSteps = (steps: Etape[]) => {
		const newSteps = [] as Etape[];
		let i = 1;
		for (const step of steps) {
			step.etapeNo = i;
			newSteps.push(step);
			i++;
		}
		return newSteps;
	};

	const editEtape = (newValue: string, index: number) => {
		//fixme
		let temp = [...prosit.planDAction];
		temp[index].content = newValue;
		temp = reorganizeSteps(temp);
		setProsit({
			...prosit,
			planDAction: [...temp],
		});
	};

	const deleteEtape = (index: number) => {
		let temp = [...prosit.planDAction];
		temp.splice(index - 1, 1);
		temp = reorganizeSteps(temp);
		setProsit({
			...prosit,
			planDAction: [...temp],
		});
	};

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			let steps = prosit.planDAction;

			const oldIndex = steps
				.map((etape) => etape.etapeNo)
				.indexOf(active.id as number);
			const newIndex = steps
				.map((etape) => etape.etapeNo)
				.indexOf(over?.id as number);

			steps = arrayMove(steps, oldIndex, newIndex);
			steps = reorganizeSteps(steps);

			setProsit({
				...prosit,
				planDAction: [...steps],
			});
		}
	}

	return (
		<div className="h-full flex flex-col gap-9 py-3">
			<Title order={2}>Plan d&apos;action</Title>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					planHandler();
				}}
				className="flex gap-2 items-end"
			>
				<Textarea
					onKeyDown={hotkeys}
					className="flex-1"
					autoFocus
					label="Etape du plan d'action"
					placeholder="Etudier le fromage"
					value={etape.content}
					onInput={(event) => {
						setEtape({
							...etape,
							// @ts-ignore
							content: event.target.value,
						});
					}}
				/>
				<Button
					type="submit"
					onClick={(event) => {
						event.preventDefault();
						planHandler();
					}}
				>
					Ajouter l&apos;étape
				</Button>
			</form>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={etapes.map((etape) => etape.etapeNo)}
					strategy={verticalListSortingStrategy}
				>
					<div className="w-full flex flex-col gap-1">
						<div className="flex gap-3 mb-3">
							<Text c="dimmed" size="sm">
								<Kbd>double clic</Kbd> pour éditer la ligne
							</Text>
							<Text c="dimmed" size="sm">
								<Kbd>entrer</Kbd> pour valider
							</Text>
						</div>
						{/*todo avoir des sous truc jor 1. a. b. c. */}
						{etapes.map((value, index) => (
							<EtapeSortable
								key={value.etapeNo + value.content}
								value={value}
								deleteEtape={deleteEtape}
								editEtape={(newValue: string) => editEtape(newValue, index)}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
}
