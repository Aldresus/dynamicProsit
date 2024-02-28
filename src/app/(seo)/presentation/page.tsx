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
          anchor="contexte"
          title="Contexte :"
          items={prositState.contexte}
          className={twMerge(
            prositState.contexte.length === 0 ? "opacity-0" : "opacity-100",
          )}
        />
        <PresentationElement
          anchor="generalisation"
          title="Generalisation :"
          items={prositState.generalisation}
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
          title="Mots-clefs"
          items={prositState.motsCles.map((item) => item.content)}
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
          title="Contraintes"
          items={prositState.contraintes.map((item) => item.content)}
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
          title="Problematiques"
          items={prositState.problematiques.map((item) => item.content)}
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
          title="Pistes de solution"
          items={prositState.pistesDeSolutions.map((item) => item.content)}
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
          title="Livrables"
          items={prositState.livrables.map((item) => item.content)}
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
          title="Plan d'action :"
          items={prositState.planDAction.map((value) => value.content)}
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
