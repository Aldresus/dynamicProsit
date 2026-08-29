import { ToastProvider, TooltipProvider } from "@aldresus/design-system";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { PrositProvider } from "../prosit-store";
import { ThemeProvider } from "../theme";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => (
		<div className="grid min-h-dvh place-items-center bg-surface p-10 text-fg">
			<p className="hcds-lead text-fg-muted">Cette page n'existe pas.</p>
		</div>
	),
});

function RootLayout() {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<ToastProvider>
					<PrositProvider>
						<Outlet />
					</PrositProvider>
				</ToastProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
