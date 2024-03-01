"use client";

import PresentationElement from "@/app/(seo)/presentation/presentationElement";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Group,
	Stack,
	Title,
	Tooltip,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Presentation from "./presentation";
import { Plus, X } from "lucide-react";

export default function Visualisation() {
	const { prosit } = useContext(PrositContext);
	const [prositState, setPrositState] = useState<Prosit>(prosit);
	const [numberOfViews, setNumberOfViews] = useState(1);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("storage", () => {
			const storedProsit = localStorage.getItem("prosit");
			const parsedProsit = storedProsit
				? JSON.parse(storedProsit)
				: defaultPrositValue;
		});
	}, []);
	//
	useEffect(() => {
		// Function to handle the storage event
		const handleStorageChange = (event) => {
			if (event.key === "prosit") {
				const storedProsit = event.newValue; // Direct access to the updated value
				const parsedProsit = storedProsit
					? JSON.parse(storedProsit)
					: defaultPrositValue;
				setPrositState(parsedProsit);
			}
		};

		if (typeof window !== "undefined") {
			window.addEventListener("storage", handleStorageChange);
		}

		// Cleanup function to remove the event listener
		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("storage", handleStorageChange);
			}
		};
	}, []);

	return (
		<div className="h-full w-full flex overflow-hidden">
			<div className="flex flex-col gap-6 ">
				<Title order={1}>Prosit : {prositState.titre}</Title>

				<div className="flex gap-2 overflow-hidden">
					<div
						className="fixed flex items-center group top-0 bottom-0 right-0 p-3 cursor-pointer"
						onClick={() => {
							if (numberOfViews >= 3) return;
							setNumberOfViews((prev) => prev + 1);
						}}
					>
						<Button className="h-1/2 w-full translate-x-20 group-hover:translate-x-0 transition-transform">
							<Plus />
						</Button>
					</div>

					{Array.from({ length: numberOfViews }).map((_, index) => (
						<>
							{index !== 0 && (
								<Divider
									label={
										<Tooltip label="Fermer la vue" position="left" color="red">
											<ActionIcon size="xl" variant="subtle" color="red">
												<X size={30} />
											</ActionIcon>
										</Tooltip>
									}
									my="xs"
									size="md"
									onClick={() => {
										setNumberOfViews((prev) => prev - 1);
									}}
								/>
							)}

							<Presentation
								prosit={prositState}
								key={prositState.titre + index}
								closable={index !== 0}
							/>
						</>
					))}
				</div>
			</div>
		</div>
	);
}
