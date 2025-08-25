"use client";

import React from 'react';
import { SystemHealthHeader } from './_Components/system-health-header';
import { SystemStatusIndicators } from './_Components/system-status-indicators';
import { ApplicationErrorLog } from './_Components/application-error-log';
import { ApiPerformanceMetrics } from './_Components/api-performance-metrics';
import { BackgroundJobStatus } from './_Components/background-job-status';
import { MaintenanceDebugging } from './_Components/maintenance-debugging';

function SystemHealthPage() {
  const handleRefresh = () => {
    console.log("Refreshing system health data...");
    // Implement data fetching/refreshing logic here
  };

  return (
    <div className="space-y-6">
      <SystemHealthHeader onRefresh={handleRefresh} />
      <SystemStatusIndicators />
      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationErrorLog />
        <ApiPerformanceMetrics />
        <BackgroundJobStatus />
      </div>
      <MaintenanceDebugging />
    </div>
  );
}

export default SystemHealthPage;
