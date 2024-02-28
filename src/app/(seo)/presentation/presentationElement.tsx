import { Box, List, MantineColor, Text, Title } from "@mantine/core";
import React from "react";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps {
  anchor: string;
  title: string;
  items: string[] | string;
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
      title,
      items,
      color,
      bg = "transparent",
      anchor,
      className,
      ordered = false,
    },
    ref,
  ) => {
    return (
      <Box
        bg={bg}
        c={color}
        className={twMerge(
          "p-1 px-3 rounded-xl transition-all duration-200 ",
          className,
        )}
        ref={ref}
      >
        <Title id={`${anchor}`} order={2}>
          {title}
        </Title>
        {typeof items === "string" ? (
          <Text size="xl" px="md">
            {items}
          </Text>
        ) : (
          <List type={ordered ? "ordered" : "unordered"} size="xl" withPadding>
            {items.map((item, i) => (
              <List.Item key={item + i}>{item}</List.Item>
            ))}
          </List>
        )}
      </Box>
    );
  },
);

PresentationElement.displayName = "PresentationElement";

export default PresentationElement;
