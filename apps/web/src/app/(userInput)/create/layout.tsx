import type { Metadata } from "next";
import { Navbar } from "@/app/(landing)/_components/navbar";

export const metadata: Metadata = {
  title: "Mymagicstory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
