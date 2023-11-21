"use client";

import { Button, Textarea, Title } from "@mantine/core";
import React, { useContext, useState } from "react";
import PrositContext from "@/components/prositContext";

export default function MotsClefs() {
  const { prosit, setProsit } = useContext(PrositContext);
  const [keyword, setKeyword] = useState("");

  const keywordHandler = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    // setKeywords([...keywords, keyword]);
    setProsit({
      ...prosit,
      motsCles: [...prosit.motsCles, keyword],
    });
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
        {prosit.motsCles?.map((value, index) => (
          <div className="group flex items-center gap-2" key={value + index}>
            <Title order={3}>- {value}</Title>
            <div className="flex group gap-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-100">
              <Button
                variant="transparent"
                size="compact-md"
                color="red"
                onClick={() => {
                  let temp = [...prosit.motsCles];
                  temp.splice(index, 1);
                  setProsit({
                    ...prosit,
                    motsCles: [...temp],
                  });
                }}
              >
                Supprimer
              </Button>
              <Button
                onClick={() => {
                  let temp = [...prosit.motsCles];
                  setKeyword(temp.splice(index, 1)[0]);
                  setProsit({
                    ...prosit,
                    motsCles: [...temp],
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
