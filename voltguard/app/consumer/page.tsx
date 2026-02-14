"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConsumerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to consumer dashboard on mount
    router.replace("/consumer/dashboard");
  }, [router]);

  return null; // No content to display during redirect
}
