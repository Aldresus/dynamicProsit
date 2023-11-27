"use client";
import "./globals.css";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prosit, setProsit] = useState<Prosit>(() => {
    if (typeof window === "undefined") return defaultPrositValue;
    // Attempt to get stored value from localStorage
    //check if the value is already in localstorage and of the right type

    const storedProsit = localStorage.getItem("prosit");

    let parsedProsit = storedProsit
      ? JSON.parse(storedProsit)
      : defaultPrositValue;

    Object.keys(defaultPrositValue).forEach((key) => {
      if (!parsedProsit.hasOwnProperty(key)) {
        parsedProsit[key] = defaultPrositValue[key as keyof Prosit];
      } else if (
        typeof parsedProsit[key] !==
        typeof defaultPrositValue[key as keyof Prosit]
      ) {
        parsedProsit[key] = defaultPrositValue[key as keyof Prosit];
      }
    });

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
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <PrositContext.Provider value={{ prosit, setProsit, clearProsit }}>
            {children}
          </PrositContext.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
