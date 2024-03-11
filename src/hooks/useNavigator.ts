import {
	Anchors,
	AnchorsKeys,
	AnchorsURL,
	anchorsOrder,
} from "@/types/anchors";
import { Prosit } from "@/types/prosit";
import { useRouter } from "next/navigation";

interface UseNavigatorProps {
	prosit: Prosit;
	setProsit: (prosit: Prosit) => void;
}

function useNavigator({ prosit, setProsit }: UseNavigatorProps) {
	const router = useRouter();

	const navigate = (anchor: AnchorsKeys) => {
		router.push(`/${AnchorsURL[anchor]}`);
		setProsit({
			...prosit,
			currentAnchor: anchor,
		});
	};

	const setAnchor = (anchor: AnchorsKeys) => {
		setProsit({
			...prosit,
			currentAnchor: anchor,
		});
	};

	const next = () => {
		const { currentAnchor } = prosit;

		const currentIndex = anchorsOrder.indexOf(currentAnchor);
		const nextAnchor = anchorsOrder[currentIndex + 1];

		navigate(nextAnchor);
	};

	const previous = () => {
		const { currentAnchor } = prosit;

		const currentIndex = anchorsOrder.indexOf(currentAnchor);
		if (currentIndex === 0) {
			return;
		}
		const previousAnchor = anchorsOrder[currentIndex - 1];

		navigate(previousAnchor);
	};

	const currentIndex = () => {
		const { currentAnchor } = prosit;
		return anchorsOrder.indexOf(currentAnchor);
	};

	return { navigate, setAnchor, next, previous, currentIndex };
}

export default useNavigator;
