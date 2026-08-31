import {
	AppShell,
	AppShellAside,
	AppShellMain,
	AppShellSidebar,
	Button,
	Nav,
	NavGroup,
	NavItem,
	Select,
	SelectItem,
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
	FileUp,
	MonitorPlay,
	MoonStar,
	PanelRight,
	Plus,
	Sun,
	Trash2,
	Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HelpAside } from "../components/help-aside";
import { ResetModal } from "../components/reset-modal";
import { exportDocx, importDocx } from "../domain/docx";
import { prositLabel } from "../domain/prosit";
import { onStateRequest, publishState } from "../domain/sync";
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
	const { prosit, prosits, select, create, remove, add, reset, undo, canUndo } =
		useProsit();
	const { pathname } = useLocation();
	const slug = slugOf(pathname);
	const goToStep = useGoToStep();
	const { scheme, toggle } = useTheme();
	const [helpOpen, setHelpOpen] = useState(false);
	const [resetOpen, setResetOpen] = useState(false);
	const [exporting, setExporting] = useState(false);
	const presentationWindow = useRef<Window | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);
	const toast = useToast();

	/**
	 * A real second window, for the projector — not a tab. Reusing one window
	 * name means a second click focuses what is already open rather than
	 * stacking popups, and a blocked popup says so instead of doing nothing
	 * visible, which is the failure people report as "the button is broken".
	 */
	const openPresentation = () => {
		const existing = presentationWindow.current;
		if (existing && !existing.closed) {
			existing.focus();
			return;
		}

		const opened = window.open(
			"/presentation",
			"prosit-presentation",
			"popup=yes,width=1280,height=800",
		);

		if (!opened) {
			toast.add({
				type: "warning",
				title: "La fenêtre a été bloquée",
				description:
					"Autorisez les fenêtres pop-up pour ce site, ou ouvrez /presentation vous-même.",
			});
			return;
		}

		presentationWindow.current = opened;
		opened.focus();
	};

	/**
	 * The exported .docx carries the prosit inside it, so a file mailed to a
	 * teammate is also the way to hand them the document itself. No separate
	 * JSON to keep in step with it.
	 */
	const importDocument = async (file: File) => {
		try {
			add(await importDocx(file));
			toast.add({ type: "success", title: "Prosit importé" });
		} catch (error) {
			toast.add({
				type: "danger",
				title: "L'import a échoué",
				description: error instanceof Error ? error.message : undefined,
			});
		}
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
		publishState({ prosit, section: slug });
	}, [prosit, slug]);

	/*
	 * Answering state requests must not re-subscribe as the document changes:
	 * that opened and closed a BroadcastChannel on every keystroke. The ref
	 * carries the latest value into a listener registered once.
	 */
	const latest = useRef({ prosit, section: slug });
	latest.current = { prosit, section: slug };
	useEffect(() => onStateRequest(() => publishState(latest.current)), []);

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
			{/*
				AppShellSidebar is already a padded, scrolling flex column — an inner
				wrapper with its own padding and `h-full` made the content taller than
				the column it sat in, which is what put a scrollbar on the nav.
			*/}
			<AppShellSidebar className="gap-4 overflow-y-hidden">
				<h1 className="hcds-subheading px-1 leading-tight">
					Les prosits là,
					<span className="block font-normal text-fg-muted">super</span>
				</h1>

				{/*
					One prosit was the old app's whole model: the storage key was the
					literal string "prosit", so starting a new one meant destroying the
					last. The switcher is the only place that has to say so.
				*/}
				<div className="flex gap-2">
					{/* `items` is not decoration: without the value-to-label map Base UI
					    renders the raw id in the trigger. */}
					<Select
						className="min-w-0 flex-1"
						aria-label="Prosit en cours"
						value={prosit.id}
						items={prosits.map((item) => ({
							value: item.id,
							label: prositLabel(item),
						}))}
						onValueChange={(id) => id && select(id)}
					>
						{prosits.map((item) => (
							<SelectItem key={item.id} value={item.id}>
								{prositLabel(item)}
							</SelectItem>
						))}
					</Select>
					<Button variant="ghost" onClick={create} aria-label="Nouveau prosit">
						<Plus className="size-4" />
					</Button>
				</div>

				{/* The nav takes the squeeze so the actions below stay reachable; the
				    column itself no longer scrolls, which used to push Exporter off
				    the bottom on a short window. */}
				<Nav className="hcds-scroll min-h-0 flex-1 overflow-y-auto">
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
							className="min-w-0 flex-1"
							onClick={exportDocument}
							loading={exporting}
						>
							<FileDown className="size-4" />
							Exporter en .docx
						</Button>
						<Button
							variant="outline"
							onClick={() => fileInput.current?.click()}
							aria-label="Importer un prosit depuis un .docx"
						>
							<FileUp className="size-4" />
						</Button>
						{/* The button is the control; this is only the file picker behind it. */}
						<input
							ref={fileInput}
							type="file"
							accept=".docx"
							hidden
							onChange={(event) => {
								const file = event.target.files?.[0];
								// Cleared so picking the same file twice fires again.
								event.target.value = "";
								if (file) void importDocument(file);
							}}
						/>
					</div>
					<Button variant="outline" onClick={openPresentation}>
						<MonitorPlay className="size-4" />
						Présentation
					</Button>
					<div className="flex gap-2">
						<Button
							className="flex-1"
							variant="ghost"
							onClick={() => setHelpOpen((open) => !open)}
						>
							<PanelRight className="size-4" />
							Aide
						</Button>
						<Button
							className="flex-1"
							variant="ghost"
							onClick={toggle}
							aria-label={`Passer en thème ${dark ? "clair" : "sombre"}`}
						>
							{dark ? (
								<Sun className="size-4" />
							) : (
								<MoonStar className="size-4" />
							)}
							Thème
						</Button>
					</div>
					{/*
						Undo belongs in the toast that reports the deletion, but the
						design system's ToastList renders only title, description and
						close — no Toast.Action — so actionProps would go nowhere.
						A visible control it is.
					*/}
					<Button variant="ghost" onClick={undo} disabled={!canUndo}>
						<Undo2 className="size-4" />
						Annuler
					</Button>
					{/*
						Deleting the only prosit is a reset with extra steps, so the
						button appears once there is a choice to make.
					*/}
					{prosits.length > 1 ? (
						<Button
							variant="ghost"
							className="text-danger"
							onClick={() => remove(prosit.id)}
						>
							<Trash2 className="size-4" />
							Supprimer ce prosit
						</Button>
					) : (
						<Button
							variant="ghost"
							className="text-danger"
							onClick={() => setResetOpen(true)}
						>
							Réinitialiser le prosit
						</Button>
					)}
				</div>
			</AppShellSidebar>

			<AppShellMain padding="lg">
				{/*
					Capped at the reading measure rather than `contained`, which stops at
					the 80rem page width — a 1091px text input is not a text input anyone
					wants. The prev/next row sits in the same column so it lines up with
					the fields instead of straddling the empty space beside them.
				*/}
				<div className="mx-auto flex w-full max-w-measure flex-col">
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
				</div>
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
