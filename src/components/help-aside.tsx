import { Kbd, Separator } from "@aldresus/design-system";
import { STEPS } from "../sections";

const COMMANDS = [
	{ keys: "Mod+Enter", label: "étape suivante" },
	{ keys: "Mod+Shift+Enter", label: "étape précédente" },
	{ keys: "Mod+S", label: "exporter en .docx" },
	{ keys: "Mod+Z", label: "annuler la dernière action" },
	{ keys: "Mod+Alt+L", label: "changer de thème" },
	{ keys: "F1", label: "afficher ou masquer cette aide" },
];

export function HelpAside() {
	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-2">
				<h2 className="hcds-subheading">Vue de présentation</h2>
				<p className="hcds-ui text-fg-muted">
					La présentation s'ouvre dans une fenêtre séparée qui affiche le prosit
					sous une forme lisible, pensée pour être projetée.
				</p>
				<p className="hcds-ui text-fg-muted">
					Elle se met à jour toute seule et suit le formulaire : l'endroit où
					vous êtes est mis en évidence. Gardez le formulaire sur votre écran et
					la présentation sur le projecteur.
				</p>
			</section>

			<Separator />

			<section className="flex flex-col gap-3">
				<h2 className="hcds-subheading">Raccourcis</h2>
				<dl className="flex flex-col gap-2">
					{[
						...STEPS.map((step) => ({
							keys: step.shortcut,
							label: `aller à ${step.label.toLowerCase()}`,
						})),
						...COMMANDS,
					].map((command) => (
						<div
							key={command.keys}
							className="flex items-baseline justify-between gap-3"
						>
							<dt className="hcds-ui text-fg-muted">{command.label}</dt>
							<dd>
								<Kbd keys={command.keys} />
							</dd>
						</div>
					))}
				</dl>
			</section>
		</div>
	);
}
