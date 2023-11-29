"use client";
import { Box, Button, Text, Title } from "@mantine/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Etape } from "@/types/etape";
import { GripVertical } from "lucide-react";
import React from "react";

interface EtapeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Etape;
  editEtape: (newValue: string) => void;
  deleteEtape: (index: number) => void;
}

export default function EtapeSortable(props: EtapeProps) {
  const { value, editEtape, deleteEtape } = props;
  const [editMode, setEditMode] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value.content);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value.etapeNo });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      className="group flex items-center justify-between w-full"
      ref={setNodeRef}
      style={style}
      bg={editMode ? "blue.0" : "transparent"}
      onDoubleClick={() => {
        setEditMode(!editMode);
      }}
    >
      <div className="flex gap-2 flex-1 items-center">
        <Text c="blue" className="flex items-center ">
          <GripVertical
            className="cursor-move"
            size={24}
            {...attributes}
            {...listeners}
          />
        </Text>
        <Title order={3}>{value.etapeNo}</Title>
        {editMode ? (
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              setEditMode(false);
              editEtape(editValue);
            }}
          >
            <Title order={3} className="flex">
              <input
                className="border-none flex-1 focus:outline-none m-0 p-0"
                style={{
                  background: "var(--mantine-colors-blue-0)",
                }}
                // biome-ignore lint/a11y/noAutofocus: <explanation>
                autoFocus
                value={editValue}
                onChange={(event) => {
                  setEditValue(event.target.value);
                }}
                onBlur={() => {
                  setEditMode(false);
                  editEtape(editValue);
                }}
              />
            </Title>
          </form>
        ) : (
          <Title order={3} className="w-3/5 break-words">
            {value.content}
          </Title>
        )}
      </div>
      <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
        <Button
          variant="transparent"
          size="compact-md"
          color="red"
          onClick={() => deleteEtape(value.etapeNo)}
        >
          Supprimer
        </Button>
        <Button onClick={() => setEditMode(true)} size="compact-md">
          Editer
        </Button>
      </div>
    </Box>
  );
}
