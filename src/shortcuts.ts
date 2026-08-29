import { matchesShortcut, useIsMac } from "@aldresus/design-system";
import { useNavigate } from "@tanstack/react-router";
import type { KeyboardEvent } from "react";
import { STEPS, type Step, pathOf } from "./sections";

/**
 * `useShortcut` ignores a combo fired from inside an input unless it carries
 * Meta or Ctrl — sensible in general, and wrong for this app, where every page
 * autofocuses a field and the step jumps are `Alt+Shift+…`. The old build had
 * the same problem and solved it the same way: hang a keydown on the inputs.
 *
 * So the jumps are bound twice — globally through `useShortcut`, for when focus
 * is elsewhere, and here for when the caret is in a field. Spread the returned
 * handler onto anything the user types into.
 */
export function useStepKeyDown(): (event: KeyboardEvent) => void {
	const navigate = useNavigate();
	const isMac = useIsMac();

	return (event: KeyboardEvent) => {
		const step = STEPS.find((candidate) =>
			matchesShortcut(event, candidate.shortcut.split("+"), isMac),
		);
		if (!step) return;
		event.preventDefault();
		navigate({ to: pathOf(step) });
	};
}

export const useGoToStep = (): ((step: Step) => void) => {
	const navigate = useNavigate();
	return (step: Step) => navigate({ to: pathOf(step) });
};
