"use client";

import React from "react";
import RaiseFaultRequest from "@/components/consumer/RaiseFaultRequest";
import MyRequests from "@/components/consumer/MyRequests";
import PastRequests from "@/components/consumer/PastRequests";
import LiveLocationMap from "@/components/consumer/LiveLocationMap";
import { SharedLocationProvider } from "@/context/SharedLocationContext";

export default function ConsumerDashboard() {
  return (
    <SharedLocationProvider>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
          {/* Raise Fault Request */}
          <RaiseFaultRequest />

          {/* My Requests - Active/Live */}
          <MyRequests />
        </div>

        {/* Sidebar */}
        <div className="col-span-12 space-y-6 xl:col-span-4">
          {/* Live Location Map */}
          <LiveLocationMap />
          
          {/* Past Requests - Completed */}
          <PastRequests />
        </div>
      </div>
    </SharedLocationProvider>
  );
}
