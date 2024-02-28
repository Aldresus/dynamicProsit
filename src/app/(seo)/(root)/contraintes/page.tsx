// "use client";

// import EditableItemList from "@/components/editableItemList";
// import { globalHotKeys } from "@/components/globalHotKeys";
// import PrositContext from "@/components/prositContext";
// import { Button, Textarea, Title } from "@mantine/core";
// import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";

// export default function Contraintes() {
// 	const { prosit, setProsit } = useContext(PrositContext);
// 	const [contraintes, setContraintes] = useState<string[]>([]);
// 	const [contrainte, setContrainte] = useState("");

// 	useEffect(() => {
// 		setContraintes(prosit.contraintes);
// 	}, [prosit]);

// 	const router = useRouter();

// 	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
// 	const pageHotkeys: any[] = [
// 		["ctrl+enter", () => router.push("/problematiques")],
// 		["ctrl+shift+enter", () => router.push("/mots-clefs")],
// 	];

// 	useHotkeys(pageHotkeys);

// 	const hotkeys = getHotkeyHandler([
// 		["enter", () => contrainteHandler()],
// 		["shift+enter", () => contrainteHandler()],
// 		...globalHotKeys(router),
// 		...pageHotkeys,
// 	]);
// 	const contrainteHandler = () => {
// 		setProsit({
// 			...prosit,
// 			contraintes: [...prosit.contraintes, contrainte],
// 		});
// 		setContrainte("");
// 	};

// 	return (
// 		<div className="h-full flex flex-col gap-9 py-3">
// 			{/*  maybe refacto l'input*/}
// 			<Title order={2}>Contraintes</Title>

// 			<form
// 				onSubmit={(event) => {
// 					event.preventDefault();
// 					contrainteHandler();
// 				}}
// 				className="flex gap-2 items-end"
// 			>
// 				<Textarea
// 					onKeyDown={hotkeys}
// 					className="flex-1"
// 					autoFocus
// 					label="Contrainte"
// 					placeholder="Le fromage doit être retrouvé avant de pourrir"
// 					value={contrainte}
// 					onInput={(event) => {
// 						// @ts-ignore
// 						setContrainte(event.target.value);
// 					}}
// 				/>
// 				<Button
// 					type="submit"
// 					onClick={(event) => {
// 						event.preventDefault();
// 						contrainteHandler();
// 					}}
// 				>
// 					Ajouter la contrainte
// 				</Button>
// 			</form>
// 			<EditableItemList
// 				items={contraintes}
// 				onEdit={(newValue, index) => {
// 					const temp = [...prosit.contraintes];
// 					temp[index] = newValue;
// 					setProsit({ ...prosit, contraintes: [...temp] });
// 				}}
// 				onDelete={(index) => {
// 					const temp = [...prosit.contraintes];
// 					setContrainte(temp.splice(index, 1)[0]);
// 					setProsit({ ...prosit, contraintes: [...temp] });
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
    key: PrositKeys.CONTRAINTES,
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
    ["ctrl+enter", () => router.push("/problematiques")],
    ["ctrl+shift+enter", () => router.push("/mots-clefs")],
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
      <Title order={2}>Contraintes</Title>

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
          label="Contrainte"
          placeholder="Le fromage doit être retrouvé avant de pourrir"
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
          Ajouter la contrainte
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
