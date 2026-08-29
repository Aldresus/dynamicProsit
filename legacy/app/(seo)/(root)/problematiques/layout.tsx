import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Problématiques",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de problématiques. Enfin un outil pour vous aider à faire vos prosits !",
};
export default function ProblematiquesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
