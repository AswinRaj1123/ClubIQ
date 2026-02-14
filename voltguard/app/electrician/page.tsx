"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ElectricianPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to electrician dashboard on mount
    router.replace("/electrician/dashboard");
  }, [router]);

  return null; // No content to display during redirect
}
