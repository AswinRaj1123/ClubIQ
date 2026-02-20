"use client";
import React from "react";
import Badge from "../ui/badge/Badge";

interface Fault {
  id: string;
  type: string;
  location: string;
  severity: "critical" | "warning" | "info";
  time: string;
}

const faultsData: Fault[] = [
  {
    id: "1",
    type: "Broken Insulator",
    location: "Tower 12-B",
    severity: "critical",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "Vegetation Encroachment",
    location: "Segment 7",
    severity: "warning",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "Corrosion Detected",
    location: "Tower 9-C",
    severity: "warning",
    time: "28 min ago",
  },
  {
    id: "4",
    type: "Wire Sagging",
    location: "Section 4-A",
    severity: "critical",
    time: "1 hour ago",
  },
  {
    id: "5",
    type: "Bird Nest Detected",
    location: "Tower 15-D",
    severity: "info",
    time: "2 hours ago",
  },
];

export default function RecentFaultsList() {
  const getBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "light";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            ⚠️ Recent Faults Detected
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Latest issues detected during power line inspection
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-brand-600 border border-brand-300 rounded-lg hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-500/10">
          View All
        </button>
      </div>

      {/* Fault List */}
      <div className="p-6">
        <div className="space-y-4">
          {faultsData.map((fault) => (
            <div
              key={fault.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Fault Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    fault.severity === "critical"
                      ? "bg-error-50 dark:bg-error-500/10"
                      : fault.severity === "warning"
                      ? "bg-warning-50 dark:bg-warning-500/10"
                      : "bg-info-50 dark:bg-info-500/10"
                  }`}
                >
                  <svg
                    className={`size-5 ${
                      fault.severity === "critical"
                        ? "text-error-500"
                        : fault.severity === "warning"
                        ? "text-warning-500"
                        : "text-info-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Fault Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white/90">
                    {fault.type}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
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
                      {fault.location}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {fault.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge and Action */}
              <div className="flex items-center gap-3">
                <Badge color={getBadgeColor(fault.severity)}>
                  {fault.severity.toUpperCase()}
                </Badge>
                <button className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
