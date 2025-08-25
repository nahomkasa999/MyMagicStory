import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export type ErrorLogEntry = {
  timestamp: string;
  type: "ERROR" | "WARNING" | "INFO";
  message: string;
  source: string;
  userId: string;
  level: "error" | "warning" | "info";
};

const mockErrorLogs: ErrorLogEntry[] = [
  {
    timestamp: "2024-01-15 14:32:15",
    type: "ERROR",
    message: "PDF generation timeout for project ID: 12345",
    source: "PDF Generator",
    userId: "user_789",
    level: "error",
  },
  {
    timestamp: "2024-01-15 14:28:42",
    type: "WARNING",
    message: "High memory usage detected (85%)",
    source: "System Monitor",
    userId: "-",
    level: "warning",
  },
  {
    timestamp: "2024-01-15 14:15:33",
    type: "ERROR",
    message: "Database connection pool exhausted",
    source: "Database",
    userId: "-",
    level: "error",
  },
  {
    timestamp: "2024-01-15 14:10:21",
    type: "INFO",
    message: "Scheduled backup completed successfully",
    source: "Backup Service",
    userId: "-",
    level: "info",
  },
  {
    timestamp: "2024-01-15 13:50:00",
    type: "ERROR",
    message: "Authentication failed for user user_101",
    source: "Auth Service",
    userId: "user_101",
    level: "error",
  },
];

export function ApplicationErrorLog() {
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all-sources");

  const filteredLogs = useMemo(() => {
    return mockErrorLogs.filter((log) => {
      const matchesLevel = levelFilter === "all" || log.level === levelFilter;
      const matchesSource = sourceFilter === "all-sources" || log.source === sourceFilter;
      return matchesLevel && matchesSource;
    });
  }, [levelFilter, sourceFilter]);

  const handleViewDetails = (log: ErrorLogEntry) => {
    console.log("Viewing error details:", log);
    // Implement logic to show more details about the error
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Application Error Log</CardTitle>
            <CardDescription>Recent errors and system issues</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sources">All Sources</SelectItem>
                <SelectItem value="PDF Generator">PDF Generator</SelectItem>
                <SelectItem value="Auth Service">Auth Service</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="System Monitor">System Monitor</SelectItem>
                <SelectItem value="Backup Service">Backup Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No errors found for the selected filters.</div>
          ) : (
            filteredLogs.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      error.level === "error"
                        ? "bg-red-500"
                        : error.level === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge
                        variant={
                          error.level === "error"
                            ? "destructive"
                            : error.level === "warning"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {error.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{error.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        {error.source}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{error.message}</p>
                    {error.userId !== "-" && <p className="text-xs text-muted-foreground">User: {error.userId}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(error)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
