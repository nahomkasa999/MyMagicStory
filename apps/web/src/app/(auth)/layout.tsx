"use client";

import { useSession } from "../hooks/session";
import { useRouter } from "next/navigation";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();
  
  React.useEffect(() => {
    if (session.session) {
      // router.push("/dashboard");
    }
  }, [session, router]);
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}