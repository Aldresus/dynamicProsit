import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Mots-Clefs",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de mots-clefs. Enfin un outil pour vous aider à faire vos prosits !",
};
export default function MotsClefsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
