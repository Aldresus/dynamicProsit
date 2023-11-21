"use client";

import { Button, Textarea, Title } from "@mantine/core";
import { useState } from "react";

export default function Problematiques() {
  const [problematiques, setProblematiques] = useState<string[]>(["test"]);
  const [problematique, setProblematique] = useState("");

  const problematiqueHandler = (event) => {
    event.preventDefault();
    setProblematiques([...problematiques, problematique]);
    setProblematique("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Problématiques</Title>
      <form
        onSubmit={(event) => problematiqueHandler(event)}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              //method to prevent from default behaviour
              e.preventDefault();
              problematiqueHandler(e);
            }
          }}
          className="flex-1"
          autoFocus
          label="Problématique"
          placeholder="Comment trouver le voleur de fromage ?"
          value={problematique}
          onInput={(event) => {
            console.log(event.target.value);
            setProblematique(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            problematiqueHandler(event);
          }}
        >
          Ajouter le mot clef
        </Button>
      </form>

      <div className="px-6">
        {problematiques?.map((value, index) => (
          <div className="group flex items-center gap-1" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...problematiques];
                  temp.splice(index, 1);
                  setProblematiques([...temp]);
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...problematiques];
                  setProblematique(temp.splice(index, 1)[0]);
                  setProblematiques([...temp]);
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
