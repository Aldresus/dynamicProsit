import { List, cn } from "@aldresus/design-system";
import type { ReactNode } from "react";
import type { Prosit } from "../domain/prosit";
import { LIST_SECTIONS } from "../sections";

/** Matches the id the form window broadcasts; `null` is the Informations step. */
const blockId = (slug: string | null) => `bloc-${slug ?? "informations"}`;

function Block({
	slug,
	follows,
	active,
	title,
	children,
}: {
	slug: string | null;
	/** Only the pane that scrolls itself takes the ids — split mode renders two. */
	follows: boolean;
	active: boolean;
	title: string;
	children: ReactNode;
}) {
	return (
		<section
			id={follows ? blockId(slug) : undefined}
			className={cn(
				"rounded-panel px-4 py-3 transition-colors duration-200",
				active && "bg-accent-subtle",
			)}
		>
			<h2 className="hcds-subheading mb-1">{title}</h2>
			{children}
		</section>
	);
}

interface PresentationViewProps {
	prosit: Prosit;
	/** Highlighted step. Only the leading pane follows the form. */
	section?: string | null;
	follows?: boolean;
}

export function PresentationView({
	prosit,
	section = null,
	follows = false,
}: PresentationViewProps) {
	const isActive = (slug: string | null) => follows && section === slug;
	const hasInfos = prosit.contexte.trim() || prosit.generalisation.trim();

	// Capped at the reading measure like the form, per pane so split mode keeps
	// both columns readable.
	return (
		<div className="mx-auto flex h-full w-full max-w-measure flex-col gap-4 overflow-y-auto p-2">
			{hasInfos ? (
				<Block
					slug={null}
					follows={follows}
					active={isActive(null)}
					title="Contexte"
				>
					<p className="hcds-lead whitespace-pre-wrap">{prosit.contexte}</p>
					{prosit.generalisation.trim() && (
						<>
							<h3 className="hcds-subheading mt-3 mb-1">Généralisation</h3>
							<p className="hcds-lead">{prosit.generalisation}</p>
						</>
					)}
				</Block>
			) : null}

			{/* Empty steps are simply absent — the old build rendered them at opacity-0,
			    which still ate the space they would have taken. */}
			{LIST_SECTIONS.map((listSection) => {
				const items = prosit[listSection.field];
				if (items.length === 0) return null;
				return (
					<Block
						key={listSection.slug}
						slug={listSection.slug}
						follows={follows}
						active={isActive(listSection.slug)}
						title={listSection.presentationTitle.replace(/\s*:$/, "")}
					>
						{/* `xl` is Bitter, the same face as the title above it. `lg` is the
						    sans tier; `text-xl` puts back the projector size it costs. */}
						<List ordered={listSection.ordered} size="lg" className="text-xl">
							{items.map((item) => (
								<li key={item.id}>{item.content}</li>
							))}
						</List>
					</Block>
				);
			})}
		</div>
	);
}

export { blockId };
