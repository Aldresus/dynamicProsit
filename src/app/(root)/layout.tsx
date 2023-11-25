"use client";

import {
  AppShell,
  Button,
  Kbd,
  Modal,
  NavLink,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import React, { useContext, useEffect, useState } from "react";
import {
  AlertCircle,
  AreaChart,
  HelpCircle,
  Info,
  KeyRound,
  Lightbulb,
  MapPinned,
  MonitorPlay,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { globalHotKeys } from "@/components/globalHotKeys";
import { todocx } from "@/components/todocx";
import PrositContext from "@/components/prositContext";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [modalopened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();
  const { prosit, setProsit, clearProsit } = useContext(PrositContext);
  const [presentationWindow, setPresentationWindow] = useState<Window | null>();

  useEffect(() => {
    router.prefetch("/mots-clefs");
    router.prefetch("/contraintes");
    router.prefetch("/problematiques");
    router.prefetch("/pistes-de-solution");
    router.prefetch("/livrables");
    router.prefetch("/plan-d-action");
  }, [router]);

  useEffect(() => {
    console.log(presentationWindow);
  }, [presentationWindow]);

  useHotkeys([
    ["f1", () => toggle()],
    ["ctrl+s", () => todocx(prosit)],
    ...globalHotKeys(router),
  ]);

  const navigate = (anchor: string) => {
    setProsit({
      ...prosit,
      currentAnchor: anchor,
    });
  };

  return (
    <div>
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
          <Title order={1} lh={1}>
            Les prosits là, <span className="font-light">super</span>
          </Title>
          <div className="flex flex-col justify-center flex-1 gap-3">
            <NavLink
              active={pathname === "/"}
              label="Informations"
              leftSection={<Info size="1rem" />}
              href={"/"}
              onClick={() => {
                navigate("informations");
              }}
            ></NavLink>

            <NavLink
              label="Mots clefs"
              leftSection={<KeyRound size="1rem" />}
              href={"/mots-clefs"}
              active={pathname === "/mots-clefs"}
              onClick={() => {
                navigate("motsClefs");
              }}
            />

            <NavLink
              label="Contraintes"
              leftSection={<AlertCircle size="1rem" />}
              href={"/contraintes"}
              active={pathname === "/contraintes"}
              onClick={() => {
                navigate("contraintes");
              }}
            />

            <NavLink
              label="Problématiques"
              leftSection={<HelpCircle size="1rem" />}
              href={"/problematiques"}
              active={pathname === "/problematiques"}
              onClick={() => {
                navigate("problematiques");
              }}
            />
            <NavLink
              label="Pistes de solution"
              leftSection={<Lightbulb size="1rem" />}
              href={"/pistes-de-solution"}
              active={pathname === "/pistes-de-solution"}
              onClick={() => {
                navigate("pistesDeSolution");
              }}
            />
            <NavLink
              label="Livrables"
              leftSection={<AreaChart size="1rem" />}
              href={"/livrables"}
              active={pathname === "/livrables"}
              onClick={() => {
                navigate("livrables");
              }}
            />
            <NavLink
              label="Plan d'action"
              leftSection={<MapPinned size="1rem" />}
              href={"/plan-d-action"}
              active={pathname === "/plan-d-action"}
              onClick={() => {
                navigate("planDAction");
              }}
            />
            <Button fullWidth onClick={toggle} variant="light">
              {!opened ? "Afficher" : "Masquer"} l&apos;aide
            </Button>
          </div>

          <div className="flex gap-3">
            <Button fullWidth color="green" onClick={() => todocx(prosit)}>
              Exporter en .docx
            </Button>
            <Tooltip label="Ouvrir la présentation">
              <Button
                color="blue"
                onClick={() => {
                  if (
                    !presentationWindow ||
                    (typeof window !== "undefined" &&
                      presentationWindow?.closed)
                  ) {
                    let finalpath = window.location.href.split("/");
                    finalpath.pop();
                    finalpath.push("presentation");
                    setPresentationWindow(
                      window.open(finalpath.join("/"), "_blank", "popup=true"),
                    );
                    console.log(finalpath);
                  }
                }}
              >
                <MonitorPlay />
              </Button>
            </Tooltip>
          </div>

          <Button fullWidth variant="subtle" color="red" onClick={open}>
            Réinitialiser le prosit
          </Button>
        </AppShell.Navbar>

        <AppShell.Main>
          <div className="px-20">{children}</div>
        </AppShell.Main>

        <AppShell.Aside p="md" className="flex flex-col gap-3 overflow-auto">
          <Title order={2}>Aide</Title>
          <Title order={3}>Vue de présentation</Title>
          <Text>
            La présentation s&apos;ouvre dans une popup qui contient les valeurs
            sous une forme plus lisible pensée pour être projetée.
          </Text>
          <Text>
            Les valeurs sont automatiquement mises à jour et la présentation est
            synchronisée avec le formulaire, l&apos;endroit où vous êtes dans le
            formulaire est mis en évidence dans la présentation.
          </Text>
          <Text>
            Gardez simplement le formulaire sur l&apos;écran de votre pc et la
            présentation sur le projecteur.
          </Text>

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
    </div>
  );
}
