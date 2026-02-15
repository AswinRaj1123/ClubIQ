"use client";
import React, { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import Button from "../ui/button/Button";

interface ElectricianGuardProps {
  children: React.ReactNode;
}

export default function ElectricianGuard({ children }: ElectricianGuardProps) {
  const [isElectrician, setIsElectrician] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is electrician
    const user = authAPI.getUser();
    if (user && user.role === "electrician") {
      setIsElectrician(true);
    } else {
      setIsElectrician(false);
    }
  }, []);

  const handleSwitchToElectrician = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authAPI.updateRole();
      
      console.log("Role updated to electrician:", result);
      setIsElectrician(true);
      
      // Refresh the page to update the UI
      window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update role";
      console.error("Error switching to electrician:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isElectrician === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isElectrician) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-900/30">
              <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Not an Electrician Yet?
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your account is currently set as a consumer. To access the electrician dashboard and receive service requests, switch your role to electrician.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleSwitchToElectrician}
            disabled={loading}
            className="w-full"
            variant="primary"
          >
            {loading ? "Switching..." : "🔧 Switch to Electrician"}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Or go back and create a new account as an electrician during signup
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
