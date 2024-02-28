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

export default function PlanDAction() {
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
    key: PrositKeys.PLAN_D_ACTION,
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
    ["ctrl+enter", () => router.push("/")],
    ["ctrl+shift+enter", () => router.push("/livrables")],
  ];

  useHotkeys(pageHotkeys);

  const hotkeys = getHotkeyHandler([
    ["enter", () => addItem()],
    ["shift+enter", () => addItem()],
    ...globalHotKeys(router),
    ...pageHotkeys,
  ]);

  // const idHandler = (content: string) => {
  //   //not the greatest looking ids but works well
  //   let id = `step_${content.split(" ").join("_")}`;
  //   etapes.forEach((step) => {
  //     if (step.id === id) {
  //       id = idHandler(`${content} 2`);
  //     }
  //   });
  //   return id;
  // };

  // const planHandler = () => {
  //   const finalEtape: OrderedItem = {
  //     id: idHandler(etape.content),
  //     content: etape.content,
  //   };

  //   setProsit({
  //     ...prosit,
  //     planDAction: [...prosit.planDAction, finalEtape],
  //   });
  //   setEtape({
  //     id: "",
  //     content: "",
  //   });
  // };

  // const editEtape = (newValue: string, index: number) => {
  //   //fixme
  //   let temp = [...prosit.planDAction];
  //   temp[index].content = newValue;
  //   setProsit({
  //     ...prosit,
  //     planDAction: [...temp],
  //   });
  // };

  // const deleteEtape = (index: number) => {
  //   let temp = [...prosit.planDAction];
  //   temp.splice(index, 1);
  //   setProsit({
  //     ...prosit,
  //     planDAction: [...temp],
  //   });
  // };

  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;
  //   console.log(active, over);

  //   if (active.id !== over?.id) {
  //     let steps = prosit.planDAction;

  //     const oldIndex = steps.indexOf(
  //       steps.find((etape) => etape.id === active.id)!,
  //     );
  //     const newIndex = steps.indexOf(
  //       steps.find((etape) => etape.id === over?.id)!,
  //     );

  //     console.log(oldIndex, newIndex);

  //     steps = arrayMove(steps, oldIndex, newIndex);

  //     setProsit({
  //       ...prosit,
  //       planDAction: [...steps],
  //     });
  //   }
  // }

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Plan d&apos;action</Title>

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
          label="Etape du plan d'action"
          placeholder="Etudier le fromage"
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
          Ajouter l&apos;étape
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
            {items.map((value, index) => (
              <SortableItem
                index={index}
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
