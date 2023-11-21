"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import { Etape } from "@/types/etape";
import PrositContext from "@/components/prositContext";

export default function Problematiques() {
  const { prosit, setProsit } = useContext(PrositContext);
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

  const planHandler = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();

    let finalEtape = {
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
    //fixme
    console.log(index);
    let temp = [...prosit.planDAction];
    setEtape(temp.splice(index - 1, 1)[0]);
    setProsit({
      ...prosit,
      planDAction: [...temp],
    });
  };

  const deleteEtape = (index: number) => {
    console.log(index);
    let temp = [...prosit.planDAction];
    temp.splice(index - 1, 1);
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
        .indexOf(over!.id as number);

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
          items={prosit.planDAction.map((etape) => etape.etapeNo)}
          strategy={verticalListSortingStrategy}
        >
          <div className="px-6 w-full flex flex-col gap-1">
            {/*todo avoir des sous truc jor 1. a. b. c. */}
            {prosit.planDAction?.map((value) => (
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