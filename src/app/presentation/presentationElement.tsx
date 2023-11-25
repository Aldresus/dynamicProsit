import React, { HTMLProps } from "react";
import { List, Text, Title } from "@mantine/core";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps extends HTMLProps<HTMLDivElement> {
  anchor: string;
  titre: string;
  valeurs: string[] | string;
  ordered?: boolean;
}

const PresentationElement = React.forwardRef<
  HTMLDivElement,
  PresentationElementProps
>(({ titre, valeurs, anchor, className, ordered = false, ...props }, ref) => {
  return (
    <div
      className={twMerge(
        "p-1 px-3 rounded-xl transition-all duration-200 ",
        className,
      )}
      {...props}
    >
      <a id={`${anchor}`}>
        <Title order={2}>{titre}</Title>
      </a>
      {typeof valeurs === "string" ? (
        <Text size="xl" px="md">
          {valeurs}
        </Text>
      ) : (
        <List type={ordered ? "ordered" : "unordered"} size="xl" withPadding>
          {valeurs.map((valeur, i) => (
            <List.Item key={valeur + i}>{valeur}</List.Item>
          ))}
        </List>
      )}
    </div>
  );
});

PresentationElement.displayName = "PresentationElement";

export default PresentationElement;
