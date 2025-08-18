"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserStatistics } from "@/app/(dashboard)/Admindashboard/_components/user-statistics";
import StorybookStatistics from "./storybook-statistics";
import RevenueTracking from "./revenue-tracking";

// Sample data for demonstration
const sampleStats = {
  totalUsers: 1250,
  paidUsers: 350,
  freeUsers: 900,
};

export function AdminDashboardLayout() {
  return (
    <div className="space-y-3 p-3 sm:p-4">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Oversee platform statistics and manage content
          </p>
        </div>
        
        <Link href="/Admindashboard/createtemplate">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>
      
      {/* User Statistics Section */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-2">User Statistics</h2>
        <UserStatistics stats={sampleStats} />
      </section>

      {/* Storybook Statistics Section */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-2">Storybook Statistics</h2>
        <StorybookStatistics />
      </section>

      {/* Revenue Tracking Section */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-2">Revenue Tracking</h2>
        <RevenueTracking />
      </section>
    </div>
  );
}