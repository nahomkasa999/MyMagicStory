import React, { ReactNode } from "react";

export default function BlogManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* The main title and description are now handled by BlogManagementHeader within page.tsx */}
      {children}
    </div>
  );
}
