"use client"
import React, { ReactNode } from "react"
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./admin-sidebar" 
import { useParams } from "next/navigation"

export default function Layout({ children }: { children: ReactNode }) {
  const params = useParams()
  const currentSection = params.section || "Dashboard"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Admin Dashboard</span>
              <span>/</span>
              <span className="text-foreground">{currentSection}</span>
            </div>
          </header>
          <main>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
