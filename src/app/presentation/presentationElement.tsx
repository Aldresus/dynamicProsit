import React from "react";
import { List, Text, Title } from "@mantine/core";

interface PresentationElementProps {
  anchor: string;
  titre: string;
  valeurs: string[] | string;
}

const PresentationElement = React.forwardRef<
  HTMLDivElement,
  PresentationElementProps
>(({ titre, valeurs, anchor, ...props }, ref) => {
  return (
    <div className="p-1 px-3 rounded-xl h-full">
      <a id={`#${anchor}`}>
        <Title order={2}>{titre}</Title>
      </a>
      {typeof valeurs === "string" ? (
        <Text size="xl" px="md">
          {valeurs}
        </Text>
      ) : (
        <List size="xl" withPadding>
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
