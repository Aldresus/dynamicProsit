import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Livrables",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de livrables.",
};
export default function LivrablesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
