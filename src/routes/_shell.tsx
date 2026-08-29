import {
	AppShell,
	AppShellAside,
	AppShellMain,
	AppShellSidebar,
	Button,
	Nav,
	NavGroup,
	NavItem,
	Tooltip,
	useShortcut,
	useToast,
} from "@aldresus/design-system";
import {
	Link,
	Outlet,
	createFileRoute,
	useLocation,
} from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	FileDown,
	MonitorPlay,
	MoonStar,
	Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HelpAside } from "../components/help-aside";
import { ResetModal } from "../components/reset-modal";
import { exportDocx } from "../domain/docx";
import { publish } from "../domain/sync";
import { useProsit } from "../prosit-store";
import { STEPS, linkProps, nextStep, previousStep } from "../sections";
import { useGoToStep } from "../shortcuts";
import { useTheme } from "../theme";

export const Route = createFileRoute("/_shell")({
	component: Shell,
});

/** `/` is Informations; every other step is `/<slug>`. */
const slugOf = (pathname: string): string | null => {
	const slug = pathname.replace(/^\/|\/$/g, "");
	return slug === "" ? null : slug;
};

function Shell() {
	const { prosit, reset } = useProsit();
	const { pathname } = useLocation();
	const slug = slugOf(pathname);
	const goToStep = useGoToStep();
	const { scheme, toggle } = useTheme();
	const [helpOpen, setHelpOpen] = useState(false);
	const [resetOpen, setResetOpen] = useState(false);
	const [exporting, setExporting] = useState(false);
	const toast = useToast();

	// Reusing the same window name focuses the existing one instead of stacking popups.
	const openPresentation = () => {
		window.open(
			"/presentation",
			"prosit-presentation",
			"popup=yes,width=1280,height=800",
		);
	};

	const exportDocument = async () => {
		setExporting(true);
		try {
			await exportDocx(prosit);
			toast.add({ type: "success", title: "Prosit exporté" });
		} catch (error) {
			// A broken template or a blocked download is the user's problem to see.
			toast.add({
				type: "danger",
				title: "L'export a échoué",
				description: error instanceof Error ? error.message : undefined,
			});
		} finally {
			setExporting(false);
		}
	};

	// The présentation window is a separate document; this is its only feed.
	useEffect(() => {
		publish({ prosit, section: slug });
	}, [prosit, slug]);

	useShortcut("Mod+Enter", () => goToStep(nextStep(slug)));
	useShortcut("Mod+Shift+Enter", () => goToStep(previousStep(slug)));
	useShortcut("Mod+S", exportDocument);
	useShortcut("Mod+Alt+L", toggle);
	useShortcut("F1", () => setHelpOpen((open) => !open));

	// STEPS is a module constant, so this loop calls the same hooks in the same
	// order on every render.
	for (const step of STEPS) {
		useShortcut(step.shortcut, () => goToStep(step));
	}

	const previous = previousStep(slug);
	const next = nextStep(slug);
	const dark = scheme === "dark";

	return (
		<AppShell>
			<AppShellSidebar>
				<div className="flex h-full flex-col gap-6 p-4">
					<h1 className="hcds-subheading leading-tight">
						Les prosits là,
						<span className="block font-normal text-fg-muted">super</span>
					</h1>

					<Nav className="flex-1">
						<NavGroup>
							{STEPS.map((step) => (
								<NavItem
									key={step.label}
									icon={<step.icon className="size-4" />}
									active={slug === step.slug}
									render={<Link {...linkProps(step)} />}
								>
									{step.label}
								</NavItem>
							))}
						</NavGroup>
					</Nav>

					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<Button
								className="flex-1"
								onClick={exportDocument}
								loading={exporting}
							>
								<FileDown className="size-4" />
								Exporter en .docx
							</Button>
							<Tooltip content="Ouvrir la présentation">
								<Button
									variant="outline"
									aria-label="Ouvrir la présentation"
									onClick={openPresentation}
								>
									<MonitorPlay className="size-4" />
								</Button>
							</Tooltip>
						</div>
						<div className="flex gap-2">
							<Button
								className="flex-1"
								variant="outline"
								onClick={() => setHelpOpen((open) => !open)}
							>
								{helpOpen ? "Masquer" : "Afficher"} l'aide
							</Button>
							<Button
								variant="outline"
								onClick={toggle}
								aria-label={`Passer en thème ${dark ? "clair" : "sombre"}`}
							>
								{dark ? (
									<Sun className="size-4" />
								) : (
									<MoonStar className="size-4" />
								)}
							</Button>
						</div>
						<Button variant="ghost" onClick={() => setResetOpen(true)}>
							Réinitialiser le prosit
						</Button>
					</div>
				</div>
			</AppShellSidebar>

			<AppShellMain padding="lg" contained>
				<div className="flex items-center justify-between">
					<Button variant="ghost" onClick={() => goToStep(previous)}>
						<ArrowLeft className="size-4" />
						{previous.label}
					</Button>
					<Button variant="ghost" onClick={() => goToStep(next)}>
						{next.label}
						<ArrowRight className="size-4" />
					</Button>
				</div>
				<Outlet />
			</AppShellMain>

			{helpOpen && (
				<AppShellAside>
					<div className="p-4">
						<HelpAside />
					</div>
				</AppShellAside>
			)}

			<ResetModal
				open={resetOpen}
				onOpenChange={setResetOpen}
				onConfirm={reset}
			/>
		</AppShell>
	);
}
