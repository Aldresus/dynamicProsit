import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Contraintes",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de contraintes. Enfin un outil pour vous aider à faire vos prosits !",
};
export default function ContraintesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
