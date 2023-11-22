"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import PrositContext from "@/components/prositContext";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { globalHotKeys } from "@/components/globalHotKeys";

export default function Livrables() {
  const { prosit, setProsit } = useContext(PrositContext);
  const [livrables, setLivrables] = useState<string[]>([]);
  const [livrable, setLivrable] = useState("");

  useEffect(() => {
    setLivrables(prosit.livrables);
  }, [prosit]);

  const router = useRouter();

  const pageHotkeys: any[] = [
    ["ctrl+enter", () => router.push("/plan-d-action")],
    ["ctrl+shift+enter", () => router.push("/pistes-de-solution")],
  ];

  useHotkeys(pageHotkeys);

  const hotkeys = getHotkeyHandler([
    ["enter", () => livrableHandler()],
    ["shift+enter", () => livrableHandler()],
    ...globalHotKeys(router),
    ...pageHotkeys,
  ]);
  const livrableHandler = () => {
    setProsit({
      ...prosit,
      livrables: [...prosit.livrables, livrable],
    });
    setLivrable("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Livrables</Title>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          livrableHandler();
        }}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={hotkeys}
          className="flex-1"
          autoFocus
          label="Livrable"
          placeholder="Un rapport de 10 pages sur le voleur de fromage, son histoire, ses motivations, et comment il a fait pour voler le fromage"
          value={livrable}
          onInput={(event) => {
            // @ts-ignore
            setLivrable(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            livrableHandler();
          }}
        >
          Ajouter le livrable
        </Button>
      </form>

      <div className="px-6">
        {livrables.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...prosit.livrables];
                  temp.splice(index, 1);
                  setProsit({ ...prosit, livrables: [...temp] });
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...prosit.livrables];
                  setLivrable(temp.splice(index, 1)[0]);
                  setProsit({ ...prosit, livrables: [...temp] });
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
