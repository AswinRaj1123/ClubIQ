"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { faultAPI } from "@/lib/api";

interface FaultRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  photo_url?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<FaultRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await faultAPI.getMyFaultRequests();
      console.log("Fetched requests:", response);
      setRequests(response.requests);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load requests";
      console.error("Error fetching requests:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (
    status: string
  ): "warning" | "success" | "error" | "info" => {
    switch (status) {
      case "open":
        return "warning";
      case "assigned":
        return "info";
      case "in_progress":
        return "success";
      case "resolved":
        return "info";
      case "closed":
        return "error";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return "📋";
      case "assigned":
        return "👨‍🔧";
      case "in_progress":
        return "⚡";
      case "resolved":
        return "✅";
      case "closed":
        return "❌";
      default:
        return "📋";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "high":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
      case "critical":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch {
      return dateString;
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">Error: {error}</p>
            <Button 
              onClick={fetchMyRequests} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No requests yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Raise a fault request to get started
            </p>
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
                      <span className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                        {request.id.substring(0, 8)}
                      </span>
                      <Badge 
                        variant="light" 
                        color={getStatusColor(request.status)}
                      >
                        {getStatusIcon(request.status)} {request.status.toUpperCase()}
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
                      {request.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {request.description}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>📍 {request.location}</p>
                      <p>🕒 {formatDate(request.created_at)}</p>
                      {request.assigned_to && (
                        <p>👨‍🔧 Assigned to: {request.assigned_to}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {request.photo_url && (
                      <Button 
                        onClick={() => window.open(request.photo_url, '_blank')}
                        size="sm" 
                        variant="outline"
                      >
                        📷 View Photo
                      </Button>
                    )}
                    {request.status !== "open" && request.status !== "closed" && (
                      <Link href={`/consumer/chat/${request.id}`}>
                        <Button size="sm" variant="primary">
                          💬 Chat
                        </Button>
                      </Link>
                    )}
                    {request.status === "open" && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Waiting for electrician to accept...
                      </div>
                    )}
                  </div>
                </div>
                {request.photo_url && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📷 <span className="font-medium">Photo uploaded</span> - click "View Photo" button to preview
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
