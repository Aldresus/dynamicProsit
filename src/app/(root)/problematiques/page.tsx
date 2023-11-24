"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import PrositContext from "@/components/prositContext";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { globalHotKeys } from "@/components/globalHotKeys";

export default function Problematiques() {
  const { prosit, setProsit } = useContext(PrositContext);
  const [problematique, setProblematique] = useState("");
  const [problematiques, setProblematiques] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setProblematiques(prosit.problematiques);
  }, [prosit]);

  const pageHotkeys: any[] = [
    ["ctrl+enter", () => router.push("/pistes-de-solution")],
    ["ctrl+shift+enter", () => router.push("/contraintes")],
  ];

  useHotkeys(pageHotkeys);

  const hotkeys = getHotkeyHandler([
    ["enter", () => problematiqueHandler()],
    ["shift+enter", () => problematiqueHandler()],
    ...globalHotKeys(router),
    ...pageHotkeys,
  ]);

  const problematiqueHandler = () => {
    setProsit({
      ...prosit,
      problematiques: [...prosit.problematiques, problematique],
    });
    setProblematique("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Problématiques</Title>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          problematiqueHandler();
        }}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={hotkeys}
          className="flex-1"
          autoFocus
          label="Problématique"
          placeholder="Comment trouver le voleur de fromage ?"
          value={problematique}
          onInput={(event) => {
            // @ts-ignore
            setProblematique(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            problematiqueHandler();
          }}
        >
          Ajouter la problématique
        </Button>
      </form>

      <div className="px-6">
        {problematiques.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...prosit.problematiques];
                  temp.splice(index, 1);
                  setProsit({ ...prosit, problematiques: [...temp] });
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...prosit.problematiques];
                  setProblematique(temp.splice(index, 1)[0]);
                  setProsit({ ...prosit, problematiques: [...temp] });
                }}
                size="compact-md"
              >
                Editer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
