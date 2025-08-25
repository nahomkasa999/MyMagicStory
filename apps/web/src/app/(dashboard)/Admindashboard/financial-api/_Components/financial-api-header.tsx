import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

interface FinancialApiHeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function FinancialApiHeader({ timeRange, setTimeRange }: FinancialApiHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial & API Cost Tracking</h1>
        <Info className="h-4 w-4 text-muted-foreground" />
      </div>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="current-month">Current Month</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
