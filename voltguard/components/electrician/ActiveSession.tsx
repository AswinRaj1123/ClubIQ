"use client";
import React, { useState, useEffect } from "react";
import { faultAPI } from "@/lib/api";
import Link from "next/link";

interface PastRequest {
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

export default function ActiveSession() {
  const [pastRequests, setPastRequests] = useState<PastRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch completed/resolved requests on component mount
  useEffect(() => {
    fetchPastRequests();
    // Refresh every 30 seconds to get updated list
    const interval = setInterval(fetchPastRequests, 30000);
    
    // Listen for request completion events
    const handleRequestCompleted = () => {
      console.log("Request completed event received, refreshing...");
      fetchPastRequests();
    };
    
    window.addEventListener("session-completed", handleRequestCompleted as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("session-completed", handleRequestCompleted as EventListener);
    };
  }, []);

  const fetchPastRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await faultAPI.getAllFaultRequests("resolved");
      
      if (response.requests && response.requests.length > 0) {
        setPastRequests(response.requests as PastRequest[]);
      } else {
        setPastRequests([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load past requests";
      console.error("Error fetching past requests:", errorMessage);
      setPastRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await faultAPI.getAllFaultRequests("resolved");
      
      if (response.requests && response.requests.length > 0) {
        setPastRequests(response.requests as PastRequest[]);
      } else {
        setPastRequests([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh history";
      console.error("Error refreshing past requests:", errorMessage);
    } finally {
      setIsRefreshing(false);
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

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              📜 Past Request History
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh history"
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
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (pastRequests.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              📜 Past Request History
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh history"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No completed requests yet. Your past service history will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              📜 Past Request History
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {pastRequests.length} completed {pastRequests.length === 1 ? 'request' : 'requests'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh history"
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

      {/* Request List */}
      <div className="max-h-[500px] overflow-y-auto">
        {pastRequests.slice(0, 10).map((request) => (
          <div
            key={request.id}
            className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {request.title}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
                    request.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    request.priority === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    request.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {request.priority.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {request.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{request.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(request.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-400">
                  <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
                
                {request.photo_url && (
                  <button
                    onClick={() => window.open(request.photo_url, '_blank')}
                    className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    📷 View Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {pastRequests.length > 10 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 10 most recent requests
          </p>
        </div>
      )}
    </div>
  );
}
