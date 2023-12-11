import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Pistes de solution",
	description:
		"Une interface intuitive et efficace pour accompagner votre recherche de pistes de solution.",
};
export default function PistesSolutionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
