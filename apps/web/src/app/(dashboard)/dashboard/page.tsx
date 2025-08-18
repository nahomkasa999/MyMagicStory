"use client";

import { DashboardLayout } from "./_components/dashboard-layout";
import { sampleUser, sampleStorybooks } from "./_components/smapleuser";
import { usePrivateData } from "@/providers/Fetcher";

export default function DashboardPage() {
const { data, isLoading } = usePrivateData();
if (isLoading) return <p>Loading...</p>
  return (
    <DashboardLayout 
      user={sampleUser} 
      storybooks={sampleStorybooks} 
    />
  );
}