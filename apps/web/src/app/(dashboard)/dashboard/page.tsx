"use client";

import { DashboardLayout } from "./_components/dashboard-layout";
import { useUserStorybooks } from "./_hooks/useUserStorybooks";

export default function DashboardPage() {
  const { data, isLoading, error } = useUserStorybooks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your storybooks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load your storybooks</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      user={data.user}
      storybooks={data.storybooks}
    />
  );
}