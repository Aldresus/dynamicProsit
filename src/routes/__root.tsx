import { ToastProvider, TooltipProvider } from "@aldresus/design-system";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<TooltipProvider>
			<ToastProvider>
				<Outlet />
			</ToastProvider>
		</TooltipProvider>
	);
}
