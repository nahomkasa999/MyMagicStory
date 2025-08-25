import React, { ReactNode } from "react";

export default function FinancialApiLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6 w-[70%] m-auto">
      {/* The main title and description are now handled by FinancialApiHeader within page.tsx */}
      {children}
    </div>
  );
}
