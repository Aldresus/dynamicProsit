"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import PrositContext from "@/components/prositContext";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { globalHotKeys } from "@/components/globalHotKeys";

export default function Contraintes() {
  const { prosit, setProsit } = useContext(PrositContext);
  const [contraintes, setContraintes] = useState<string[]>([]);
  const [contrainte, setContrainte] = useState("");

  useEffect(() => {
    setContraintes(prosit.contraintes);
  }, [prosit]);

  const router = useRouter();

  const pageHotkeys: any[] = [
    ["ctrl+enter", () => router.push("/problematiques")],
    ["ctrl+shift+enter", () => router.push("/mots-clefs")],
  ];

  useHotkeys(pageHotkeys);

  const hotkeys = getHotkeyHandler([
    ["enter", () => contrainteHandler()],
    ["shift+enter", () => contrainteHandler()],
    ...globalHotKeys(router),
    ...pageHotkeys,
  ]);
  const contrainteHandler = () => {
    setProsit({
      ...prosit,
      contraintes: [...prosit.contraintes, contrainte],
    });
    setContrainte("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Contraintes</Title>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          contrainteHandler();
        }}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={hotkeys}
          className="flex-1"
          autoFocus
          label="Contrainte"
          placeholder="Le fromage doit être retrouvé avant de pourrir"
          value={contrainte}
          onInput={(event) => {
            // @ts-ignore
            setContrainte(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            contrainteHandler();
          }}
        >
          Ajouter la contrainte
        </Button>
      </form>

      <div className="px-6">
        {contraintes.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  const temp = [...prosit.contraintes];
                  temp.splice(index, 1);
                  setProsit({ ...prosit, contraintes: [...temp] });
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  const temp = [...prosit.contraintes];
                  setContrainte(temp.splice(index, 1)[0]);
                  setProsit({ ...prosit, contraintes: [...temp] });
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
