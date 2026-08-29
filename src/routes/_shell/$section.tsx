import { createFileRoute, notFound } from "@tanstack/react-router";
import { findSection } from "../../sections";

export const Route = createFileRoute("/_shell/$section")({
	// An unknown slug is a 404, not an empty page pretending to be a step.
	loader: ({ params }) => {
		const section = findSection(params.section);
		if (!section) throw notFound();
		return { slug: section.slug };
	},
	component: Section,
});

// Phase 3 replaces this with the sortable list.
function Section() {
	const { section } = Route.useParams();
	const config = findSection(section);
	return (
		<div className="mt-6 flex flex-col gap-2">
			<h2 className="hcds-heading">{config?.label}</h2>
			<p className="hcds-body text-fg-muted">Liste à venir (phase 3).</p>
		</div>
	);
}
