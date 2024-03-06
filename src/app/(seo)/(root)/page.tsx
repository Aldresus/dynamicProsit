"use client";

import { globalHotKeys } from "@/components/globalHotKeys";
import PrositContext from "@/components/prositContext";
import useNavigator from "@/hooks/useNavigator";
import { AnchorsKeys } from "@/types/anchors";
import { Prosit } from "@/types/prosit";
import { TextInput, Textarea, Title } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useContext } from "react";

export default function Home() {
	const { prosit, setProsit } = useContext(PrositContext);
	const { navigate } = useNavigator({ prosit, setProsit });
	// biome-ignore lint/suspicious/noExplicitAny: issue with Mantine types
	const pageHotkeys: any[] = [
		["ctrl+enter", () => navigate(AnchorsKeys.MOTSCLEFS)],
		["ctrl+shift+enter", () => navigate(AnchorsKeys.PLANDACTION)],
	];

	useHotkeys(pageHotkeys);

	const hotkeys = getHotkeyHandler([
		...globalHotKeys(navigate),
		...pageHotkeys,
	]);

	//todo add a call to action so the user know that the presentation mode exist

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				navigate(AnchorsKeys.MOTSCLEFS);
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
					value={prosit.titre}
					onInput={(event) => {
						setProsit({
							...prosit,
							// @ts-ignore
							titre: event.target.value,
						} as Prosit);
					}}
					onKeyDown={hotkeys}
				/>
				<TextInput
					type="url"
					label="Lien vers le prosit"
					placeholder="https://hugochampy.fr"
					value={prosit.lien}
					onInput={(event) => {
						// @ts-ignore
						setProsit({
							...prosit,
							// @ts-ignore
							lien: event.target.value,
						} as Prosit);
					}}
					onKeyDown={hotkeys}
				/>
				<TextInput
					required
					label="Généralisation"
					placeholder="pasteurisation, vol"
					value={prosit.generalisation}
					onInput={(event) => {
						setProsit({
							...prosit,
							// @ts-ignore
							generalisation: event.target.value,
						} as Prosit);
					}}
					onKeyDown={hotkeys}
				/>
				<Textarea
					required
					label="Contexte"
					placeholder="Quelqu'un à volé mon fromage, je dois faire un algorithme en python pour savoir qui est le voleur"
					value={prosit.contexte}
					onInput={(event) => {
						setProsit({
							...prosit,
							// @ts-ignore
							contexte: event.target.value,
						} as Prosit);
					}}
					autosize
					minRows={2}
					maxRows={6}
					onKeyDown={hotkeys}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex gap-3">
					<TextInput
						className="flex-1"
						label="Animateur"
						placeholder="Pierre"
						value={prosit.animateur}
						onInput={(event) => {
							setProsit({
								...prosit,
								// @ts-ignore
								animateur: event.target.value,
							} as Prosit);
						}}
						onKeyDown={hotkeys}
					/>
					<TextInput
						className="flex-1"
						label="Scribe"
						placeholder="Paul"
						value={prosit.scribe}
						onInput={(event) => {
							setProsit({
								...prosit,
								// @ts-ignore
								scribe: event.target.value,
							} as Prosit);
						}}
						onKeyDown={hotkeys}
					/>
				</div>
				<div className="flex gap-3">
					<TextInput
						className="flex-1"
						label="Gestionnaire"
						placeholder="Jacques"
						value={prosit.gestionnaire}
						onInput={(event) => {
							setProsit({
								...prosit,
								// @ts-ignore
								gestionnaire: event.target.value,
							} as Prosit);
						}}
						onKeyDown={hotkeys}
					/>
					<TextInput
						className="flex-1"
						label="Secrétaire"
						placeholder="Jeanne, elle est où Jeanne ?"
						value={prosit.secretaire}
						onInput={(event) => {
							setProsit({
								...prosit,
								// @ts-ignore
								secretaire: event.target.value,
							} as Prosit);
						}}
						onKeyDown={hotkeys}
					/>
					{/*  todo pass the hotkeys by the context*/}

					<input type="submit" hidden />
				</div>
			</div>
		</form>
	);
}
