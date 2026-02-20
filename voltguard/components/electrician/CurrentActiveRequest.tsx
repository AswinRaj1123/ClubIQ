"use client";

import React, { useState, useEffect } from "react";
import { faultAPI } from "@/lib/api";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

interface ActiveRequest {
  id: string;
  consumer_id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: string;
  photo_url?: string;
  status: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export default function CurrentActiveRequest() {
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch current active request on component mount
  useEffect(() => {
    fetchActiveRequest();
    // Refresh every 15 seconds to get updated status
    const interval = setInterval(fetchActiveRequest, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchActiveRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get assigned requests first
      const assignedResponse = await faultAPI.getAllFaultRequests("assigned");
      if (assignedResponse.requests && assignedResponse.requests.length > 0) {
        setActiveRequest(assignedResponse.requests[0] as ActiveRequest);
        setIsLoading(false);
        return;
      }

      // If no assigned, try in_progress
      const inProgressResponse = await faultAPI.getAllFaultRequests("in_progress");
      if (inProgressResponse.requests && inProgressResponse.requests.length > 0) {
        setActiveRequest(inProgressResponse.requests[0] as ActiveRequest);
        setIsLoading(false);
        return;
      }

      // No active request found
      setActiveRequest(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load active request";
      console.error("Error fetching active request:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchActiveRequest();
    } catch (err) {
      console.error("Error refreshing active request:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          bar: "bg-red-500",
          light: "text-red-600 dark:text-red-400"
        };
      case "high":
        return {
          badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
          bar: "bg-orange-500",
          light: "text-orange-600 dark:text-orange-400"
        };
      case "medium":
        return {
          badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          bar: "bg-yellow-500",
          light: "text-yellow-600 dark:text-yellow-400"
        };
      default:
        return {
          badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          bar: "bg-green-500",
          light: "text-green-600 dark:text-green-400"
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return "📋";
      case "in_progress":
        return "⚡";
      default:
        return "📋";
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            ⚡ Current Active Request
          </h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading active request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            ⚡ Current Active Request
          </h3>
        </div>
        <div className="p-6 text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!activeRequest) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              ⚡ Current Active Request
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh request"
            >
              <svg 
                className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        <div className="p-6 text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No active requests assigned. Check the queue for available requests.
          </p>
        </div>
      </div>
    );
  }

  const priorityStyles = getPriorityStyles(activeRequest.priority);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              ⚡ Current Active Request
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Status: {getStatusIcon(activeRequest.status)} {activeRequest.status.replace('_', ' ').toUpperCase()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh request"
          >
            <svg 
              className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Priority Bar */}
      <div className={`h-1 ${priorityStyles.bar}`}></div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title and Priority */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {activeRequest.title}
              </h4>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${priorityStyles.badge}`}>
                {activeRequest.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activeRequest.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
              <div className="flex items-start gap-2">
                <svg className="size-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{activeRequest.location}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned Date</p>
              <div className="flex items-start gap-2">
                <svg className="size-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{formatDate(activeRequest.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Request ID */}
          <div className="pt-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Request ID</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 font-mono">
              {activeRequest.id.substring(0, 12)}...
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Link href={`/electrician/chat/${activeRequest.id}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                💬 Chat with Consumer
              </Button>
            </Link>
            {activeRequest.photo_url && (
              <Button 
                onClick={() => window.open(activeRequest.photo_url, '_blank')}
                variant="outline"
                size="sm"
              >
                📷 View Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
