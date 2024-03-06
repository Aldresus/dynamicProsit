"use client";

import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import { ActionIcon, Divider, Title, Tooltip } from "@mantine/core";
import { Plus, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Presentation from "./presentation";

export default function Visualisation() {
	const { prosit } = useContext(PrositContext);
	const [prositState, setPrositState] = useState<Prosit>(defaultPrositValue);
	const [numberOfViews, setNumberOfViews] = useState(1);

	const maxNumberOfViews = 2;

	useEffect(() => {
		setPrositState(prosit);
	}, [prosit]);

	useEffect(() => {
		// Function to handle the storage event
		const handleStorageChange = (event: StorageEvent) => {
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

	// Effect to scroll to the anchor
	useEffect(() => {
		if (prositState.currentAnchor && typeof window !== "undefined") {
			const anchorElement = document.getElementById(prositState.currentAnchor);
			if (anchorElement) {
				anchorElement.scrollIntoView({ behavior: "smooth", block: "end" });
			}
		}
	}, [prositState]);

	return (
		<div className="h-full w-full flex overflow-hidden">
			<div className="flex flex-col gap-6">
				<Title order={1}>Prosit : {prositState.titre}</Title>

				<div className="flex gap-2 overflow-hidden">
					{numberOfViews < maxNumberOfViews && prositState.touched && (
						<div
							className="fixed flex items-center group top-0 bottom-0 right-0 p-3 cursor-pointer"
							onClick={() => {
								if (numberOfViews >= maxNumberOfViews) return;
								setNumberOfViews((prev) => prev + 1);
							}}
						>
							<ActionIcon size="xl" variant="subtle">
								<Plus size={40} />
							</ActionIcon>
						</div>
					)}

					<div className="flex overflow-auto">
						{Array.from({ length: numberOfViews }).map((_, index) => (
							<>
								{index !== 0 && prositState.touched && (
									<div className="flex flex-col items-center justify-center gap-3">
										<Divider
											mx="lg"
											size="lg"
											className="h-2/5"
											orientation="vertical"
										/>
										<Tooltip
											color="red"
											label="Fermer la vue supplémentaire"
											position="left"
											withArrow
										>
											<ActionIcon
												color="red"
												onClick={() => {
													setNumberOfViews((prev) => prev - 1);
												}}
											>
												<X />
											</ActionIcon>
										</Tooltip>
										<Divider
											mx="lg"
											size="lg"
											className="h-2/5"
											orientation="vertical"
										/>
									</div>
								)}

								<Presentation
									className="flex-1"
									prosit={prositState}
									key={prositState.titre + index}
									anchor={index === 0}
								/>
							</>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
