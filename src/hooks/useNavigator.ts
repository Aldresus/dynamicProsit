import { Anchors, AnchorsKeys, AnchorsURL } from "@/types/anchors";
import { Prosit } from "@/types/prosit";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface UseNavigatorProps {
  prosit: Prosit;
  setProsit: (prosit: Prosit) => void;
}

function useNavigator({ prosit, setProsit }: UseNavigatorProps) {
  const router = useRouter();

  function navigate(anchor: AnchorsKeys) {
    router.push(`/${AnchorsURL[anchor]}`);
    setProsit({
      ...prosit,
      currentAnchor: Anchors[anchor],
    });
  }

  const setAnchor = (anchor: AnchorsKeys) => {
    setProsit({
      ...prosit,
      currentAnchor: Anchors[anchor],
    });
  };
  return { navigate, setAnchor };
}

export default useNavigator;
