"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button/Button";

export default function LiveLocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const shareLocation = () => {
    if ("geolocation" in navigator) {
      setIsSharing(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsSharing(false);
          alert(`Location shared: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          setIsSharing(false);
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Initialize map (placeholder - would use actual map library like Leaflet or Google Maps)
  useEffect(() => {
    // In a real implementation, initialize the map library here
    // For now, this is a visual placeholder
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          🗺️ Live Location Map
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Share your location with electricians
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 space-y-4">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative"
        >
          {/* Placeholder Map Content */}
          <div className="text-center z-10">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {location
                ? `Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                : "Click button below to share your location"}
            </p>
          </div>
        </div>

        {/* Share Location Button */}
        <Button
          onClick={shareLocation}
          disabled={isSharing}
          variant="primary"
          className="w-full"
        >
          {isSharing ? "Getting Location..." : "📍 Share My GPS Location"}
        </Button>

        {/* Location Info */}
        {location && (
          <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-500">
            <p className="text-sm text-success-800 dark:text-success-400">
              ✓ Location shared successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
