import { ToastProvider, TooltipProvider } from "@aldresus/design-system";
import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";
import { PrositProvider } from "../prosit-store";
import { HOME, metaTags } from "../seo";
import { ThemeProvider } from "../theme";

export const Route = createRootRoute({
	head: () => ({ meta: metaTags(HOME) }),
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
			<HeadContent />
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
