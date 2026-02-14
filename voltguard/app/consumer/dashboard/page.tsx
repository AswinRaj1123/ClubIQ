"use client";

import React from "react";
import RaiseFaultRequest from "@/components/consumer/RaiseFaultRequest";
import MyRequests from "@/components/consumer/MyRequests";
import LiveLocationMap from "@/components/consumer/LiveLocationMap";

export default function ConsumerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Main Content */}
      <div className="col-span-12 space-y-6 xl:col-span-8">
        {/* Raise Fault Request */}
        <RaiseFaultRequest />

        {/* My Requests */}
        <MyRequests />
      </div>

      {/* Sidebar */}
      <div className="col-span-12 xl:col-span-4">
        {/* Live Location Map */}
        <LiveLocationMap />
      </div>
    </div>
  );
}
