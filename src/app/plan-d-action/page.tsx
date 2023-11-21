"use client";

import { Button, Textarea, Title } from "@mantine/core";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EtapeSortable from "@/app/plan-d-action/etape";
import { Etape } from "@/app/plan-d-action/type";

export default function Problematiques() {
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [etape, setEtape] = useState<Etape>({
    etapeNo: 0,
    content: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const planHandler = (event) => {
    event.preventDefault();

    let finalEtape = {
      etapeNo: etapes.length + 1,
      content: etape.content,
    };

    setEtapes([...etapes, finalEtape]);
    setEtape({
      etapeNo: 0,
      content: "",
    });
  };

  const reorganizeSteps = (steps: Etape[]) => {
    let newSteps = [] as Etape[];
    let i = 1;
    steps.forEach((step) => {
      step.etapeNo = i;
      newSteps.push(step);
      i++;
    });
    return newSteps;
  };

  const editEtape = (index: number) => {
    console.log(index);
    let temp = [...etapes];
    setEtape(temp.splice(index - 1, 1)[0]);
    setEtapes([...temp]);
  };

  const deleteEtape = (index: number) => {
    console.log(index);
    let temp = [...etapes];
    temp.splice(index - 1, 1);
    setEtapes([...temp]);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active, over);

    if (active.id !== over.id) {
      let steps = etapes;

      const oldIndex = steps
        .map((etape) => etape.etapeNo)
        .indexOf(active.id as number);
      const newIndex = steps
        .map((etape) => etape.etapeNo)
        .indexOf(over!.id as number);

      setEtapes((items) => {
        let tempEtapes = arrayMove(items, oldIndex, newIndex);
        return reorganizeSteps(tempEtapes);
      });
    }
  }

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Plan d&apos;action</Title>

      <form
        onSubmit={(event) => planHandler(event)}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              //method to prevent from default behaviour
              e.preventDefault();
              planHandler(e);
            }
          }}
          className="flex-1"
          autoFocus
          label="Etape du plan d'action"
          placeholder="Etudier le fromage"
          value={etape.content}
          onInput={(event) => {
            console.log(event.target.value);
            setEtape({
              ...etape,
              content: event.target.value,
            });
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            planHandler(event);
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
          <div className="px-6 w-full flex flex-col gap-1">
            {/*todo avoir des sous truc jor 1. a. b. c. */}
            {etapes?.map((value) => (
              <EtapeSortable
                key={value.etapeNo + value.content}
                value={value}
                deleteEtape={deleteEtape}
                editEtape={editEtape}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
