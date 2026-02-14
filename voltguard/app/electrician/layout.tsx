import AppHeader from "@/components/layout/AppHeader";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function ElectricianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader />
        <main className="flex-1 w-full max-w-7xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
