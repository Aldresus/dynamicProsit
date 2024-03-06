import { Group, Stack, Box } from "@mantine/core";
import PresentationElement from "./presentationElement";
import { Prosit } from "@/types/prosit";
import { twMerge } from "tailwind-merge";

interface PresentationProps extends React.HTMLAttributes<HTMLDivElement> {
	prosit: Prosit;
	anchor?: boolean;
}

export default function Presentation({
	prosit,
	anchor = false,
	...props
}: PresentationProps) {
	return (
		<Box {...props}>
			<div className="h-full w-full flex flex-col gap-6 overflow-y-scroll overflow-x-hidden ">
				<Box
					id={anchor ? "informations" : undefined}
					className={twMerge("flex flex-col gap-6 rounded-xl")}
					bg={
						anchor && prosit.currentAnchor === "informations"
							? "blue.1"
							: undefined
					}
					c={
						anchor && prosit.currentAnchor === "informations"
							? "blue.9"
							: undefined
					}
				>
					<PresentationElement
						titre={"Contexte :"}
						anchor={anchor ? "contexte" : undefined}
						valeurs={prosit.contexte}
						className={twMerge(
							prosit.contexte.length === 0 ? "opacity-0" : "opacity-100",
						)}
					/>
					<PresentationElement
						anchor={anchor ? "generalisation" : undefined}
						titre={"Generalisation :"}
						valeurs={prosit.generalisation}
						className={twMerge(
							prosit.generalisation.length === 0 ? "opacity-0" : "opacity-100",
						)}
					/>
				</Box>
				<Group dir="row">
					<Stack
						gap="md"
						className="w-full whitespace-break-spaces overflow-hidden"
					>
						<PresentationElement
							anchor={anchor ? "motsClefs" : undefined}
							titre={"Mots-clefs"}
							valeurs={prosit.motsCles}
							bg={
								anchor && prosit.currentAnchor === "motsClefs"
									? "blue.1"
									: undefined
							}
							color={
								anchor && prosit.currentAnchor === "motsClefs"
									? "blue.9"
									: undefined
							}
							className={twMerge(
								prosit.motsCles.length === 0 ? "opacity-0" : "opacity-100",
							)}
						/>
						<PresentationElement
							anchor={anchor ? "contraintes" : undefined}
							titre={"Contraintes"}
							valeurs={prosit.contraintes}
							className={twMerge(
								prosit.contraintes.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={
								anchor && prosit.currentAnchor === "contraintes"
									? "blue.1"
									: undefined
							}
							color={
								prosit.currentAnchor === "contraintes" ? "blue.9" : undefined
							}
						/>
					</Stack>
					<Stack>
						<PresentationElement
							anchor={anchor ? "problematiques" : undefined}
							titre={"Problematiques"}
							valeurs={prosit.problematiques}
							className={twMerge(
								prosit.problematiques.length === 0
									? "opacity-0"
									: "opacity-100",
							)}
							bg={
								prosit.currentAnchor === "problematiques" ? "blue.1" : undefined
							}
							color={
								prosit.currentAnchor === "problematiques" ? "blue.9" : undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? "pistesDeSolution" : undefined}
							titre={"Pistes de solution"}
							valeurs={prosit.pistesDeSolutions}
							className={twMerge(
								prosit.pistesDeSolutions.length === 0
									? "opacity-0"
									: "opacity-100",
							)}
							bg={
								prosit.currentAnchor === "pistesDeSolution"
									? "blue.1"
									: undefined
							}
							color={
								prosit.currentAnchor === "pistesDeSolution"
									? "blue.9"
									: undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? "livrables" : undefined}
							titre={"Livrables"}
							valeurs={prosit.livrables}
							className={twMerge(
								prosit.livrables.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={prosit.currentAnchor === "livrables" ? "blue.1" : undefined}
							color={
								prosit.currentAnchor === "livrables" ? "blue.9" : undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? "planDAction" : undefined}
							ordered
							titre={"Plan d'action :"}
							valeurs={prosit.planDAction.map((value) => value.content)}
							className={twMerge(
								"pb-20",
								prosit.planDAction.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={prosit.currentAnchor === "planDAction" ? "blue.1" : undefined}
							color={
								prosit.currentAnchor === "planDAction" ? "blue.9" : undefined
							}
						/>
					</Stack>
				</Group>
			</div>
		</Box>
	);
}
