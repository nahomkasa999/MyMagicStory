"use client";

import React, { useState } from 'react';
import { FinancialApiHeader } from './_Components/financial-api-header';
import { FinancialApiMetrics } from './_Components/financial-api-metrics';
import { FinancialApiCharts } from './_Components/financial-api-charts';
import { FinancialApiAlerts } from './_Components/financial-api-alerts';

function FinancialApiPage() {
  const [timeRange, setTimeRange] = useState("30days"); // State for the time range selector

  return (
    <div className="space-y-6">
      <FinancialApiHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <FinancialApiMetrics />
      <FinancialApiCharts />
      <FinancialApiAlerts />
    </div>
  );
}

export default FinancialApiPage;
