import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

interface SystemHealthHeaderProps {
  onRefresh: () => void;
}

export function SystemHealthHeader({ onRefresh }: SystemHealthHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health & Monitoring</h1>
        <p className="text-muted-foreground">Monitor system performance, errors, and background jobs</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-green-500 hover:bg-green-500">All Systems Operational</Badge> {/* Added hover for consistency */}
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
