"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useState } from "react";

export default function Livrables() {
  const [livrables, setLivrables] = useState<string[]>(["test"]);
  const [livrable, setLivrable] = useState("");

  const livrableHandler = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    setLivrables([...livrables, livrable]);
    setLivrable("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Livrables</Title>

      <form
        onSubmit={(event) => livrableHandler(event)}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              //method to prevent from default behaviour
              e.preventDefault();
              livrableHandler(e);
            }
          }}
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
            livrableHandler(event);
          }}
        >
          Ajouter le livrable
        </Button>
      </form>

      <div className="px-6">
        {livrables?.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...livrables];
                  temp.splice(index, 1);
                  setLivrables([...temp]);
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...livrables];
                  setLivrable(temp.splice(index, 1)[0]);
                  setLivrables([...temp]);
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
