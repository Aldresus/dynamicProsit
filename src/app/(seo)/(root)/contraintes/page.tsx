"use client";

import EditableItemList from "@/components/editableItemList";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import { Button, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Contraintes() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [contraintes, setContraintes] = useState<string[]>([]);
	const [contrainte, setContrainte] = useState("");

	useEffect(() => {
		setContraintes(prosit.contraintes);
	}, [prosit]);

	const router = useRouter();

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
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
		if (contrainte.trim() === "") return;
		setProsit({
			...prosit,
			contraintes: [...prosit.contraintes, contrainte],
		});
		setContrainte("");
	};

	return (
		<div className="h-full flex flex-col gap-9 py-3">
			{/*  maybe refacto l'input*/}
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
			<EditableItemList
				items={contraintes}
				onEdit={(newValue, index) => {
					const temp = [...prosit.contraintes];
					temp[index] = newValue;
					setProsit({ ...prosit, contraintes: [...temp] });
				}}
				onDelete={(index) => {
					const temp = [...prosit.contraintes];
					setContrainte(temp.splice(index, 1)[0]);
					setProsit({ ...prosit, contraintes: [...temp] });
				}}
			/>
		</div>
	);
}
