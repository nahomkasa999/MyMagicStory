"use client";

import React, { useState, useMemo } from 'react';
import { UserSubscriptionHeader } from './_Components/user-subscription-header';
import { UserSubscriptionFilters } from './_Components/user-subscription-filters';
import { UserAccountsTable, UserAccount } from './_Components/user-accounts-table';
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";


// Mock data for users (from the AI reference, expanded slightly for more filter options)
const mockUsers: UserAccount[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    name: "John Doe",
    plan: "Pro",
    status: "Active",
    signupDate: "2024-01-10",
    lastActivity: "2024-01-16",
    projectsUsed: 8,
    projectsLimit: 50,
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    name: "Jane Smith",
    plan: "Starter",
    status: "Active",
    signupDate: "2024-01-12",
    lastActivity: "2024-01-15",
    projectsUsed: 3,
    projectsLimit: 10,
  },
  {
    id: 3,
    email: "mike.wilson@example.com",
    name: "Mike Wilson",
    plan: "Free",
    status: "Suspended",
    signupDate: "2024-01-08",
    lastActivity: "2024-01-14",
    projectsUsed: 2,
    projectsLimit: 3,
  },
  {
    id: 4,
    email: "alice.johnson@example.com",
    name: "Alice Johnson",
    plan: "Pro",
    status: "Active",
    signupDate: "2023-12-01",
    lastActivity: "2024-01-17",
    projectsUsed: 45,
    projectsLimit: 50, // Near limit
  },
  {
    id: 5,
    email: "bob.brown@example.com",
    name: "Bob Brown",
    plan: "Free",
    status: "Active",
    signupDate: "2024-01-05",
    lastActivity: "2024-01-10",
    projectsUsed: 3,
    projectsLimit: 3, // Exceeded limit
  },
  {
    id: 6,
    email: "charlie.davis@example.com",
    name: "Charlie Davis",
    plan: "Trialing",
    status: "Active",
    signupDate: "2024-01-18",
    lastActivity: "2024-01-18",
    projectsUsed: 0,
    projectsLimit: 5,
  },
];

function UserSubscriptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quotaFilter, setQuotaFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan = planFilter === "all" || user.plan === planFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      const matchesQuota = () => {
        if (quotaFilter === "all") return true;
        if (quotaFilter === "near-limit") {
          return user.projectsUsed / user.projectsLimit >= 0.8 && user.projectsUsed < user.projectsLimit;
        }
        if (quotaFilter === "exceeded") {
          return user.projectsUsed >= user.projectsLimit;
        }
        return false;
      };

      return matchesSearch && matchesPlan && matchesStatus && matchesQuota();
    });
  }, [searchQuery, planFilter, statusFilter, quotaFilter]);


  return (
    <div className="space-y-6">
      <UserSubscriptionHeader />
      <UserSubscriptionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        quotaFilter={quotaFilter}
        setQuotaFilter={setQuotaFilter}
      />

      {filteredUsers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground text-center mb-6">
            Try adjusting your search or filter criteria.
          </p>
        </Card>
      ) : (
        <UserAccountsTable users={filteredUsers} />
      )}
    </div>
  );
}

export default UserSubscriptionPage;
