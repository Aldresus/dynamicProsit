// "use client";

// import EditableItemList from "@/components/editableItemList";
// import { globalHotKeys } from "@/components/globalHotKeys";
// import PrositContext from "@/components/prositContext";
// import { Button, Textarea, Title } from "@mantine/core";
// import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";

// export default function Problematiques() {
// 	const { prosit, setProsit } = useContext(PrositContext);
// 	const [problematique, setProblematique] = useState("");
// 	const [problematiques, setProblematiques] = useState<string[]>([]);
// 	const router = useRouter();

// 	useEffect(() => {
// 		setProblematiques(prosit.problematiques);
// 	}, [prosit]);

// 	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
// 	const pageHotkeys: any[] = [
// 		["ctrl+enter", () => router.push("/pistes-de-solution")],
// 		["ctrl+shift+enter", () => router.push("/contraintes")],
// 	];

// 	useHotkeys(pageHotkeys);

// 	const hotkeys = getHotkeyHandler([
// 		["enter", () => problematiqueHandler()],
// 		["shift+enter", () => problematiqueHandler()],
// 		...globalHotKeys(router),
// 		...pageHotkeys,
// 	]);

// 	const problematiqueHandler = () => {
// 		setProsit({
// 			...prosit,
// 			problematiques: [...prosit.problematiques, problematique],
// 		});
// 		setProblematique("");
// 	};

// 	return (
// 		<div className="h-full flex flex-col gap-9 py-3">
// 			<Title order={2}>Problématiques</Title>
// 			<form
// 				onSubmit={(event) => {
// 					event.preventDefault();
// 					problematiqueHandler();
// 				}}
// 				className="flex gap-2 items-end"
// 			>
// 				<Textarea
// 					onKeyDown={hotkeys}
// 					className="flex-1"
// 					autoFocus
// 					label="Problématique"
// 					placeholder="Comment trouver le voleur de fromage ?"
// 					value={problematique}
// 					onInput={(event) => {
// 						// @ts-ignore
// 						setProblematique(event.target.value);
// 					}}
// 				/>
// 				<Button
// 					type="submit"
// 					onClick={(event) => {
// 						event.preventDefault();
// 						problematiqueHandler();
// 					}}
// 				>
// 					Ajouter la problématique
// 				</Button>
// 			</form>

// 			<EditableItemList
// 				items={problematiques}
// 				onEdit={(newValue, index) => {
// 					const temp = [...prosit.problematiques];
// 					temp[index] = newValue;
// 					setProsit({ ...prosit, problematiques: [...temp] });
// 				}}
// 				onDelete={(index) => {
// 					const temp = [...prosit.problematiques];
// 					temp.splice(index, 1);
// 					setProsit({ ...prosit, problematiques: [...temp] });
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

export default function Contraintes() {
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
    key: PrositKeys.PROBLEMATIQUES,
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
    ["ctrl+enter", () => router.push("/pistes-de-solution")],
    ["ctrl+shift+enter", () => router.push("/contraintes")],
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
      <Title order={2}>Problématiques</Title>

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
          label="Problématique"
          placeholder="Comment trouver le voleur de fromage ?"
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
          Ajouter la problématique
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
