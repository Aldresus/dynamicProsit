// "use client";

// import EditableItemList from "@/components/editableItemList";
// import { globalHotKeys } from "@/components/globalHotKeys";
// import PrositContext from "@/components/prositContext";
// import { Button, Textarea, Title } from "@mantine/core";
// import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";

// export default function Pistes() {
//   const { prosit, setProsit } = useContext(PrositContext);
//   const [pisteDeSolution, setPisteDeSolution] = useState("");
//   const [pistesDeSolutions, setPistesDeSolutions] = useState<string[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     setPistesDeSolutions(prosit.pistesDeSolutions);
//   }, [prosit]);

//   // biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
//   const pageHotkeys: any[] = [
//     ["ctrl+enter", () => router.push("/livrables")],
//     ["ctrl+shift+enter", () => router.push("/problematiques")],
//   ];

//   useHotkeys(pageHotkeys);

//   const hotkeys = getHotkeyHandler([
//     ["enter", () => pisteHandler()],
//     ["shift+enter", () => pisteHandler()],
//     ...globalHotKeys(router),
//     ...pageHotkeys,
//   ]);

//   const pisteHandler = () => {
//     setProsit({
//       ...prosit,
//       pistesDeSolutions: [...prosit.pistesDeSolutions, pisteDeSolution],
//     });
//     setPisteDeSolution("");
//   };

//   return (
//     <div className="h-full flex flex-col gap-9 py-3">
//       <Title order={2}>Pistes de solution</Title>

//       <form
//         onSubmit={(event) => {
//           event.preventDefault();
//           pisteHandler();
//         }}
//         className="flex gap-2 items-end"
//       >
//         <Textarea
//           onKeyDown={hotkeys}
//           className="flex-1"
//           autoFocus
//           label="Piste de solution"
//           placeholder="Il faut faire un algorithme de recherche de fromage avec python"
//           value={pisteDeSolution}
//           onInput={(event) => {
//             // @ts-ignore
//             setPisteDeSolution(event.target.value);
//           }}
//         />
//         <Button
//           type="submit"
//           onClick={(event) => {
//             event.preventDefault();
//             pisteHandler();
//           }}
//         >
//           Ajouter la piste
//         </Button>
//       </form>

//       <EditableItemList
//         items={pistesDeSolutions}
//         onEdit={(newValue, index) => {
//           const temp = [...prosit.pistesDeSolutions];
//           temp[index] = newValue;
//           setProsit({ ...prosit, pistesDeSolutions: [...temp] });
//         }}
//         onDelete={(index) => {
//           const temp = [...prosit.pistesDeSolutions];
//           temp.splice(index, 1);

//           setProsit({
//             ...prosit,
//             pistesDeSolutions: [...temp],
//           });
//         }}
//       />
//     </div>
//   );
// }
//
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

export default function Pistes() {
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
		key: PrositKeys.PISTES_DE_SOLUTIONS,
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
		["ctrl+enter", () => router.push("/livrables")],
		["ctrl+shift+enter", () => router.push("/problematiques")],
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
			<Title order={2}>Pistes de solution</Title>

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
					label="Piste de solution"
					placeholder="Il faut faire un algorithme de recherche de fromage avec python"
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
					Ajouter la piste
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
