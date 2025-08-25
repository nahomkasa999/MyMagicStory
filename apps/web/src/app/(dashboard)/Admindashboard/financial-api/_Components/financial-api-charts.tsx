import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, LineChart } from "lucide-react";

export function FinancialApiCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Cost Breakdown by Service
          </CardTitle>
          <CardDescription>Where your money is going this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Replicate API</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <span className="text-sm font-medium">$2,110</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Supabase Database</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
              <span className="text-sm font-medium">$649</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Supabase Storage</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "12%" }}></div>
              </div>
              <span className="text-sm font-medium">$389</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Other Services</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "3%" }}></div>
              </div>
              <span className="text-sm font-medium">$99</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Usage Trends
          </CardTitle>
          <CardDescription>API calls and storage usage over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Replicate API Calls</span>
              <span className="font-medium">45,230 calls</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Storage Usage</span>
              <span className="font-medium">2.1 TB / 5 TB</span>
            </div>
            <Progress value={42} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Database Size</span>
              <span className="font-medium">156 GB</span>
            </div>
            <Progress value={31} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
