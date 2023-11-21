"use client";
import "./globals.css";
import "@mantine/core/styles.css";

import {
  AppShell,
  Button,
  ColorSchemeScript,
  Kbd,
  MantineProvider,
  Modal,
  NavLink,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useContext } from "react";
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
import PrositContext, { PrositProvider } from "@/components/prositContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [modalopened, { open, close }] = useDisclosure(false);

  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Modal
            centered
            opened={modalopened}
            onClose={close}
            title="Etes vous sur de voir réinitialiser votre prosit ?"
          >
            <div className="flex justify-between items-end h-20">
              <Button
                onClick={() => {
                  localStorage.removeItem("prosit");
                  //refresh the page
                  window.location.reload();
                }}
                color="red"
                variant="transparent"
              >
                Réinitialiser
              </Button>
              <Button onClick={close}>Annuler</Button>
            </div>
          </Modal>

          <AppShell
            // header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
            }}
            aside={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened, desktop: !opened },
            }}
            padding="md"
          >
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

              <div className="flex">
                <NavLink
                  label="Options"
                  leftSection={<Settings size="1rem" />}
                  href={"/options"}
                  active={pathname === "/options"}
                />
                <Button onClick={toggle} variant="transparent">
                  Aide
                </Button>
              </div>
              <Button fullWidth color="red" onClick={open}>
                Réinitialiser le prosit
              </Button>
            </AppShell.Navbar>

            <AppShell.Main>
              <PrositProvider>
                <div className="px-20">{children}</div>
              </PrositProvider>
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
