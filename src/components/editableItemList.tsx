import React from "react";
import { Button, Title } from "@mantine/core";
import clsx from "clsx";

interface ListCrudProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const EditableItemList = React.forwardRef<HTMLDivElement, ListCrudProps>(
  (
    { children, items, onEdit, onDelete, className, ...props }: ListCrudProps,
    ref,
  ) => {
    return (
      <div className={clsx("", className)} {...props} ref={ref}>
        {items.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  onDelete(index);
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  onEdit(index);
                }}
                size="compact-md"
              >
                Editer
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
);

EditableItemList.displayName = "EditableItemList";
export default EditableItemList;
