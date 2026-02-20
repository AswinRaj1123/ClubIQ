"use client";

import React from "react";

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Help & Support
        </h1>

        <div className="space-y-6">
          {/* FAQs */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Frequently Asked Questions
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-600 dark:text-gray-400">
                <strong>How do I view fault requests?</strong>
                <p className="mt-1 text-sm">Navigate to your dashboard to see all pending and completed fault requests.</p>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <strong>How do I update my profile?</strong>
                <p className="mt-1 text-sm">Click on "My Profile" from the top menu and edit your information.</p>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <strong>How do I contact support?</strong>
                <p className="mt-1 text-sm">Use the contact form below or email us at support@voltguard.com</p>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <strong>How do I mark a request as completed?</strong>
                <p className="mt-1 text-sm">Open the request details and use the appropriate action buttons to update the status.</p>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help? Our support team is here to assist you.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> support@voltguard.com
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Documentation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Check out our comprehensive documentation for detailed guides on using the electrician platform.
            </p>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
