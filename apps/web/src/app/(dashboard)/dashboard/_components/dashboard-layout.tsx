"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserAccountHeader } from "./user-account-header";
import { StorybooksGrid } from "./storybooks-grid";

interface User {
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "paid";
}

interface Storybook {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  status: "completed" | "draft" | "processing";
  pageCount: number;
}

interface DashboardLayoutProps {
  user: User;
  storybooks: Storybook[];
}

export function DashboardLayout({ user, storybooks }: DashboardLayoutProps) {
  const router = useRouter();
  return (
    <div className="space-y-3">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">My Storybooks</h1>
          <p className="text-xs text-muted-foreground">
            Manage and view your magical storybook collection
          </p>
        </div>
        
        <Button
          size="sm"
          className="sm:w-auto h-7 text-xs"
          onClick={() => router.push("/dashboard/choicetemplate")}
        >
          <Plus className="h-3 w-3 mr-1" />
          Create New Storybook
        </Button>
      </div>
      
      {/* Storybooks Grid */}
      <StorybooksGrid storybooks={storybooks} />
    </div>
  );
}