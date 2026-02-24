"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TnebBoardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tneb-board/flight-map");
  }, [router]);

  return null;
}
