"use client";
import React, { useState, useEffect, useRef } from "react";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Link from "next/link";
import { faultAPI } from "@/lib/api";
import dynamic from "next/dynamic";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface FaultRequest {
  id: string;
  consumer_id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  photo_url?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export default function RequestQueue() {
  const [requests, setRequests] = useState<FaultRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<FaultRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    
    // Listen for session completion event
    const handleSessionCompleted = () => {
      console.log("Session completed event received, refreshing...");
      fetchRequests();
    };
    
    window.addEventListener("session-completed", handleSessionCompleted as EventListener);
    
    return () => {
      window.removeEventListener("session-completed", handleSessionCompleted as EventListener);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await faultAPI.getAllFaultRequests("open");
      console.log("Fetched requests:", response);
      setRequests(response.requests as FaultRequest[]);
      if (response.requests.length > 0) {
        setSelectedRequest(response.requests[0] as FaultRequest);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load requests";
      console.error("Error fetching requests:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      const token = localStorage.getItem("voltguard_token");
      const user = localStorage.getItem("voltguard_user");
      const userId = user ? JSON.parse(user).id : "";

      await faultAPI.updateFaultStatus(requestId, {
        status: "assigned",
        assigned_to: userId,
      });

      console.log("Request accepted:", requestId);
      alert("✅ Request accepted! Opening chat in a new tab...");
      
      // Open chat in a new tab
      window.open(`/electrician/chat/${requestId}`, "_blank");
      
      // Dispatch custom event to notify ActiveSession
      window.dispatchEvent(new CustomEvent("request-accepted", { detail: { requestId } }));
      
      // Refresh requests after a short delay to ensure DB is updated
      setTimeout(() => {
        fetchRequests();
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to accept request";
      console.error("Error accepting request:", errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      // For rejection, we just don't assign it - it stays open
      console.log("Request rejected:", requestId);
      alert("❌ Request rejected and remains available for other electricians.");
      
      // Refresh requests to remove it from accepted list
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setActionLoading(null);
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

  const getStatusBadgeColor = (
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            📥 Pending Requests
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Accept or reject service requests from consumers
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">Error: {error}</p>
            <Button 
              onClick={fetchRequests} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              All requests have been accepted or closed
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requests List */}
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedRequest?.id === request.id
                      ? "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          color={getStatusBadgeColor(request.status)}
                          variant="light"
                        >
                          {request.status.toUpperCase()}
                        </Badge>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {request.title}
                      </h4>
                    </div>
                    {request.photo_url && (
                      <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded">
                        📷
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {request.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    📍 {request.location}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Request Details */}
            {selectedRequest && (
              <div className="space-y-4">
                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-64 bg-gray-100 dark:bg-gray-800">
                  {selectedRequest.latitude && selectedRequest.longitude ? (
                    <MapContainer
                      center={[selectedRequest.latitude, selectedRequest.longitude]}
                      zoom={15}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[selectedRequest.latitude, selectedRequest.longitude]}>
                        <Popup>{selectedRequest.location}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <p className="text-gray-500 dark:text-gray-400">📍 Location coordinates not available</p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">REQUEST ID</p>
                    <p className="font-mono text-sm text-gray-800 dark:text-white">
                      {selectedRequest.id.substring(0, 12)}...
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">TITLE</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {selectedRequest.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">DESCRIPTION</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">LOCATION</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      📍 {selectedRequest.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">SUBMITTED</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      🕒 {formatDate(selectedRequest.created_at)}
                    </p>
                  </div>

                  {selectedRequest.photo_url && (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">PHOTO</p>
                      <Button 
                        onClick={() => window.open(selectedRequest.photo_url, '_blank')}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        📷 View Photo
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex gap-2">
                    {selectedRequest.status === "open" ? (
                      <>
                        <Button
                          onClick={() => handleAccept(selectedRequest.id)}
                          variant="primary"
                          className="flex-1"
                          disabled={actionLoading === selectedRequest.id}
                        >
                          {actionLoading === selectedRequest.id ? "Accepting..." : "✅ Accept"}
                        </Button>
                        <Button
                          onClick={() => handleReject(selectedRequest.id)}
                          variant="outline"
                          className="flex-1"
                          disabled={actionLoading === selectedRequest.id}
                        >
                          ❌ Reject
                        </Button>
                      </>
                    ) : selectedRequest.status !== "closed" ? (
                      <Link href={`/electrician/chat/${selectedRequest.id}`} className="w-full">
                        <Button variant="primary" className="w-full">
                          💬 Chat with Consumer
                        </Button>
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2 w-full">
                        Request is closed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
