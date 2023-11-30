"use client";

import EditableItemList from "@/components/editableItemList";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import { Button, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Problematiques() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [problematique, setProblematique] = useState("");
	const [problematiques, setProblematiques] = useState<string[]>([]);
	const router = useRouter();

	useEffect(() => {
		setProblematiques(prosit.problematiques);
	}, [prosit]);

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
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
					name="problematique"
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

			<EditableItemList
				id={"problematiques"}
				items={problematiques}
				onEdit={(newValue, index) => {
					const temp = [...prosit.problematiques];
					temp[index] = newValue;
					setProsit({ ...prosit, problematiques: [...temp] });
				}}
				onDelete={(index) => {
					const temp = [...prosit.problematiques];
					temp.splice(index, 1);
					setProsit({ ...prosit, problematiques: [...temp] });
				}}
			/>
		</div>
	);
}
