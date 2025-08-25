"use client";

import {
  BookCopy,
  LayoutDashboard,
  Megaphone,
  User,
  DollarSign,
  MonitorCheck,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation'; // Import usePathname from Next.js

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Use absolute paths and consistent naming
export const sidebarItems = [
  { title: "Dashboard Overview", url: "/Admindashboard", icon: LayoutDashboard },
  { title: "Template Management", url: "/Admindashboard/template-management", icon: FileText },
  { title: "Blog Management", url: "/Admindashboard/blog-management", icon: Megaphone },
  { title: "User & Subscription", url: "/Admindashboard/user-subscription", icon: User },
  { title: "Content & Project", url: "/Admindashboard/content-project", icon: BookCopy },
  { title: "Financial & API", url: "/Admindashboard/financial-api", icon: DollarSign },
  { title: "System Health", url: "/Admindashboard/system-health", icon: MonitorCheck },
];

export function AppSidebar() {
  const pathname = usePathname(); // Get the current path
  const collapsed = false; // To be edited later

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin Dashboard</span>
            <span className="text-xs text-muted-foreground">Story Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      className="w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">admin@platform.com</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}