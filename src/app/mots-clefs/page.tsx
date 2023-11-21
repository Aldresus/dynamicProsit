"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useState } from "react";

export default function MotsClefs() {
  const [keywords, setKeywords] = useState<string[]>(["test"]);
  const [keyword, setKeyword] = useState("");

  const keywordHandler = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    setKeywords([...keywords, keyword]);
    setKeyword("");
  };

  return (
    <div className="h-full flex flex-col gap-9 py-3">
      <Title order={2}>Mots clefs</Title>

      <form
        onSubmit={(event) => keywordHandler(event)}
        className="flex gap-2 items-end"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              //method to prevent from default behaviour
              e.preventDefault();
              keywordHandler(e);
            }
          }}
          className="flex-1"
          autoFocus
          label="Mot clef"
          placeholder="fromage"
          value={keyword}
          onInput={(event) => {
            // @ts-ignore
            setKeyword(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={(event) => {
            keywordHandler(event);
          }}
        >
          Ajouter le mot clef
        </Button>
      </form>

      <div className="px-6">
        {keywords?.map((value, index) => (
          <div className="group flex items-center gap-2" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...keywords];
                  temp.splice(index, 1);
                  setKeywords([...temp]);
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...keywords];
                  setKeyword(temp.splice(index, 1)[0]);
                  setKeywords([...temp]);
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
