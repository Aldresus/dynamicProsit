import { Button, SplitPane, Tooltip } from "@aldresus/design-system";
import { createFileRoute } from "@tanstack/react-router";
import { Columns2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PresentationView, blockId } from "../components/presentation-view";
import { type Prosit, isEmpty } from "../domain/prosit";
import { load } from "../domain/storage";
import { subscribe } from "../domain/sync";
import { metaTags, pageFor } from "../seo";

export const Route = createFileRoute("/presentation")({
	head: () => ({ meta: metaTags(pageFor("/presentation")) }),
	component: Presentation,
});

/**
 * A separate window, so it has no store of its own: it reads localStorage once
 * to paint immediately, then lives off the BroadcastChannel the form publishes.
 */
function Presentation() {
	const [prosit, setProsit] = useState<Prosit>(load);
	const [section, setSection] = useState<string | null>(null);
	const [split, setSplit] = useState(false);

	useEffect(
		() =>
			subscribe((message) => {
				setProsit(message.prosit);
				setSection(message.section);
			}),
		[],
	);

	// Follow the form: bring the step being edited into view.
	useEffect(() => {
		document
			.getElementById(blockId(section))
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, [section]);

	const empty = isEmpty(prosit);

	return (
		<div className="flex h-dvh flex-col gap-4 bg-surface p-6 text-fg">
			<header className="flex items-center justify-between gap-4">
				<h1 className="hcds-title">{prosit.titre.trim() || "Prosit"}</h1>
				{!empty && (
					<Tooltip
						content={split ? "Fermer la seconde vue" : "Ouvrir une seconde vue"}
					>
						<Button
							variant="ghost"
							onClick={() => setSplit((open) => !open)}
							aria-label={
								split ? "Fermer la seconde vue" : "Ouvrir une seconde vue"
							}
						>
							{split ? (
								<X className="size-5" />
							) : (
								<Columns2 className="size-5" />
							)}
						</Button>
					</Tooltip>
				)}
			</header>

			{empty ? (
				<p className="hcds-lead m-auto text-fg-muted">
					Le prosit est vide. Remplissez le formulaire, la présentation suit.
				</p>
			) : split ? (
				/* Two panes scroll independently, for a prosit too long to project whole. */
				<SplitPane className="min-h-0 flex-1" dividerLabel="Largeur des vues">
					<PresentationView prosit={prosit} section={section} follows />
					<PresentationView prosit={prosit} />
				</SplitPane>
			) : (
				<div className="min-h-0 flex-1">
					<PresentationView prosit={prosit} section={section} follows />
				</div>
			)}
		</div>
	);
}
