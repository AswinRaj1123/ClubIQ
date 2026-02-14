"use client";
import React from "react";

export default function ControlPanel() {
  const handleTakeoff = () => {
    console.log("Drone takeoff initiated");
    // TODO: Implement takeoff logic
  };

  const handleStartInspection = () => {
    console.log("Inspection started");
    // TODO: Implement start inspection logic
  };

  const handleReturnToLaunch = () => {
    console.log("Returning to launch point");
    // TODO: Implement return to launch logic
  };

  const handleEmergencyLand = () => {
    console.log("Emergency landing initiated");
    // TODO: Implement emergency land logic
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          🎮 Drone Control Panel
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage drone operations and inspections
        </p>
      </div>

      {/* Control Actions Grid */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Takeoff */}
        <button
          onClick={handleTakeoff}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:bg-brand-500/10 transition-all group"
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-brand-50 rounded-full group-hover:bg-brand-100 dark:bg-brand-500/10 dark:group-hover:bg-brand-500/20 transition-colors">
            <svg
              className="text-brand-500 size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            Takeoff
          </h4>
          <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
            Launch drone
          </p>
        </button>

        {/* Start Inspection */}
        <button
          onClick={handleStartInspection}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-success-500 hover:bg-success-50 dark:border-gray-700 dark:hover:border-success-600 dark:hover:bg-success-500/10 transition-all group"
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-success-50 rounded-full group-hover:bg-success-100 dark:bg-success-500/10 dark:group-hover:bg-success-500/20 transition-colors">
            <svg
              className="text-success-500 size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            Start Inspection
          </h4>
          <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
            Begin survey
          </p>
        </button>

        {/* Return to Launch */}
        <button
          onClick={handleReturnToLaunch}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-warning-500 hover:bg-warning-50 dark:border-gray-700 dark:hover:border-warning-600 dark:hover:bg-warning-500/10 transition-all group"
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-warning-50 rounded-full group-hover:bg-warning-100 dark:bg-warning-500/10 dark:group-hover:bg-warning-500/20 transition-colors">
            <svg
              className="text-warning-500 size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            Return to Launch
          </h4>
          <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
            Auto return
          </p>
        </button>

        {/* Emergency Land */}
        <button
          onClick={handleEmergencyLand}
          className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-error-500 hover:bg-error-50 dark:border-gray-700 dark:hover:border-error-600 dark:hover:bg-error-500/10 transition-all group"
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-error-50 rounded-full group-hover:bg-error-100 dark:bg-error-500/10 dark:group-hover:bg-error-500/20 transition-colors">
            <svg
              className="text-error-500 size-8"
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
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            Emergency Land
          </h4>
          <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
            Immediate stop
          </p>
        </button>
      </div>
    </div>
  );
}
