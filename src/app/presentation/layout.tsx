"use client";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full p-10 mb-10">{children}</div>;
}
