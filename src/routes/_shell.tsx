import {
	AppShell,
	AppShellAside,
	AppShellHeader,
	AppShellMain,
	AppShellSidebar,
	AppShellSidebarTrigger,
	Button,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Nav,
	NavGroup,
	NavItem,
	Select,
	SelectItem,
	Tooltip,
	TooltipProvider,
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
	Redo2,
	Sun,
	Trash2,
	Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { HelpAside } from "../components/help-aside";
import { exportDocx, importDocx } from "../domain/docx";
import { prositLabel } from "../domain/prosit";
import { onStateRequest, publishState } from "../domain/sync";
import { useProsit } from "../prosit-store";
import {
	INFORMATIONS,
	STEPS,
	linkProps,
	nextStep,
	previousStep,
} from "../sections";
import { useGoToStep } from "../shortcuts";
import { useTheme } from "../theme";

export const Route = createFileRoute("/_shell")({
	component: Shell,
});

/*
 * AppShellSidebar renders its children twice — once in the desktop column, once
 * inside its mobile Drawer — and keeps that drawer's open state in a private
 * context: no `useAppShell`, nothing to call, so a nav click left the drawer
 * covering the page it had just navigated to. `DrawerClose` is not the way out
 * either: the desktop copy has no `Dialog.Root` above it and Base UI throws,
 * which takes the whole app down (verified).
 *
 * ponytail: so we click the drawer's own close button. Ceiling: it is found by
 * the aria-label the design system puts on it — if that ever changes the drawer
 * simply stops closing, no crash. Upgrade path: a `useAppShell` export.
 * `closest` returns null in the desktop copy, where this is a no-op.
 */
const closeMobileNav = (event: { currentTarget: Element }) => {
	event.currentTarget
		.closest('[role="dialog"]')
		?.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
		?.click();
};

/** `/` is Informations; every other step is `/<slug>`. */
const slugOf = (pathname: string): string | null => {
	const slug = pathname.replace(/^\/|\/$/g, "");
	return slug === "" ? null : slug;
};

function Shell() {
	const {
		prosit,
		prosits,
		select,
		create,
		remove,
		add,
		reset,
		undo,
		canUndo,
		redo,
		canRedo,
	} = useProsit();
	const { pathname } = useLocation();
	const slug = slugOf(pathname);
	const goToStep = useGoToStep();
	const { scheme, toggle } = useTheme();
	const [helpOpen, setHelpOpen] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [exporting, setExporting] = useState(false);
	/*
	 * AppShellAside is hidden below `lg`, so on a narrow window Aide and F1
	 * toggled a panel nobody could see — a button that does nothing is worse than
	 * no button. Under that width the same content opens as a drawer.
	 */
	const [docked, setDocked] = useState(false);
	useEffect(() => {
		const wide = window.matchMedia("(min-width: 64rem)");
		const sync = () => setDocked(wide.matches);
		sync();
		wide.addEventListener("change", sync);
		return () => wide.removeEventListener("change", sync);
	}, []);
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
	// Since design system 2.3.0 `useShortcut` leaves the native editing keys
	// alone inside a field, so Ctrl+Z in a text area stays the browser's own
	// undo — typing is deliberately untracked (see the store).
	useShortcut("Mod+Z", undo);
	// Les deux conventions du rétablissement, sans en privilégier une.
	useShortcut("Mod+Shift+Z", redo);
	useShortcut("Mod+Y", redo);
	useShortcut("Mod+Alt+L", toggle);
	useShortcut("F1", () => setHelpOpen((open) => !open));

	// STEPS is a module constant, so this loop calls the same hooks in the same
	// order on every render.
	for (const step of STEPS) {
		useShortcut(step.shortcut, () => goToStep(step));
	}

	const previous = previousStep(slug);
	const next = nextStep(slug);
	const current = STEPS.find((step) => step.slug === slug) ?? INFORMATIONS;
	const dark = scheme === "dark";
	// The last prosit cannot be deleted, only emptied.
	const deletes = prosits.length > 1;

	return (
		<AppShell>
			{/*
				Tab lands on the sidebar first — twelve controls before the field you
				came to type in. `fixed` keeps it out of the shell's grid: an in-flow
				child would take a column of its own.
			*/}
			{/* Parked above the viewport rather than `sr-only`: `not-sr-only` resets
			    `position` to static, which drops it back into the shell's grid as a
			    column of its own the moment it takes focus. */}
			<a
				href="#contenu"
				className="fixed top-2 left-2 z-50 -translate-y-16 rounded-control bg-accent px-3 py-2 text-fg-on-accent focus:translate-y-0"
			>
				Aller au contenu
			</a>

			{/*
				Below `md` the sidebar is a drawer, and this is the only thing that
				opens it — without it the whole nav, export and présentation are
				unreachable on a phone. The row collapses to nothing above `md`.
			*/}
			<AppShellHeader className="md:hidden">
				<AppShellSidebarTrigger aria-label="Ouvrir le menu" />
				<span className="hcds-ui truncate">{current.label}</span>
			</AppShellHeader>

			{/*
				AppShellSidebar is already a padded, scrolling flex column — an inner
				wrapper with its own padding and `h-full` made the content taller than
				the column it sat in, which is what put a scrollbar on the nav.
			*/}
			{/* The mobile drawer's heading, and its accessible name. Not the app name:
			    the sidebar's own h1 says that, right underneath. */}
			<AppShellSidebar className="gap-4 overflow-y-hidden" title="Menu">
				<h1 className="hcds-subheading px-1 leading-tight">
					Les prosits là,
					<span className="hcds-ui block font-normal text-fg-muted">super</span>
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
					{/* Icon-only: the label has to live somewhere a pointer can find it. */}
					<Tooltip content="Commencer un nouveau prosit">
						<Button
							variant="ghost"
							iconOnly
							onClick={create}
							aria-label="Nouveau prosit"
						>
							<Plus className="size-4" />
						</Button>
					</Tooltip>
				</div>

				{/* The nav takes the squeeze so the actions below stay reachable; the
				    column itself no longer scrolls, which used to push Exporter off
				    the bottom on a short window. */}
				<Nav
					aria-label="Étapes du prosit"
					className="hcds-scroll min-h-0 flex-1 overflow-y-auto"
				>
					<NavGroup>
						{STEPS.map((step) => (
							<NavItem
								key={step.label}
								icon={<step.icon className="size-4" />}
								active={slug === step.slug}
								render={<Link {...linkProps(step)} />}
								onClick={closeMobileNav}
							>
								{step.label}
							</NavItem>
						))}
					</NavGroup>
				</Nav>

				{/* Grouped so one tooltip opening makes its neighbours instant — the
				    icon-only import button is unreadable without them. */}
				<TooltipProvider>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<Tooltip content="Enregistrer le prosit en .docx (Ctrl+S)">
								<Button
									className="min-w-0 flex-1"
									onClick={exportDocument}
									loading={exporting}
								>
									<FileDown className="size-4" />
									Exporter
								</Button>
							</Tooltip>
							{/* Was icon-only, and nobody guessed a .docx could come back in. */}
							<Tooltip content="Ouvrir un .docx exporté depuis cette app">
								<Button
									className="min-w-0 flex-1"
									variant="outline"
									onClick={() => fileInput.current?.click()}
								>
									<FileUp className="size-4" />
									Importer
								</Button>
							</Tooltip>
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
						{/*
							The deletion toast now carries its own Annuler (ToastList renders
							Toast.Action since 2.3.0). This one stays for everything else the
							history holds — ajout, édition, réordonnancement — which no toast
							reports.
						*/}
						<div className="flex gap-2">
							<Tooltip content="Revenir à l'état précédent (Ctrl+Z)">
								<Button
									variant="outline"
									onClick={undo}
									disabled={!canUndo}
									className="flex-1"
								>
									<Undo2 className="size-4" />
									Annuler
								</Button>
							</Tooltip>
							{/* Sans lui, une annulation de trop ne se rattrape qu'au clavier. */}
							<Tooltip content="Rétablir ce qui vient d'être annulé (Ctrl+Maj+Z)">
								<Button
									variant="outline"
									onClick={redo}
									disabled={!canRedo}
									aria-label="Rétablir"
									className="shrink-0"
								>
									<Redo2 className="size-4" />
								</Button>
							</Tooltip>
						</div>
						<Tooltip content="Ouvrir la vue projetée dans une seconde fenêtre">
							<Button variant="outline" onClick={openPresentation}>
								<MonitorPlay className="size-4" />
								Présentation
							</Button>
						</Tooltip>
						<div className="flex gap-2">
							<Tooltip content="Les raccourcis clavier (F1)">
								<Button
									className="flex-1"
									variant="ghost"
									onClick={() => setHelpOpen((open) => !open)}
								>
									<PanelRight className="size-4" />
									Aide
								</Button>
							</Tooltip>
							<Tooltip
								content={`Passer en thème ${dark ? "clair" : "sombre"} (Ctrl+Alt+L)`}
							>
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
							</Tooltip>
						</div>
						{/*
							Deleting the only prosit is a reset with extra steps, so the
							button says which of the two it is — and both ask first, since
							undo is one step and a mis-click here costs the document.
						*/}
						<Button
							variant="ghost"
							className="text-danger"
							onClick={() => setConfirming(true)}
						>
							<Trash2 className="size-4" />
							{deletes ? "Supprimer ce prosit" : "Réinitialiser le prosit"}
						</Button>
					</div>
				</TooltipProvider>
			</AppShellSidebar>

			{/* `tabIndex={-1}`: the skip link has to be able to land focus here. */}
			<AppShellMain id="contenu" tabIndex={-1} padding="lg">
				{/*
					Capped at the reading measure rather than `contained`, which stops at
					the 80rem page width — a 1091px text input is not a text input anyone
					wants. The prev/next row sits in the same column so it lines up with
					the fields instead of straddling the empty space beside them.
				*/}
				<div className="mx-auto flex w-full max-w-measure flex-col">
					{/* The arrow is the only thing saying which way "Livrables" goes, and
					    an arrow is not read aloud. */}
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={() => goToStep(previous)}
							aria-label={`Étape précédente : ${previous.label}`}
						>
							<ArrowLeft className="size-4" />
							{previous.label}
						</Button>
						<Button
							variant="ghost"
							onClick={() => goToStep(next)}
							aria-label={`Étape suivante : ${next.label}`}
						>
							{next.label}
							<ArrowRight className="size-4" />
						</Button>
					</div>
					<Outlet />
				</div>
			</AppShellMain>

			{helpOpen && docked && (
				<AppShellAside>
					<div className="p-4">
						<HelpAside />
					</div>
				</AppShellAside>
			)}

			<Drawer open={helpOpen && !docked} onOpenChange={setHelpOpen}>
				<DrawerContent side="right" size="sm">
					<DrawerHeader>
						<DrawerTitle>Aide</DrawerTitle>
					</DrawerHeader>
					<HelpAside />
				</DrawerContent>
			</Drawer>

			<ConfirmModal
				open={confirming}
				onOpenChange={setConfirming}
				onConfirm={() => {
					if (deletes) remove(prosit.id);
					else reset();
					// Annuler where the thing it undoes just happened.
					toast.add({
						title: deletes ? "Prosit supprimé" : "Prosit réinitialisé",
						actionProps: { children: "Annuler", onClick: undo },
					});
				}}
				title={
					deletes
						? `Supprimer « ${prositLabel(prosit)} » ?`
						: "Réinitialiser le prosit ?"
				}
				description={
					deletes
						? "Ce prosit et tout son contenu seront effacés."
						: "Tout le contenu saisi sera effacé."
				}
				confirmLabel={deletes ? "Supprimer" : "Réinitialiser"}
			/>
		</AppShell>
	);
}
