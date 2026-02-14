"use client";

import React from "react";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Account Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your account preferences and security settings.
            </p>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              Edit Account Settings
            </button>
          </div>

          {/* Notification Settings */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Notification Preferences
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Control how and when you receive notifications.
            </p>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              Manage Notifications
            </button>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Privacy & Security
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Review and update your privacy settings.
            </p>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              Edit Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
