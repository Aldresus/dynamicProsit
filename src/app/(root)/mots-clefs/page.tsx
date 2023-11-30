"use client";

import EditableItemList from "@/components/editableItemList";
import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import { Button, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function MotsClefs() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [keyword, setKeyword] = useState("");
	const [keywords, setKeywords] = useState<string[]>([]);

	useEffect(() => {
		setKeywords(prosit.motsCles);
	}, [prosit]);

	const router = useRouter();

	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => router.push("/contraintes")],
		["ctrl+shift+enter", () => router.push("/")],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		["enter", () => keywordHandler()],
		["shift+enter", () => keywordHandler()],
		...globalHotKeys(router),
		...pageHotkeys,
	]);

	const keywordHandler = () => {
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
				onSubmit={(event) => {
					event.preventDefault();
					keywordHandler();
				}}
				className="flex gap-2 items-end"
			>
				<Textarea
					name="motClef"
					onKeyDown={hotkeys}
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
						event.preventDefault();
						keywordHandler();
					}}
				>
					Ajouter le mot clef
				</Button>
			</form>

			<EditableItemList
				id={"motsCles"}
				items={keywords}
				onEdit={(newValue, index) => {
					const temp = [...prosit.motsCles];
					temp[index] = newValue;
					setProsit({ ...prosit, motsCles: [...temp] });
				}}
				onDelete={(index) => {
					const temp = [...prosit.motsCles];
					temp.splice(index, 1);
					setProsit({
						...prosit,
						motsCles: [...temp],
					});
				}}
			/>
		</div>
	);
}
