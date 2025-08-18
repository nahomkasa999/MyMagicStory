import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Perkly",
  // description: "Perkly is a platform for creating and managing your organization's perks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}
