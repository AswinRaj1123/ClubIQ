"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToProfilePage = async () => {
      try {
        const token = authAPI.getToken();
        const user = authAPI.getUser();

        if (!token || !user) {
          // Redirect to login if no token or user
          router.replace("/signin");
          return;
        }

        // Redirect based on user role
        if (user.role === "electrician") {
          router.replace("/electrician/profile");
        } else if (user.role === "admin") {
          router.replace("/admin/profile");
        } else {
          router.replace("/consumer/profile");
        }
      } catch (error) {
        console.error("Error redirecting:", error);
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    };

    redirectToProfilePage();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? "Loading profile..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
