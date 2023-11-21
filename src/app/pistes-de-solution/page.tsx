"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useState } from "react";
import PrositContext from "@/components/prositContext";

export default function Pistes() {
  const { prosit, setProsit } = useContext(PrositContext);

  const [pisteDeSolution, setPisteDeSolution] = useState("");

  const pisteHandler = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    setProsit({
      ...prosit,
      pistesDeSolutions: [...prosit.pistesDeSolutions, pisteDeSolution],
    });
    setPisteDeSolution("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Pistes de solution</Title>

      <form
        onSubmit={(event) => pisteHandler(event)}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              //method to prevent from default behaviour
              e.preventDefault();
              pisteHandler(e);
            }
          }}
          className="flex-1"
          autoFocus
          label="Piste de solution"
          placeholder="Il faut faire un algorithme de recherche de fromage avec python"
          value={pisteDeSolution}
          onInput={(event) => {
            // @ts-ignore
            setPisteDeSolution(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            pisteHandler(event);
          }}
        >
          Ajouter la piste
        </Button>
      </form>

      <div className="px-6">
        {prosit.pistesDeSolutions?.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...prosit.pistesDeSolutions];
                  temp.splice(index, 1);

                  setProsit({
                    ...prosit,
                    pistesDeSolutions: [...temp],
                  });
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...prosit.pistesDeSolutions];
                  setPisteDeSolution(temp.splice(index, 1)[0]);
                  setProsit({
                    ...prosit,
                    pistesDeSolutions: [...temp],
                  });
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
