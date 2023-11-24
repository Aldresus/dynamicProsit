"use client";

import { Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import PresentationElement from "@/app/presentation/presentationElement";

export default function Visualisation() {
  const { prosit, setProsit } = useContext(PrositContext);
  const [prositState, setPrositState] = useState<Prosit>(defaultPrositValue);

  useEffect(() => {
    setPrositState(prosit);
    console.log("fgsdhsdsfhs", prosit);
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
    <div className="h-full flex flex-col gap-6">
      <Title order={1}>Prosit : {prositState.titre}</Title>
      <div className="grid grid-cols-2 gap-6">
        <PresentationElement
          titre={"Contexte :"}
          anchor="contexte"
          valeurs={prositState.contexte}
        />
        <PresentationElement
          anchor="generalisation"
          titre={"Generalisation :"}
          valeurs={prositState.generalisation}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 h-full">
        <PresentationElement
          anchor="/mots-clefs"
          titre={"Mots-clefs"}
          valeurs={prositState.motsCles}
        ></PresentationElement>
        <PresentationElement
          anchor="contraintes"
          titre={"Contraintes"}
          valeurs={prositState.contraintes}
        ></PresentationElement>
        <PresentationElement
          anchor="problematiques"
          titre={"Problematiques"}
          valeurs={prositState.problematiques}
        ></PresentationElement>
        <PresentationElement
          anchor="pisteDeSolutions"
          titre={"Pistes de solution"}
          valeurs={prositState.pistesDeSolutions}
        ></PresentationElement>
        <PresentationElement
          anchor="Livrables"
          titre={"Livrables"}
          valeurs={prositState.livrables}
        ></PresentationElement>

        <PresentationElement
          anchor="/plan-d-action"
          titre={"Plan d'action :"}
          valeurs={prositState.planDAction.map((value) => value.content)}
        ></PresentationElement>
      </div>
    </div>
  );
}
