import { ColorSchemeScript } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "DynamicPrositX, l'outil pour vos prosits réussis !",
	description:
		"Une interface intuitive et efficace pour accompagner vos prosits. Enfin un outil pour vous aider à faire vos prosits !",
	keywords: [
		"prosit",
		"prosits",
		"dynamic",
		"prositx",
		"dynamicprositx",
		"prositx",
		"dynamicp",
		"dynamicprosit",
		"cesi",
		"outil prosit",
		"dynamic prosit",
		"prosit dynamique",
		"prosit dynamic",
	],
	authors: [
		{
			name: "Hugo Champy",
			url: "https://hugochampy.fr",
		},
	],
	openGraph: {
		title: "DynamicPrositX",
		description:
			"Une interface intuitive et efficace pour accompagner vos prosits.",
		url: "https://prosit.hugochampy.fr",
		type: "website",
		siteName: "DynamicPrositX",
		images: [
			{
				url: "/opengraph-image",
				alt: "DynamicPrositX",
				type: "image/png",
			},
		],
	},
	twitter: {
		title: "DynamicPrositX",
		description:
			"Une interface intuitive et efficace pour accompagner vos prosits.",
		images: [
			{
				url: "/twitter-image",
				alt: "DynamicPrositX",
			},
		],
		card: "summary_large_image",
		site: "@Aldresus",
	},
};

export default function SEOLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
			</head>
			{children}
		</html>
	);
}
