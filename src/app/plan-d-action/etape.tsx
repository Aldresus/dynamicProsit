"use client";
import { Button, Title } from "@mantine/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Etape } from "@/app/plan-d-action/type";
import { GripVertical } from "lucide-react";

interface EtapeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Etape;
  editEtape: (index: number) => void;
  deleteEtape: (index: number) => void;
}

export default function EtapeSortable(props: EtapeProps) {
  const { value, editEtape, deleteEtape } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value.etapeNo });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="group flex flex-nowrap items-center gap-2 w-full"
      ref={setNodeRef}
      style={style}
    >
      <GripVertical size={24} {...attributes} {...listeners} />
      <Title order={3}>{value.etapeNo}</Title>
      <Title order={3} className="w-3/5 break-words">
        {value.content}
      </Title>
      <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
        <Button
          variant="transparent"
          size="compact-md"
          color="red"
          onClick={() => deleteEtape(value.etapeNo)}
        >
          Supprimer
        </Button>
        <Button onClick={() => editEtape(value.etapeNo)} size="compact-md">
          Editer
        </Button>
      </div>
    </div>
  );
}
