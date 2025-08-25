import React, { ReactNode } from "react";

export default function SystemHealthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6 m-auto w-[70%]">
      {/* The main title and description are now handled by SystemHealthHeader within page.tsx */}
      {children}
    </div>
  );
}
