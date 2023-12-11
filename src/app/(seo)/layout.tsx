"use client";
import "@mantine/core/styles.css";
import "./globals.css";

import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import WindowsHeader from "@/components/windowsHeader";
import { Prosit } from "@/types/prosit";
import {
	MantineProvider,
	Text,
	Title,
	createTheme,
} from "@mantine/core";
import { open } from "@tauri-apps/api/shell";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [isTauriContext, setIsTauriContext] = useState(false);
	const [prosit, setProsit] = useState<Prosit>(() => {
		if (typeof window === "undefined") return defaultPrositValue;
		// @ts-ignore
		if (window.__TAURI__) setIsTauriContext(true);
		// Attempt to get stored value from localStorage
		//check if the value is already in localstorage and of the right type

		const storedProsit = localStorage.getItem("prosit");

		const parsedProsit = storedProsit
			? JSON.parse(storedProsit)
			: defaultPrositValue;

		for (const key of Object.keys(defaultPrositValue)) {
			if (!Object.prototype.hasOwnProperty.call(parsedProsit, key)) {
				parsedProsit[key] = defaultPrositValue[key as keyof Prosit];
			} else if (
				typeof parsedProsit[key] !==
				typeof defaultPrositValue[key as keyof Prosit]
			) {
				parsedProsit[key] = defaultPrositValue[key as keyof Prosit];
			}
		}

		return parsedProsit;
	});

	const clearProsit = () => {
		setProsit(defaultPrositValue);
	};
	useEffect(() => {
		// Store prosit in localStorage whenever it changes
		localStorage.setItem("prosit", JSON.stringify(prosit));
		if (typeof window !== "undefined")
			window.dispatchEvent(new Event("storage"));
	}, [prosit]);

	const theme = createTheme({
		fontSizes: {
			// xs: "1rem",
			// sm: "1.1rem",
			// md: "1.25rem",
			// lg: "1.35rem",
			// xl: "1.5rem",
		},
		white: "white",
	});

	return (
		<body>
				<MantineProvider defaultColorScheme="light" theme={theme}>
					<PrositContext.Provider value={{ prosit, setProsit, clearProsit }}>
						{isTauriContext ? (
							<div
								className="flex justify-end fixed top-0 left-0 right-0"
								data-tauri-drag-region={true}
							>
								<WindowsHeader className="m-3" />
							</div>
						) : null}
						<div>
							<Sparkles
								onClick={async () => {
									if (isTauriContext) await open("https://hugochampy.fr");
									else router.push("https://hugochampy.fr");
								}}
								size={30}
								className="fixed stroke-[hsl(211,95%,63%)] z-[10000] right-0 bottom-0 m-3 cursor-pointer"
							/>
						</div>
						<div className="hidden lg:block">{children}</div>
						<div className="lg:hidden h-full flex flex-col justify-center gap-3 items-center px-9">
							<Title order={2}>Ce site ne sert à rien sur mobile</Title>
							<Text>
								Tu ne vas quand même pas présenter tes prosits sur ton ✨
								<b>téléphone</b>✨ ?
							</Text>
							<Text c="dimmed">Quelle idée...</Text>
						</div>
					</PrositContext.Provider>
				</MantineProvider>
			</body>
	);
}
