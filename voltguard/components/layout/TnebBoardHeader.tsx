"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function TnebBoardHeader() {
  return (
    <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tneb-board" className="flex items-center gap-3">
            <Image
              src="/images/logo/voltguard-logo.png"
              alt="VoltGuard Logo"
              width={100}
              height={32}
              className="object-contain"
            />
          </Link>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">TNEB Board</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Power Grid Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Flight Map</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Live Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}
