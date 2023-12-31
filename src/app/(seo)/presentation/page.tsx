"use client";

import PresentationElement from "@/app/(seo)/presentation/presentationElement";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import { Box, Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Visualisation() {
	const { prosit } = useContext(PrositContext);
	const [prositState, setPrositState] = useState<Prosit>(defaultPrositValue);

	useEffect(() => {
		setPrositState(prosit);
	}, [prosit]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("storage", () => {
			const storedProsit = localStorage.getItem("prosit");
			const parsedProsit = storedProsit
				? JSON.parse(storedProsit)
				: defaultPrositValue;
			setPrositState(parsedProsit);
		});
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined")
			window.document
				.getElementById(prositState.currentAnchor)
				?.scrollIntoView({
					block: "start",
					behavior: "smooth",
				});
	}, [prositState.currentAnchor]);

	return (
		<div className="h-full w-full flex flex-col gap-6">
			<Title order={1}>Prosit : {prositState.titre}</Title>
			<Box
				id="informations"
				className={twMerge("flex flex-col gap-6 rounded-xl")}
				bg={prositState.currentAnchor === "informations" ? "blue.1" : undefined}
				c={prositState.currentAnchor === "informations" ? "blue.9" : undefined}
			>
				<PresentationElement
					titre={"Contexte :"}
					anchor="contexte"
					valeurs={prositState.contexte}
					className={twMerge(
						prositState.contexte.length === 0 ? "opacity-0" : "opacity-100",
					)}
				/>
				<PresentationElement
					anchor="generalisation"
					titre={"Generalisation :"}
					valeurs={prositState.generalisation}
					className={twMerge(
						prositState.generalisation.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
				/>
			</Box>
			<div className="flex flex-col gap-9 w-full h-full whitespace-break-spaces overflow-hidden">
				<PresentationElement
					anchor="motsClefs"
					titre={"Mots-clefs"}
					valeurs={prositState.motsCles}
					bg={prositState.currentAnchor === "motsClefs" ? "blue.1" : undefined}
					color={
						prositState.currentAnchor === "motsClefs" ? "blue.9" : undefined
					}
					className={twMerge(
						prositState.motsCles.length === 0 ? "opacity-0" : "opacity-100",
					)}
				/>
				<PresentationElement
					anchor="contraintes"
					titre={"Contraintes"}
					valeurs={prositState.contraintes}
					className={twMerge(
						prositState.contraintes.length === 0 ? "opacity-0" : "opacity-100",
					)}
					bg={
						prositState.currentAnchor === "contraintes" ? "blue.1" : undefined
					}
					color={
						prositState.currentAnchor === "contraintes" ? "blue.9" : undefined
					}
				/>
				<PresentationElement
					anchor="problematiques"
					titre={"Problematiques"}
					valeurs={prositState.problematiques}
					className={twMerge(
						prositState.problematiques.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
					bg={
						prositState.currentAnchor === "problematiques"
							? "blue.1"
							: undefined
					}
					color={
						prositState.currentAnchor === "problematiques"
							? "blue.9"
							: undefined
					}
				/>
				<PresentationElement
					anchor="pistesDeSolution"
					titre={"Pistes de solution"}
					valeurs={prositState.pistesDeSolutions}
					className={twMerge(
						prositState.pistesDeSolutions.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
					bg={
						prositState.currentAnchor === "pistesDeSolution"
							? "blue.1"
							: undefined
					}
					color={
						prositState.currentAnchor === "pistesDeSolution"
							? "blue.9"
							: undefined
					}
				/>
				<PresentationElement
					anchor="livrables"
					titre={"Livrables"}
					valeurs={prositState.livrables}
					className={twMerge(
						prositState.livrables.length === 0 ? "opacity-0" : "opacity-100",
					)}
					bg={prositState.currentAnchor === "livrables" ? "blue.1" : undefined}
					color={
						prositState.currentAnchor === "livrables" ? "blue.9" : undefined
					}
				/>
				<PresentationElement
					anchor="planDAction"
					ordered
					titre={"Plan d'action :"}
					valeurs={prositState.planDAction.map((value) => value.content)}
					className={twMerge(
						prositState.planDAction.length === 0 ? "opacity-0" : "opacity-100",
					)}
					bg={
						prositState.currentAnchor === "planDAction" ? "blue.1" : undefined
					}
					color={
						prositState.currentAnchor === "planDAction" ? "blue.9" : undefined
					}
				/>
			</div>
		</div>
	);
}
