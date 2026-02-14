import type { Metadata } from "next";
import AdminMetrics from "@/components/admin/AdminMetrics";
import LiveMonitoringChart from "@/components/admin/LiveMonitoringChart";
import CostBreakdownChart from "@/components/admin/CostBreakdownChart";
import RecentFaultsList from "@/components/admin/RecentFaultsList";
import ControlPanel from "@/components/admin/ControlPanel";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard - VoltGuard Power Line Inspection",
  description: "Autonomous power line inspection dashboard",
};

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Metrics - Full Width */}
      <div className="col-span-12">
        <AdminMetrics />
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
