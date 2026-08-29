import { Button, Card, CardContent, CardTitle, List } from "@aldresus/design-system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Scaffold,
});

// ponytail: placeholder so Phase 0 can prove the DS renders, themes and builds.
// Phase 2 replaces it with the real shell.
function Scaffold() {
	return (
		<div className="min-h-dvh bg-surface p-10 text-fg">
			<Card className="mx-auto max-w-md">
				<CardTitle>DynamicPrositX</CardTitle>
				<CardContent className="flex flex-col gap-4">
					<p className="hcds-body text-fg-muted">
						Socle Vite + TanStack Router + design system.
					</p>
					<List>
						<li>Tokens résolus</li>
						<li>Utilitaires applicatifs compilés</li>
					</List>
					<Button>Bouton</Button>
				</CardContent>
			</Card>
		</div>
	);
}
