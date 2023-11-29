"use client";
import { Maximize2, Minus, X } from "lucide-react";
import clsx from "clsx";
import { ActionIcon } from "@mantine/core";

// biome-ignore lint/suspicious/noEmptyInterface: empty interface is used to extend HTMLAttributes
interface WindowsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function WindowsHeader({
  className,
  hidden = false,
  ...props
}: WindowsHeaderProps) {
  const importWindow = async () => {
    return (await import("@tauri-apps/api/window")).appWindow;
  };

  const maximize = async () => {
    const appWindow = await importWindow();
    await appWindow.maximize();
  };

  const minimize = async () => {
    const appWindow = await importWindow();
    await appWindow.minimize();
  };

  const close = async () => {
    const appWindow = await importWindow();
    await appWindow.close();
  };

  return (
    <div
      className={clsx("flex items-center justify-between gap-3", className)}
      {...props}
    >
      <ActionIcon variant="subtle" onClick={minimize}>
        <Minus size={20} />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={maximize}>
        <Maximize2 size={20} />
      </ActionIcon>
      <ActionIcon bg="red" onClick={close}>
        <X size={20} />
      </ActionIcon>
    </div>
  );
}
