"use client";
import "./globals.css";
import "@mantine/core/styles.css";

import {
  AppShell,
  ColorSchemeScript,
  Kbd,
  MantineProvider,
  NavLink,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import {
  AreaChart,
  HelpCircle,
  Info,
  KeyRound,
  Lightbulb,
  MapPinned,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell
            // header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            aside={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            {/*<AppShell.Header>*/}
            {/*  <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />*/}
            {/*  <div>Logo</div>*/}
            {/*</AppShell.Header>*/}

            <AppShell.Navbar p="md" className="flex flex-col gap-9 ">
              <Title order={1}>Les prosits là, super.</Title>
              <div className="flex flex-col justify-center flex-1 gap-3">
                <NavLink
                  active={pathname === "/"}
                  label="Informations"
                  leftSection={<Info size="1rem" />}
                  href={"/"}
                ></NavLink>

                <NavLink
                  label="Mots clefs"
                  leftSection={<KeyRound size="1rem" />}
                  href={"/mots-clefs"}
                  active={pathname === "/mots-clefs"}
                />

                <NavLink
                  label="Problématiques"
                  leftSection={<HelpCircle size="1rem" />}
                  href={"/problematiques"}
                  active={pathname === "/problematiques"}
                />
                <NavLink
                  label="Pistes de solution"
                  leftSection={<Lightbulb size="1rem" />}
                  href={"/pistes-de-solution"}
                  active={pathname === "/pistes-de-solution"}
                />
                <NavLink
                  label="Livrables"
                  leftSection={<AreaChart size="1rem" />}
                  href={"/livrables"}
                  active={pathname === "/livrables"}
                />
                <NavLink
                  label="Plan d'action"
                  leftSection={<MapPinned size="1rem" />}
                  href={"/plan-d-action"}
                  active={pathname === "/plan-d-action"}
                />
              </div>
              <NavLink
                label="Options"
                leftSection={<Settings size="1rem" />}
                href={"/options"}
                active={pathname === "/options"}
              />
            </AppShell.Navbar>

            <AppShell.Main>
              <div className="px-20">{children}</div>
            </AppShell.Main>

            <AppShell.Aside p="md" className="flex flex-col gap-3 ">
              <Title order={2}>Aide</Title>
              <div className="flex flex-col justify-center flex-1">
                <Text>bla bla bla aide super</Text>
                <Title order={3}>Raccourcis</Title>
                <div>
                  <Kbd>ctrl</Kbd> + <Kbd>shift</Kbd> + <Kbd>1..2..3..4</Kbd>{" "}
                  pour changer de page
                </div>
                <div>
                  <Kbd>ctrl</Kbd> + <Kbd>enter</Kbd> pour passer à la page
                  suivante
                </div>
                <div>
                  <Kbd>ctrl</Kbd> + <Kbd>shift</Kbd> + <Kbd>enter</Kbd> pour
                  passer à la page precedente
                </div>
              </div>
            </AppShell.Aside>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
