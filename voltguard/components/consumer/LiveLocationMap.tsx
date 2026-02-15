"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSharedLocation } from "@/context/SharedLocationContext";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

export default function LiveLocationMap() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<any>(null);
  const router = useRouter();
  const { setSharedLocation, clearSharedLocation } = useSharedLocation();

  // Check if geolocation is available
  useEffect(() => {
    if ("geolocation" in navigator) {
      setHasPermission(true);
    }
  }, []);

  const shareLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsSharing(true);
    setIsLoading(true);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const locationData = { lat: latitude, lng: longitude, accuracy };
        setLocation(locationData);
        setIsSharing(false);
        setIsLoading(false);

        // Send location to backend
        updateLocationInBackend(locationData);
      },
      (error) => {
        setIsSharing(false);
        setIsLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
          alert(
            "Location permission denied. Please enable location access in your browser settings."
          );
        } else {
          alert(`Error: ${error.message}`);
        }
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const updateLocationInBackend = async (locationData: LocationData) => {
    try {
      const token = localStorage.getItem("voltguard_token");
      
      if (!token) {
        console.warn("No access token found in localStorage");
        alert("You must be logged in to share your location");
        return;
      }

      console.log("Sending location update with token:", token.substring(0, 20) + "...");
      
      const response = await fetch("http://localhost:8000/api/consumer/location/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: locationData.lat,
          longitude: locationData.lng,
          accuracy: locationData.accuracy,
          is_sharing: true,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Location update failed:", response.status, responseData);
        throw new Error(responseData.detail || "Failed to update location");
      }

      console.log("Location updated successfully:", responseData);
      
      // Share location with the fault request form
      const locationName = `${locationData.lat.toFixed(4)}, ${locationData.lng.toFixed(4)}`;
      setSharedLocation({
        latitude: locationData.lat,
        longitude: locationData.lng,
        accuracy: locationData.accuracy,
        location: locationName,
      });
      
      alert("✅ Location shared successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unable to update location"}`);
    }
  };

  const stopSharing = async () => {
    try {
      const token = localStorage.getItem("voltguard_token");
      
      if (!token) {
        alert("You must be logged in to stop sharing");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/consumer/location/stop-sharing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Stop sharing failed:", response.status, responseData);
        throw new Error(responseData.detail || "Failed to stop sharing");
      }

      setLocation(null);
      clearSharedLocation();
      alert("✅ Location sharing stopped");
      console.log("Location sharing stopped");
    } catch (error) {
      console.error("Error stopping location sharing:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unable to stop sharing"}`);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Card Header with Logo */}
      <div className="relative px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <button
              onClick={() => router.push("/consumer/dashboard")}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Back to Dashboard"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-700 dark:text-white/90"
              >
                <text x="2" y="18" fontSize="16" fontWeight="bold" fill="currentColor">
                  V
                </text>
              </svg>
            </button>
            <div>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                🗺️ Live Location
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {location ? "Location shared" : "Share your GPS location"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4 sm:p-6">
        {/* Geolocation Not Available Warning */}
        {!hasPermission && (
          <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-500">
            <p className="text-sm text-warning-800 dark:text-warning-400">
              ⚠️ Geolocation is not available in your browser
            </p>
          </div>
        )}

        {/* Permission Denied Warning */}
        {permissionDenied && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 rounded-lg border border-error-500">
            <p className="text-sm text-error-800 dark:text-error-400">
              🚫 Location permission denied. Please enable it in browser settings.
            </p>
          </div>
        )}

        {/* Map Container */}
        <div className="w-full h-80 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {location && typeof window !== "undefined" ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">Your Location</p>
                    <p>Lat: {location.lat.toFixed(6)}</p>
                    <p>Lng: {location.lng.toFixed(6)}</p>
                    {location.accuracy && (
                      <p>Accuracy: {location.accuracy.toFixed(2)}m</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📍</div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {isLoading ? "Getting location..." : "Click button below to share location"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location Info */}
        {location && (
          <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-500">
            <p className="text-sm text-success-800 dark:text-success-400 font-medium mb-2">
              ✓ Location shared successfully!
            </p>
            <p className="text-xs text-success-700 dark:text-success-300">
              Latitude: {location.lat.toFixed(6)} | Longitude: {location.lng.toFixed(6)}
            </p>
            {location.accuracy && (
              <p className="text-xs text-success-700 dark:text-success-300">
                Accuracy: ±{location.accuracy.toFixed(2)} meters
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareLocation}
            disabled={isSharing || isLoading}
            variant="primary"
            className="w-full"
          >
            {isLoading ? "Getting Location..." : "📍 Share Location"}
          </Button>

          {location && (
            <Button
              onClick={stopSharing}
              variant="secondary"
              className="w-full"
            >
              ✕ Stop Sharing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
