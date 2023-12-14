import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Livrables",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de livrables. Enfin un outil pour vous aider à faire vos prosits !",
};
export default function LivrablesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
