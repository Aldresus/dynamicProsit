import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_shell/")({
	component: Informations,
});

// Phase 4 replaces this with the real form.
function Informations() {
	return (
		<div className="mt-6 flex flex-col gap-2">
			<h2 className="hcds-heading">Informations</h2>
			<p className="hcds-body text-fg-muted">Formulaire à venir (phase 4).</p>
		</div>
	);
}
