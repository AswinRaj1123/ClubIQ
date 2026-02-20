"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LinemanPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to lineman dashboard on mount
    router.replace("/lineman/dashboard");
  }, [router]);

  return null; // No content to display during redirect
}
