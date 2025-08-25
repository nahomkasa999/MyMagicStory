import React, { ReactNode } from "react";

export default function UserSubscriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6 w-[70%] m-auto">
      {/* The main title and description are now handled by UserSubscriptionHeader within page.tsx */}
      {children}
    </div>
  );
}
