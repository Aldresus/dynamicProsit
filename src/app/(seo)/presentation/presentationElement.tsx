import { Box, List, MantineColor, Text, Title } from "@mantine/core";
import React from "react";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps {
  anchor?: string;
  titre: string;
  valeurs: string[] | string;
  ordered?: boolean;
  className?: string;
  bg?: MantineColor;
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
      color,
      bg = "transparent",
      anchor = "",
      className,
      ordered = false,
    },
    ref,
  ) => {
    return (
      <Box
        bg={bg}
        c={color}
        fw="500"
        className={twMerge(
          "p-1 px-3 rounded-xl transition-all duration-200",
          className,
        )}
        ref={ref}
      >
        <Title order={1}>{titre}</Title>
        {typeof valeurs === "string" ? (
          <Text id={`${anchor}`} size="xl" px="md" fw="500" opacity={0.8}>
            {valeurs}
          </Text>
        ) : (
          <List
            className="w-full"
            type={ordered ? "ordered" : "unordered"}
            size="xl"
            opacity={0.8}
            withPadding
          >
            {valeurs.map((valeur, i) => (
              <List.Item
                id={i === valeurs.length - 1 ? `${anchor}` : undefined}
                className="w-11/12"
                key={valeur + i}
              >
                {valeur}
              </List.Item>
            ))}
          </List>
        )}
      </Box>
    );
  },
);

PresentationElement.displayName = "PresentationElement";

export default PresentationElement;
