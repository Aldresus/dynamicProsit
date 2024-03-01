import { Box, List, MantineColor, Text, Title } from "@mantine/core";
import React from "react";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps {
	anchor: string;
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
				fw="500"
				className={twMerge(
					"p-1 px-3 rounded-xl transition-all duration-200 ",
					className,
				)}
				ref={ref}
			>
				<Title id={`${anchor}`} order={2}>
					{titre}
				</Title>
				{typeof valeurs === "string" ? (
					<Text size="xl" px="md" fw="500">
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
