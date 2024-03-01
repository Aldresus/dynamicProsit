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
          fontSize: "2.5rem",
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
