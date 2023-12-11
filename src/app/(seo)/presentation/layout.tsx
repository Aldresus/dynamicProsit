"use client";

import { MantineProvider, createTheme } from "@mantine/core";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = createTheme({
		fontSizes: {
			xs: "1.5rem",
			sm: "1.6rem",
			md: "1.75rem",
			lg: "1.85rem",
			xl: "2rem",
		},
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
		<div className="w-full min-h-screen p-20">
			<MantineProvider theme={theme}>{children}</MantineProvider>
		</div>
	);
}
