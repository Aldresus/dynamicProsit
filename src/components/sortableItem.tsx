"use client";

import { OrderedItem } from "@/types/orderedItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Group, Text, Title } from "@mantine/core";
import clsx from "clsx";
import { GripVertical, Minus } from "lucide-react";
import React from "react";
import classes from "@/app/Demo.module.css";

interface SortableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: OrderedItem;
  index?: number;
  editItem: (newValue: string) => void;
  deleteItem: (id: string) => void;
  undraggable?: boolean;
}

export default function SortableItem({
  deleteItem,
  editItem,
  value,
  index,
  undraggable = false,
  ...props
}: SortableItemProps) {
  const [editMode, setEditMode] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value.content);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      className={clsx(
        "group flex items-center justify-between w-full rounded",
        {
          [classes.bgInput]: editMode,
        },
      )}
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => {
        setEditMode(true);
        editItem(editValue);
      }}
    >
      <div className="flex gap-1 flex-1 items-center">
        <Group gap={1}>
          <Text c="blue" className="flex items-center ">
            {undraggable ? (
              <Minus size={24} />
            ) : (
              <GripVertical
                className="cursor-move"
                size={24}
                {...attributes}
                {...listeners}
              />
            )}
          </Text>
          {index !== undefined && (
            <Title order={3} pr="sm">
              {index + 1}.
            </Title>
          )}
        </Group>
        {editMode ? (
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              setEditMode(false);
              editItem(editValue);
            }}
          >
            <Title order={3} className="flex">
              <input
                className={clsx(
                  "border-none flex-1 focus:outline-none m-0 p-0",
                  classes.bgInput,
                )}
                // biome-ignore lint/a11y/noAutofocus: <explanation>
                autoFocus
                value={editValue}
                onChange={(event) => {
                  setEditValue(event.target.value);
                }}
                onBlur={() => {
                  setEditMode(false);
                  editItem(editValue);
                }}
              />
            </Title>
          </form>
        ) : (
          <>
            {/* <Title order={2} className="w-3/5 break-words">
              {value.id}
            </Title> */}

            <Title order={3} className="w-3/5 break-words">
              {value.content}
            </Title>
          </>
        )}
      </div>
      <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
        <Button
          variant="transparent"
          size="compact-md"
          color="red"
          onClick={() => deleteItem(value.id)}
        >
          Supprimer
        </Button>
      </div>
    </Box>
  );
}
