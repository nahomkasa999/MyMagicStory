import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ApiPerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Performance</CardTitle>
        <CardDescription>Response times and request volume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Average Response Time</span>
            <span className="font-medium">142ms</span>
          </div>
          <Progress value={25} className="h-2 bg-gray-200">
            <div className="h-2 bg-green-500" style={{ width: '25%' }} />
          </Progress>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>P95 Response Time</span>
            <span className="font-medium">380ms</span>
          </div>
          <Progress value={60} className="h-2 bg-gray-200">
            <div className="h-2 bg-yellow-500" style={{ width: '60%' }} />
          </Progress>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>P99 Response Time</span>
            <span className="font-medium">850ms</span>
          </div>
          <Progress value={85} className="h-2 bg-gray-200">
            <div className="h-2 bg-red-500" style={{ width: '85%' }} />
          </Progress>
        </div>
        <div className="pt-2 border-t mt-4">
          <div className="flex justify-between text-sm">
            <span>Requests/Hour</span>
            <span className="font-medium">2,847</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Error Rate</span>
            <span className="font-medium text-red-600">0.12%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
