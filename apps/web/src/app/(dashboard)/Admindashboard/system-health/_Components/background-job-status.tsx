import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";

export type BackgroundJob = {
  id: string;
  type: string;
  status: "Processing" | "Pending" | "Failed" | "Completed";
  project: string;
  progress: string;
  startTime: string;
};

const mockBackgroundJobs: BackgroundJob[] = [
  {
    id: "job_001",
    type: "PDF Generation",
    status: "Processing",
    project: "Adventure Story #12345",
    progress: "7/10 pages",
    startTime: "14:30:15",
  },
  {
    id: "job_002",
    type: "Thumbnail Creation",
    status: "Pending",
    project: "Mystery Book #12346",
    progress: "Queued",
    startTime: "14:32:08",
  },
  {
    id: "job_003",
    type: "PDF Generation",
    status: "Failed",
    project: "Fairy Tale #12344",
    progress: "Error at page 3",
    startTime: "14:25:42",
  },
  {
    id: "job_004",
    type: "PDF Generation",
    status: "Completed",
    project: "Educational Story #12343",
    progress: "10/10 pages",
    startTime: "14:20:15",
  },
];

export function BackgroundJobStatus() {
  const handleRetryJob = (jobId: string) => {
    console.log("Retrying job:", jobId);
    // Implement logic to retry the failed job
  };

  const handleViewJobDetails = (job: BackgroundJob) => {
    console.log("Viewing job details:", job);
    // Implement logic to show more details about the job
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Jobs</CardTitle>
        <CardDescription>Current job queue status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockBackgroundJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {job.type}
                  </Badge>
                  <Badge
                    variant={
                      job.status === "Completed"
                        ? "default"
                        : job.status === "Processing"
                          ? "secondary"
                          : job.status === "Failed"
                            ? "destructive"
                            : "outline"
                    }
                    className={
                        job.status === "Completed"
                            ? "bg-green-500 hover:bg-green-500"
                            : job.status === "Processing"
                                ? "bg-blue-500 hover:bg-blue-500"
                                : job.status === "Failed"
                                    ? "bg-red-500 hover:bg-red-500"
                                    : ""
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{job.project}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>Progress: {job.progress}</span>
                  <span>Started: {job.startTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {job.status === "Failed" && (
                  <Button variant="ghost" size="sm" onClick={() => handleRetryJob(job.id)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleViewJobDetails(job)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
