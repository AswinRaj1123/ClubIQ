import type { Metadata } from "next";
import ElectricianMetrics from "@/components/electrician/ElectricianMetrics";
import RequestQueue from "@/components/electrician/RequestQueue";
import CurrentActiveRequest from "@/components/electrician/CurrentActiveRequest";
import ActiveSession from "@/components/electrician/ActiveSession";
import ElectricianGuard from "@/components/electrician/ElectricianGuard";
import React from "react";

export const metadata: Metadata = {
  title: "Electrician Dashboard - VoltGuard",
  description: "Manage service requests and view request history",
};

export default function ElectricianDashboard() {
  return (
    <ElectricianGuard>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ElectricianMetrics />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RequestQueue />
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-6">
          <CurrentActiveRequest />
          <ActiveSession />
        </div>
      </div>
    </ElectricianGuard>
  );
}
