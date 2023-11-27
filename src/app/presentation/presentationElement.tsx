import React from "react";
import { Box, List, MantineColor, Text, Title } from "@mantine/core";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps {
  anchor: string;
  titre: string;
  valeurs: string[] | string;
  ordered?: boolean;
  className?: string;
  color?: MantineColor;
}

const PresentationElement = React.forwardRef<
  HTMLDivElement,
  PresentationElementProps
>(
  (
    {
      titre,
      valeurs,
      color = "transparent",
      anchor,
      className,
      ordered = false,
    },
    ref,
  ) => {
    return (
      <Box
        bg={color}
        className={twMerge(
          "p-1 px-3 rounded-xl transition-all duration-200 ",
          className,
        )}
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
      </Box>
    );
  },
);

PresentationElement.displayName = "PresentationElement";

export default PresentationElement;
