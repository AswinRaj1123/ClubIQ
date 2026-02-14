"use client";

import AppHeader from "@/components/layout/AppHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <AppHeader />
        
        {/* Page Content */}
        <div className="p-4 mx-auto w-full max-w-7xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
