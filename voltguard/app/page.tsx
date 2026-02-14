"use client";

import Image from "next/image";
import Link from "next/link";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* Background Grid Shape */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <GridShape />
      </div>

      {/* Theme Toggler */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            {/* Logo Image */}
            <div className="mb-4 animate-fade-in">
              <Image
                src="/images/logo/voltguard-logo.png"
                alt="VoltGuard Logo"
                width={240}
                height={240}
                className="w-64 h-64 object-contain dark:invert"
                priority
              />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                VoltGuard
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                Smart Power Grid Inspection with AI-Powered Drone Monitoring and Real-Time Fault Detection
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-700 transition-colors duration-200 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
