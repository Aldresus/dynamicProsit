"use client";

import { Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import PresentationElement from "@/app/presentation/presentationElement";
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

			let parsedProsit = storedProsit
				? JSON.parse(storedProsit)
				: defaultPrositValue;
			setPrositState(parsedProsit);
			// ...
		});
	}, []);

	return (
		<div className="h-full w-full  flex flex-col gap-6">
			<div className="grid grid-cols-6 gap-6">
				<Title order={1}>Prosit : {prositState.titre}</Title>
				<PresentationElement
					titre={"Contexte :"}
					anchor="contexte"
					valeurs={prositState.contexte}
					className={twMerge(
						"col-span-3",
						prositState.contexte.length === 0 ? "opacity-0" : "opacity-100",
					)}
				/>
				<PresentationElement
					anchor="generalisation"
					titre={"Generalisation :"}
					valeurs={prositState.generalisation}
					className={twMerge(
						"col-span-2",
						prositState.generalisation.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
				/>
			</div>
			<div className="flex flex-col flex-wrap gap-9 w-full h-full whitespace-break-spaces overflow-hidden">
				<PresentationElement
					anchor="/mots-clefs"
					titre={"Mots-clefs"}
					valeurs={prositState.motsCles}
					className={twMerge(
						prositState.motsCles.length === 0 ? "opacity-0" : "opacity-100",
					)}
				></PresentationElement>
				<PresentationElement
					anchor="contraintes"
					titre={"Contraintes"}
					valeurs={prositState.contraintes}
					className={twMerge(
						prositState.contraintes.length === 0 ? "opacity-0" : "opacity-100",
					)}
				></PresentationElement>
				<PresentationElement
					anchor="problematiques"
					titre={"Problematiques"}
					valeurs={prositState.problematiques}
					className={twMerge(
						prositState.problematiques.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
				></PresentationElement>
				<PresentationElement
					anchor="pisteDeSolutions"
					titre={"Pistes de solution"}
					valeurs={prositState.pistesDeSolutions}
					className={twMerge(
						prositState.pistesDeSolutions.length === 0
							? "opacity-0"
							: "opacity-100",
					)}
				></PresentationElement>
				<PresentationElement
					anchor="Livrables"
					titre={"Livrables"}
					valeurs={prositState.livrables}
					className={twMerge(
						prositState.livrables.length === 0 ? "opacity-0" : "opacity-100",
					)}
				></PresentationElement>
				<PresentationElement
					anchor="/plan-d-action"
					titre={"Plan d'action :"}
					valeurs={prositState.planDAction.map((value) => value.content)}
					className={twMerge(
						prositState.planDAction.length === 0 ? "opacity-0" : "opacity-100",
					)}
				></PresentationElement>
			</div>
		</div>
	);
}
