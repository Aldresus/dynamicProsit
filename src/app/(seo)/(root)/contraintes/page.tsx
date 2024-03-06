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
import React, { useContext, useEffect, useState } from "react";

export default function Contraintes() {
  const { prosit, setProsit } = useContext(PrositContext);
  const { navigate } = useNavigator({ prosit, setProsit });

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
  const pageHotkeys: any[] = [
    ["ctrl+enter", () => navigate(AnchorsKeys.PROBLEMATIQUES)],

    ["ctrl+shift+enter", () => navigate(AnchorsKeys.MOTSCLEFS)],
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
