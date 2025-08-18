"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, ArrowUp } from "lucide-react";

interface UserStatisticsProps {
  stats: {
    totalUsers: number;
    paidUsers: number;
    freeUsers: number;
  };
}

export function UserStatistics({ stats }: UserStatisticsProps) {
  const paidPercentage = ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1);
  const freePercentage = ((stats.freeUsers / stats.totalUsers) * 100).toFixed(1);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Paid Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats.paidUsers}</div>
            <p className="text-xs text-muted-foreground">
              {paidPercentage}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Free Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats.freeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {freePercentage}% of total users
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}