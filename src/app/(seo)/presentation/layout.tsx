"use client";

import { MantineProvider, createTheme } from "@mantine/core";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = createTheme({
		fontSizes: {
			xl: "2rem",
		},
		fontSmoothing: true,
		headings: {
			sizes: {
				h1: {
					fontSize: "3rem",
				},
				h2: {
					fontSize: "2.5rem",
				},
				h3: {
					fontSize: "2rem",
				},
				h4: {
					fontSize: "1.75rem",
				},
				h5: {
					fontSize: "1.5rem",
				},
				h6: {
					fontSize: "1.25rem",
				},
			},
		},
	});

	return (
		<div className="w-full h-screen px-20 pt-10">
			<MantineProvider theme={theme}>{children}</MantineProvider>
		</div>
	);
}
