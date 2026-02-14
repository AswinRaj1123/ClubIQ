"use client";

import React, { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

interface Request {
  id: string;
  description: string;
  location: string;
  status: "pending" | "active" | "rejected" | "completed";
  timestamp: string;
  electrician?: string;
}

export default function MyRequests() {
  const [requests] = useState<Request[]>([
    {
      id: "REQ-001",
      description: "Power outage in living room, multiple outlets not working",
      location: "123 Main St, Apartment 4B",
      status: "active",
      timestamp: "2024-02-14 10:30 AM",
      electrician: "John Electrician",
    },
    {
      id: "REQ-002",
      description: "Circuit breaker keeps tripping",
      location: "123 Main St, Apartment 4B",
      status: "pending",
      timestamp: "2024-02-13 03:45 PM",
    },
    {
      id: "REQ-003",
      description: "Faulty light switch in bedroom",
      location: "123 Main St, Apartment 4B",
      status: "completed",
      timestamp: "2024-02-12 09:15 AM",
      electrician: "Sarah Tech",
    },
  ]);

  const getStatusColor = (
    status: string
  ): "warning" | "success" | "error" | "info" => {
    switch (status) {
      case "pending":
        return "warning";
      case "active":
        return "success";
      case "rejected":
        return "error";
      case "completed":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "active":
        return "✅";
      case "rejected":
        return "❌";
      case "completed":
        return "🎉";
      default:
        return "📋";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          📋 My Requests
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track all your fault requests and their status
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-theme-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {request.id}
                      </span>
                      <Badge variant="light" color={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)} {request.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
                      {request.description}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>📍 {request.location}</p>
                      <p>🕒 {request.timestamp}</p>
                      {request.electrician && (
                        <p>👨‍🔧 Assigned to: {request.electrician}</p>
                      )}
                    </div>
                  </div>
                  {request.status === "active" && (
                    <Link href="/chat">
                      <Button size="sm" variant="primary" className="ml-4">
                        View Chat
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
