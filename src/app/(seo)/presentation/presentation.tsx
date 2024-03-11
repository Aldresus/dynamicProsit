import { Prosit } from "@/types/prosit";
import { Box, Group, Stack } from "@mantine/core";
import { twMerge } from "tailwind-merge";
import PresentationElement from "./presentationElement";
import { Anchors } from "@/types/anchors";
import { Anchor } from "lucide-react";

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
					id={anchor ? Anchors.INFORMATIONS : undefined}
					className={twMerge("flex flex-col gap-6 rounded-xl")}
					bg={
						anchor && Anchors[prosit.currentAnchor] === Anchors.INFORMATIONS
							? "blue.1"
							: undefined
					}
					c={
						anchor && Anchors[prosit.currentAnchor] === Anchors.INFORMATIONS
							? "blue.9"
							: undefined
					}
				>
					<PresentationElement
						title="Contexte :"
						items={prosit.contexte}
						className={twMerge(
							prosit.contexte.length === 0 ? "opacity-0" : "opacity-100",
						)}
					/>
					<PresentationElement
						title="Generalisation :"
						items={prosit.generalisation}
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
							anchor={anchor ? Anchors.MOTS_CLEFS : undefined}
							title="Mots-clefs :"
							items={prosit.motsCles.map((value) => value.content)}
							bg={
								anchor && Anchors[prosit.currentAnchor] === Anchors.MOTS_CLEFS
									? "blue.1"
									: undefined
							}
							color={
								anchor && Anchors[prosit.currentAnchor] === Anchors.MOTS_CLEFS
									? "blue.9"
									: undefined
							}
							className={twMerge(
								prosit.motsCles.length === 0 ? "opacity-0" : "opacity-100",
							)}
						/>
						<PresentationElement
							anchor={anchor ? Anchors.CONTRAINTES : undefined}
							title="Contraintes :"
							items={prosit.contraintes.map((value) => value.content)}
							className={twMerge(
								prosit.contraintes.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={
								anchor && Anchors[prosit.currentAnchor] === Anchors.CONTRAINTES
									? "blue.1"
									: undefined
							}
							color={
								anchor && Anchors[prosit.currentAnchor] === Anchors.CONTRAINTES
									? "blue.9"
									: undefined
							}
						/>
					</Stack>
					<Stack>
						<PresentationElement
							anchor={anchor ? Anchors.PROBLEMATIQUES : undefined}
							title="Problematiques :"
							items={prosit.problematiques.map((value) => value.content)}
							className={twMerge(
								prosit.problematiques.length === 0
									? "opacity-0"
									: "opacity-100",
							)}
							bg={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PROBLEMATIQUES
									? "blue.1"
									: undefined
							}
							color={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PROBLEMATIQUES
									? "blue.9"
									: undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? Anchors.PISTES_DE_SOLUTION : undefined}
							title="Pistes de solution :"
							items={prosit.pistesDeSolutions.map((value) => value.content)}
							className={twMerge(
								prosit.pistesDeSolutions.length === 0
									? "opacity-0"
									: "opacity-100",
							)}
							bg={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PISTES_DE_SOLUTION
									? "blue.1"
									: undefined
							}
							color={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PISTES_DE_SOLUTION
									? "blue.9"
									: undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? Anchors.LIVRABLES : undefined}
							title="Livrables :"
							items={prosit.livrables.map((value) => value.content)}
							className={twMerge(
								prosit.livrables.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={
								anchor && Anchors[prosit.currentAnchor] === Anchors.LIVRABLES
									? "blue.1"
									: undefined
							}
							color={
								anchor && Anchors[prosit.currentAnchor] === Anchors.LIVRABLES
									? "blue.9"
									: undefined
							}
						/>
						<PresentationElement
							anchor={anchor ? Anchors.PLAN_D_ACTION : undefined}
							ordered
							title="Plan d'action :"
							items={prosit.planDAction.map((value) => value.content)}
							className={twMerge(
								"pb-20",
								prosit.planDAction.length === 0 ? "opacity-0" : "opacity-100",
							)}
							bg={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PLAN_D_ACTION
									? "blue.1"
									: undefined
							}
							color={
								anchor &&
								Anchors[prosit.currentAnchor] === Anchors.PLAN_D_ACTION
									? "blue.9"
									: undefined
							}
						/>
					</Stack>
				</Group>
			</div>
		</Box>
	);
}
