"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Request {
  id: string;
  consumerName: string;
  description: string;
  location: string;
  image?: string;
  status: "pending" | "active" | "completed";
  timestamp: string;
  priority: "high" | "medium" | "low";
}

// Sample data - replace with actual data from API
const requestData: Request[] = [
  {
    id: "REQ-001",
    consumerName: "John Doe",
    description: "Main circuit breaker keeps tripping - urgent help needed",
    location: "123 Main St, Coimbatore",
    image: "/images/product/product-01.jpg",
    status: "pending",
    timestamp: "10 mins ago",
    priority: "high",
  },
  {
    id: "REQ-002",
    consumerName: "Sarah Miller",
    description: "Light switches not working in two rooms",
    location: "456 Park Avenue, Coimbatore",
    status: "pending",
    timestamp: "25 mins ago",
    priority: "medium",
  },
  {
    id: "REQ-003",
    consumerName: "Mike Johnson",
    description: "Power outlet sparking - need immediate assistance",
    location: "789 Oak Drive, Coimbatore",
    image: "/images/product/product-02.jpg",
    status: "pending",
    timestamp: "1 hour ago",
    priority: "high",
  },
  {
    id: "REQ-004",
    consumerName: "Emily Davis",
    description: "Ceiling fan installation needed",
    location: "321 Elm Street, Coimbatore",
    status: "pending",
    timestamp: "2 hours ago",
    priority: "low",
  },
];

export default function RequestQueue() {
  const handleAccept = (requestId: string) => {
    console.log("Accepted request:", requestId);
    // TODO: Implement accept logic
  };

  const handleReject = (requestId: string) => {
    console.log("Rejected request:", requestId);
    // TODO: Implement reject logic
  };

  const handleViewLocation = (location: string) => {
    console.log("View location:", location);
    // TODO: Implement location view
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              📥 Request Queue
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pending service requests from consumers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
              <svg
                className="stroke-current fill-white dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Request List */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {requestData.map((request) => (
            <div
              key={request.id}
              className="p-4 border border-gray-200 rounded-xl dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white/90">
                        {request.consumerName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.id} • {request.timestamp}
                      </p>
                    </div>
                    <Badge
                      color={
                        request.priority === "high"
                          ? "error"
                          : request.priority === "medium"
                          ? "warning"
                          : "light"
                      }
                    >
                      {request.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                    {request.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {request.location}
                  </div>

                  {request.image && (
                    <div className="mt-3">
                      <div className="relative w-full h-32 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800">
                        <Image
                          src={request.image}
                          alt="Fault photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-2 lg:flex-col lg:w-32">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="flex items-center justify-center flex-1 gap-1.5 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-success-500 hover:bg-success-600 transition-colors"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex items-center justify-center flex-1 gap-1.5 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-error-500 hover:bg-error-600 transition-colors"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject
                  </button>
                  <button
                    onClick={() => handleViewLocation(request.location)}
                    className="flex items-center justify-center flex-1 gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {requestData.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No pending requests at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
