"use client";

import EditableItemList from "@/components/editableItemList";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import { Button, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Pistes() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [pisteDeSolution, setPisteDeSolution] = useState("");
	const [pistesDeSolutions, setPistesDeSolutions] = useState<string[]>([]);
	const router = useRouter();

	useEffect(() => {
		setPistesDeSolutions(prosit.pistesDeSolutions);
	}, [prosit]);

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => router.push("/livrables")],
		["ctrl+shift+enter", () => router.push("/problematiques")],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		["enter", () => pisteHandler()],
		["shift+enter", () => pisteHandler()],
		...globalHotKeys(router),
		...pageHotkeys,
	]);

	const pisteHandler = () => {
		if (pisteDeSolution.trim() === "") return;
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
				onSubmit={(event) => {
					event.preventDefault();
					pisteHandler();
				}}
				className="flex gap-2 items-end"
			>
				<Textarea
					onKeyDown={hotkeys}
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
						event.preventDefault();
						pisteHandler();
					}}
				>
					Ajouter la piste
				</Button>
			</form>

			<EditableItemList
				items={pistesDeSolutions}
				onEdit={(newValue, index) => {
					const temp = [...prosit.pistesDeSolutions];
					temp[index] = newValue;
					setProsit({ ...prosit, pistesDeSolutions: [...temp] });
				}}
				onDelete={(index) => {
					const temp = [...prosit.pistesDeSolutions];
					temp.splice(index, 1);

					setProsit({
						...prosit,
						pistesDeSolutions: [...temp],
					});
				}}
			/>
		</div>
	);
}
