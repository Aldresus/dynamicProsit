import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX | Plan d'action",
	description:
		"Une interface intuitive et efficace pour accompagner l'écriture de votre plan d'action. Enfin un outil pour vous aider à faire vos prosits !",
};
export default function PlanDActionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
