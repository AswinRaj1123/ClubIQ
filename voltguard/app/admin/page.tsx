"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard on mount
    router.replace("/admin/dashboard");
  }, [router]);

  return null; // No content to display during redirect
}
