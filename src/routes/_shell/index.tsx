import { Field, Input, Textarea } from "@aldresus/design-system";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { TextField } from "../../domain/prosit";
import { useProsit } from "../../prosit-store";
import { useStepKeyDown } from "../../shortcuts";

export const Route = createFileRoute("/_shell/")({
	component: Informations,
});

const ROLES: { field: TextField; label: string; placeholder: string }[] = [
	{ field: "animateur", label: "Animateur", placeholder: "Pierre" },
	{ field: "scribe", label: "Scribe", placeholder: "Paul" },
	{ field: "gestionnaire", label: "Gestionnaire", placeholder: "Jacques" },
	{
		field: "secretaire",
		label: "Secrétaire",
		placeholder: "Jeanne, elle est où Jeanne ?",
	},
];

function Informations() {
	const { prosit, setText } = useProsit();
	const navigate = useNavigate();
	const onKeyDown = useStepKeyDown();

	// Every field is the same three lines; only the wiring differs.
	const bind = (field: TextField) => ({
		value: prosit[field],
		onChange: (event: { currentTarget: { value: string } }) =>
			setText(field, event.currentTarget.value),
		onKeyDown,
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				navigate({ to: "/$section", params: { section: "mots-clefs" } });
			}}
			// A prosit is written as a draft: `Field required` puts a real HTML
			// `required` on the control, which would block Entrée on an empty form.
			// `noValidate` drops the browser's gate and keeps the `*` and the
			// `aria-required` the label carries.
			noValidate
			className="flex flex-col gap-8 py-4"
		>
			<section className="flex flex-col gap-4">
				<h2 className="hcds-heading">Informations</h2>

				<Field label="Titre" required>
					<Input placeholder="Oh non mon fromage !" {...bind("titre")} />
				</Field>

				<Field label="Lien vers le prosit">
					<Input
						type="url"
						placeholder="https://hugochampy.fr"
						{...bind("lien")}
					/>
				</Field>

				<Field label="Généralisation" required>
					<Input
						placeholder="pasteurisation, vol"
						{...bind("generalisation")}
					/>
				</Field>

				<Field label="Contexte" required>
					<Textarea
						autosize
						rows={2}
						maxRows={8}
						placeholder="Quelqu'un a volé mon fromage, je dois écrire un algorithme en python pour trouver qui est le voleur"
						{...bind("contexte")}
					/>
				</Field>
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="hcds-subheading">Rôles</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					{ROLES.map((role) => (
						<Field key={role.field} label={role.label}>
							<Input placeholder={role.placeholder} {...bind(role.field)} />
						</Field>
					))}
				</div>
			</section>

			{/*
				Enter anywhere in the form moves on, and this button is the only thing
				that makes that happen: implicit submission clicks the form's default
				button. `sr-only` rather than `hidden` so it is actually rendered, and
				out of the a11y tree and the tab order — the visible « Étape suivante »
				at the top of the page is the control, this is just its anchor.
			*/}
			<button type="submit" className="sr-only" tabIndex={-1} aria-hidden>
				Étape suivante
			</button>
		</form>
	);
}
