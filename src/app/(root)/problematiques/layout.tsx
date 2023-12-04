import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Problématiques",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de problématiques",
};
export default function ProblematiquesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
