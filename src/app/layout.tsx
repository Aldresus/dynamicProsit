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
  Title,
} from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AreaChart,
  HelpCircle,
  Info,
  KeyRound,
  Lightbulb,
  MapPinned,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PrositContext, { defaultPrositValue } from "@/components/prositContext";
import { Prosit } from "@/types/prosit";
import { globalHotKeys } from "@/components/globalHotKeys";
import { todocx } from "@/components/todocx";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [modalopened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();

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
    console.log("prosit changed");
    localStorage.setItem("prosit", JSON.stringify(prosit));
  }, [prosit]);

  useHotkeys([
    ["f1", () => toggle()],
    ["ctrl+s", () => todocx(prosit)],
    ...globalHotKeys(router),
  ]);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <PrositContext.Provider value={{ prosit, setProsit, clearProsit }}>
            <Modal
              centered
              opened={modalopened}
              onClose={close}
              title="Etes vous sur de voir réinitialiser votre prosit ?"
            >
              <div className="flex justify-between items-end h-20">
                <Button
                  onClick={() => {
                    console.log("clearing prosit");
                    clearProsit();
                    close();
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
                    label="Contraintes"
                    leftSection={<AlertCircle size="1rem" />}
                    href={"/contraintes"}
                    active={pathname === "/contraintes"}
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
                  <Button
                    fullWidth
                    color="green"
                    onClick={() => todocx(prosit)}
                  >
                    Exporter en .docx
                  </Button>
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
                <Button fullWidth variant="subtle" color="red" onClick={open}>
                  Réinitialiser le prosit
                </Button>
              </AppShell.Navbar>

              <AppShell.Main>
                <div className="px-20">{children}</div>
              </AppShell.Main>

              <AppShell.Aside p="md" className="flex flex-col gap-3 ">
                <Title order={2}>Aide</Title>
                <div className="flex flex-col gap-3 justify-center flex-1">
                  <Title order={3}>Raccourcis</Title>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>a</Kbd>
                    </div>
                    page informations
                  </div>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>z</Kbd>
                    </div>
                    page mots clefs
                  </div>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>e</Kbd>
                    </div>
                    page problematiques
                  </div>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>r</Kbd>
                    </div>
                    page pistes de solution
                  </div>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>t</Kbd>
                    </div>
                    page livrables
                  </div>
                  <div>
                    <div>
                      <Kbd>alt</Kbd> + <Kbd>shift</Kbd> + <Kbd>y</Kbd>
                    </div>
                    page plan d&apos;action
                  </div>
                  <div>
                    <div>
                      <Kbd>ctrl</Kbd> + <Kbd>enter</Kbd>
                    </div>
                    pour passer à la page suivante
                  </div>
                  <div>
                    <div>
                      <Kbd>ctrl</Kbd> + <Kbd>shift</Kbd> + <Kbd>enter</Kbd>
                    </div>
                    pour passer à la page precedente
                  </div>
                  <div>
                    <div>
                      <Kbd>ctrl</Kbd> + <Kbd>s</Kbd>
                    </div>
                    pour exporter en .docx
                  </div>
                </div>
              </AppShell.Aside>
            </AppShell>
          </PrositContext.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}
