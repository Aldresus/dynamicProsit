import { useState, useEffect } from "react";
import { AnchorsKeys, AnchorsURL, anchorsOrder } from "@/types/anchors";
import { Prosit } from "@/types/prosit";
import { useRouter } from "next/navigation";

interface UseNavigatorProps {
	prosit: Prosit;
	setProsit: (prosit: Prosit) => void;
}

function useNavigator({ prosit, setProsit }: UseNavigatorProps) {
	const router = useRouter();

	// Moved currentAnchor to its own state to manage it independently and avoid direct mutations.
	const [currentAnchor, setCurrentAnchor] = useState(prosit.currentAnchor);
	const [nextAnchor, setNextAnchor] = useState<AnchorsKeys>(anchorsOrder[0]);
	const [previousAnchor, setPreviousAnchor] = useState<AnchorsKeys>(
		anchorsOrder[anchorsOrder.length - 1],
	);

	// Effect to synchronize changes in `prosit.currentAnchor` outside this hook.
	useEffect(() => {
		setCurrentAnchor(prosit.currentAnchor);
		const currentIndex = anchorsOrder.indexOf(prosit.currentAnchor);
		if (currentIndex === -1) {
			return;
		}
		if (currentIndex === anchorsOrder.length - 1) {
			setNextAnchor(anchorsOrder[0]);
		} else {
			setNextAnchor(anchorsOrder[currentIndex + 1]);
		}
		if (currentIndex === 0) {
			setPreviousAnchor(anchorsOrder[anchorsOrder.length - 1]);
		} else {
			setPreviousAnchor(anchorsOrder[currentIndex - 1]);
		}
	}, [prosit.currentAnchor]);

	const navigate = (anchor: AnchorsKeys) => {
		router.push(`/${AnchorsURL[anchor]}`);
		const newProsit = {
			...prosit,
			currentAnchor: anchor,
		};
		setProsit(newProsit);
		setCurrentAnchor(anchor); // Ensure local state is also updated
	};

	const setAnchor = (anchor: AnchorsKeys) => {
		const newProsit = {
			...prosit,
			currentAnchor: anchor,
		};
		setProsit(newProsit);
		setCurrentAnchor(anchor); // Ensure local state is also updated
	};

	// Updated next and previous functions to use local `currentAnchor` state.
	const next = () => {
		const currentIndex = anchorsOrder.indexOf(currentAnchor);
		if (currentIndex === anchorsOrder.length - 1) {
			return navigate(anchorsOrder[0]);
		}
		const nextAnchor = anchorsOrder[currentIndex + 1];
		navigate(nextAnchor);
	};

	const previous = () => {
		const currentIndex = anchorsOrder.indexOf(currentAnchor);
		if (currentIndex === 0) {
			return navigate(anchorsOrder[anchorsOrder.length - 1]);
		}
		const previousAnchor = anchorsOrder[currentIndex - 1];
		navigate(previousAnchor);
	};

	const currentIndex = () => {
		return anchorsOrder.indexOf(currentAnchor);
	};

	const isLast = () => {
		return currentIndex() === anchorsOrder.length - 1;
	};

	const isFirst = () => {
		return currentIndex() === 0;
	};

	return {
		navigate,
		setAnchor,
		next,
		previous,
		isFirst,
		isLast,
		currentAnchor,
		nextAnchor,
		previousAnchor,
	};
}

export default useNavigator;
