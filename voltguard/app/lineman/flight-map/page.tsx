"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LinemanFlightMapPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/lineman/dashboard");
  }, [router]);

  return null;
}
