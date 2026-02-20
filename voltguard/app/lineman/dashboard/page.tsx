import type { Metadata } from "next";
import LinemanMetrics from "@/components/lineman/LinemanMetrics";
import LiveMonitoringChart from "@/components/lineman/LiveMonitoringChart";
import CostBreakdownChart from "@/components/lineman/CostBreakdownChart";
import RecentFaultsList from "@/components/lineman/RecentFaultsList";
import ControlPanel from "@/components/lineman/ControlPanel";
import React from "react";

export const metadata: Metadata = {
  title: "Lineman Dashboard - VoltGuard Power Line Inspection",
  description: "Autonomous power line inspection dashboard",
};

export default function LinemanDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Metrics - Full Width */}
      <div className="col-span-12">
        <LinemanMetrics />
      </div>

      {/* Charts Row */}
      <div className="col-span-12 xl:col-span-7">
        <LiveMonitoringChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <CostBreakdownChart />
      </div>

      {/* Faults and Control Panel Row */}
      <div className="col-span-12">
        <RecentFaultsList />
      </div>

      <div className="col-span-12">
        <ControlPanel />
      </div>
    </div>
  );
}
