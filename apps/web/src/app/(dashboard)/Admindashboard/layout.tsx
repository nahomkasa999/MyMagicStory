import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminDashboardShell from "./_Components/admin-dashboard-shell"; // New wrapper component
import { AppSidebar } from "./_Components/admin-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminDashboardShell>
        <AppSidebar />
        <main>
          {children}
        </main>
      </AdminDashboardShell>
    </SidebarProvider>
  );
}