// "use client";

// import EditableItemList from "@/components/editableItemList";
// import { globalHotKeys } from "@/components/globalHotKeys";
// import PrositContext from "@/components/prositContext";
// import { Button, Textarea, Title } from "@mantine/core";
// import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";

// export default function Livrables() {
// 	const { prosit, setProsit } = useContext(PrositContext);
// 	const [livrables, setLivrables] = useState<string[]>([]);
// 	const [livrable, setLivrable] = useState("");

// 	useEffect(() => {
// 		setLivrables(prosit.livrables);
// 	}, [prosit]);

// 	const router = useRouter();

// 	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
// 	const pageHotkeys: any[] = [
// 		["ctrl+enter", () => router.push("/plan-d-action")],
// 		["ctrl+shift+enter", () => router.push("/pistes-de-solution")],
// 	];

// 	useHotkeys(pageHotkeys);

// 	const hotkeys = getHotkeyHandler([
// 		["enter", () => livrableHandler()],
// 		["shift+enter", () => livrableHandler()],
// 		...globalHotKeys(router),
// 		...pageHotkeys,
// 	]);
// 	const livrableHandler = () => {
// 		setProsit({
// 			...prosit,
// 			livrables: [...prosit.livrables, livrable],
// 		});
// 		setLivrable("");
// 	};

// 	return (
// 		<div className="h-full flex flex-col gap-9 py-3">
// 			<Title order={2}>Livrables</Title>

// 			<form
// 				onSubmit={(event) => {
// 					event.preventDefault();
// 					livrableHandler();
// 				}}
// 				className="flex gap-2 items-end"
// 			>
// 				<Textarea
// 					onKeyDown={hotkeys}
// 					className="flex-1"
// 					autoFocus
// 					label="Livrable"
// 					placeholder="Un rapport de 10 pages sur le voleur de fromage, son histoire, ses motivations, et comment il a fait pour voler le fromage"
// 					value={livrable}
// 					onInput={(event) => {
// 						// @ts-ignore
// 						setLivrable(event.target.value);
// 					}}
// 				/>
// 				<Button
// 					type="submit"
// 					onClick={(event) => {
// 						event.preventDefault();
// 						livrableHandler();
// 					}}
// 				>
// 					Ajouter le livrable
// 				</Button>
// 			</form>

// 			<EditableItemList
// 				items={livrables}
// 				onEdit={(newValue, index) => {
// 					const temp = [...prosit.livrables];
// 					temp[index] = newValue;
// 					setProsit({ ...prosit, livrables: [...temp] });
// 				}}
// 				onDelete={(index) => {
// 					const temp = [...prosit.livrables];
// 					temp.splice(index, 1);
// 					setProsit({ ...prosit, livrables: [...temp] });
// 				}}
// 			/>
// 		</div>
// 	);
// }

// "use client";

// import EditableItemList from "@/components/editableItemList";
// import { globalHotKeys } from "@/components/globalHotKeys";
// import PrositContext from "@/components/prositContext";
// import { Button, Textarea, Title } from "@mantine/core";
// import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";

// export default function MotsClefs() {
// 	const { prosit, setProsit } = useContext(PrositContext);
// 	const [keyword, setKeyword] = useState("");
// 	const [keywords, setKeywords] = useState<string[]>([]);

// 	useEffect(() => {
// 		setKeywords(prosit.motsCles);
// 	}, [prosit]);

// 	const router = useRouter();

// 	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
// 	const pageHotkeys: any[] = [
// 		["ctrl+enter", () => router.push("/contraintes")],
// 		["ctrl+shift+enter", () => router.push("/")],
// 	];

// 	useHotkeys(pageHotkeys);

// 	const hotkeys = getHotkeyHandler([
// 		["enter", () => keywordHandler()],
// 		["shift+enter", () => keywordHandler()],
// 		...globalHotKeys(router),
// 		...pageHotkeys,
// 	]);

// 	const keywordHandler = () => {
// 		setProsit({
// 			...prosit,
// 			motsCles: [...prosit.motsCles, keyword],
// 		});
// 		setKeyword("");
// 	};

// 	return (
// 		<div className="h-full flex flex-col gap-9 py-3">
// 			<Title order={2}>Mots clefs</Title>

// 			<form
// 				onSubmit={(event) => {
// 					event.preventDefault();
// 					keywordHandler();
// 				}}
// 				className="flex gap-2 items-end"
// 			>
// 				<Textarea
// 					onKeyDown={hotkeys}
// 					className="flex-1"
// 					autoFocus
// 					label="Mot clef"
// 					placeholder="fromage"
// 					value={keyword}
// 					onInput={(event) => {
// 						// @ts-ignore
// 						setKeyword(event.target.value);
// 					}}
// 				/>
// 				<Button
// 					type="submit"
// 					onClick={(event) => {
// 						event.preventDefault();
// 						keywordHandler();
// 					}}
// 				>
// 					Ajouter le mot clef
// 				</Button>
// 			</form>

// 			<EditableItemList
// 				items={keywords}
// 				onEdit={(newValue, index) => {
// 					const temp = [...prosit.motsCles];
// 					temp[index] = newValue;
// 					setProsit({ ...prosit, motsCles: [...temp] });
// 				}}
// 				onDelete={(index) => {
// 					const temp = [...prosit.motsCles];
// 					temp.splice(index, 1);
// 					setProsit({
// 						...prosit,
// 						motsCles: [...temp],
// 					});
// 				}}
// 			/>
// 		</div>
// 	);
// }

"use client";

import SortableItem from "@/components/sortableItem";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import usePrositPart from "@/hooks/usePrositPart";
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
import { Button, Textarea, Title } from "@mantine/core";
import { Kbd, Text } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { PrositKeys } from "@/types/prosit";

export default function Livrables() {
	const { prosit, setProsit } = useContext(PrositContext);
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

	const router = useRouter();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => router.push("/plan-d-action")],
		["ctrl+shift+enter", () => router.push("/pistes-de-solution")],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		["enter", () => addItem()],
		["shift+enter", () => addItem()],
		...globalHotKeys(router),
		...pageHotkeys,
	]);

	return (
		<div className="h-full flex flex-col gap-9 py-3">
			<Title order={2}>Livrables</Title>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					addItem();
				}}
				className="flex gap-2 items-end"
			>
				<Textarea
					onKeyDown={hotkeys}
					className="flex-1"
					autoFocus
					label="Livrable"
					placeholder="Un rapport de 10 pages sur le voleur de fromage, son histoire, ses motivations, et comment il a fait pour voler le fromage"
					value={workingItem.content}
					onInput={(event) => {
						setWorkingItem({
							...workingItem,
							content: event.currentTarget.value,
						});
					}}
				/>
				<Button
					type="submit"
					onClick={(event) => {
						event.preventDefault();
						addItem();
					}}
				>
					Ajouter le livrable
				</Button>
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
						<div className="flex gap-3 mb-3">
							<Text c="dimmed" size="sm">
								<Kbd>double clic</Kbd> pour éditer la ligne
							</Text>
							<Text c="dimmed" size="sm">
								<Kbd>entrer</Kbd> pour valider
							</Text>
						</div>
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
