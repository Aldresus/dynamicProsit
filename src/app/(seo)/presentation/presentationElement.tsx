import { Box, List, MantineColor, Text, Title } from "@mantine/core";
import React from "react";
import { twMerge } from "tailwind-merge";

interface PresentationElementProps {
	anchor?: string;
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
			anchor = "",
			className,
			ordered = false,
		},
		ref,
	) => {
		if (items.length === 0) return null;

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
				<Title order={1}>{title}</Title>
				{typeof items === "string" ? (
					<Text id={`${anchor}`} size="xl" px="md" fw="500" opacity={0.8}>
						{items}
					</Text>
				) : (
					<List
						className="w-full"
						type={ordered ? "ordered" : "unordered"}
						size="xl"
						opacity={0.8}
						withPadding
					>
						{items.map((item, i) => (
							<List.Item
								id={i === items.length - 1 ? anchor : undefined}
								className="w-11/12"
								key={item + i}
							>
								{item}
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
