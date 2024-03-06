import { Prosit } from "@/types/prosit";
import { Box, Group, Stack } from "@mantine/core";
import { twMerge } from "tailwind-merge";
import PresentationElement from "./presentationElement";

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
            title="Contexte :"
            anchor={anchor ? "contexte" : undefined}
            items={prosit.contexte}
            className={twMerge(
              prosit.contexte.length === 0 ? "opacity-0" : "opacity-100",
            )}
          />
          <PresentationElement
            anchor={anchor ? "generalisation" : undefined}
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
              anchor={anchor ? "motsClefs" : undefined}
              title="Mots-clefs :"
              items={prosit.motsCles.map((value) => value.content)}
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
              title="Contraintes :"
              items={prosit.contraintes.map((value) => value.content)}
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
              title="Problematiques :"
              items={prosit.problematiques.map((value) => value.content)}
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
              title="Pistes de solution :"
              items={prosit.pistesDeSolutions.map((value) => value.content)}
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
              title="Livrables :"
              items={prosit.livrables.map((value) => value.content)}
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
              title="Plan d'action :"
              items={prosit.planDAction.map((value) => value.content)}
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
