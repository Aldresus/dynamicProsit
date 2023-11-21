"use client";

import { TextInput, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/mots-clefs");
      }}
      className="h-full flex flex-col gap-9 py-3"
    >
      <Title order={2}>Informations</Title>
      <div className="flex flex-col gap-2">
        <TextInput
          autoFocus
          required
          label="Titre"
          placeholder="Oh non mon fromage !"
        />
        <TextInput
          label="Lien vers le prosit"
          placeholder="https://hugochampy.fr"
        />
        <TextInput
          required
          label="Généralisation"
          placeholder="pasteurisation, vol"
        />
        <TextInput
          required
          label="Contexte"
          placeholder="Quelqu'un à volé mon fromage, je dois faire un algorithme en python pour savoir qui est le voleur"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <TextInput
            className="flex-1"
            label="Animateur"
            placeholder="Pierre"
          />
          <TextInput className="flex-1" label="Scribe" placeholder="Paul" />
        </div>
        <div className="flex gap-3">
          <TextInput
            className="flex-1"
            label="Gestionnaire"
            placeholder="Jacques"
          />
          <TextInput
            className="flex-1"
            label="Secrétaire"
            placeholder="Jeanne, elle est où Jeanne ?"
          />
          <input type="submit" hidden />
        </div>
      </div>
    </form>
  );
}
