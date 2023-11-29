import { Box, Button, Title } from "@mantine/core";
import React from "react";
import clsx from "clsx";

interface EditableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onEdit: (value: string) => void;
  onDelete: () => void;
}
export default function EditableItem({
  value,
  onEdit,
  onDelete,
  ...props
}: EditableItemProps) {
  const [editMode, setEditMode] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

  return (
    <Box
      className={clsx(
        "group w-full flex items-center justify-between gap-1",
        {},
      )}
      bg={editMode ? "blue.0" : "transparent"}
      onDoubleClick={() => {
        setEditMode(!editMode);
      }}
    >
      {editMode ? (
        <form
          className="flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            setEditMode(false);
            onEdit(editValue);
          }}
        >
          <Title order={3} className="flex gap-1">
            <div>-</div>

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
                onEdit(editValue);
              }}
            />
          </Title>
        </form>
      ) : (
        <Title className="flex gap-1" order={3}>
          <div>-</div>
          {value}
        </Title>
      )}
      {/*<Title order={3}>- {value}</Title>*/}
      <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
        <Button
          variant="transparent"
          size="compact-md"
          color="red"
          onClick={() => {
            onDelete();
          }}
        >
          Supprimer
        </Button>
        {!editMode ? (
          <Button
            onClick={() => {
              onEdit("test");
              setEditMode(true);
            }}
            size="compact-md"
          >
            Editer
          </Button>
        ) : null}
      </div>
    </Box>
  );
}
