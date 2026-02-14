"use client";

import AppHeader from "@/components/layout/AppHeader";
import React from "react";

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <AppHeader />
      
      {/* Page Content */}
      <div className="flex-1 p-4 mx-auto w-full max-w-7xl md:p-6">
        {children}
      </div>
    </div>
  );
}
