import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";

export function FinancialApiAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Alerts & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Cost spike detected</p>
            <p className="text-xs text-yellow-700">Replicate API usage increased by 20% in the last 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">Storage optimization opportunity</p>
            <p className="text-xs text-blue-700">Consider archiving projects older than 6 months to reduce costs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
