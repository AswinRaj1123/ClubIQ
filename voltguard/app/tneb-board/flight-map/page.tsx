"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import TnebBoardHeader from "@/components/layout/TnebBoardHeader";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />,
});

interface Drone {
  id: string;
  name: string;
  location: string;
  status: "active" | "warning" | "offline";
  battery: number;
}

interface Fault {
  id: string;
  type: string;
  location: string;
  severity: "high" | "medium" | "resolved";
  description: string;
}

interface TelemetryData {
  drone_id: string;
  status: string;
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  battery: number;
  speed: number;
  temperature: number;
  signal_strength: number;
}

export default function FlightMapPage() {
  const [activeDrone, setActiveDrone] = useState<Drone | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    drone_id: "VOLT-001",
    status: "active",
    position: { lat: 13.0827, lng: 80.2707, altitude: 120.5 },
    battery: 92,
    speed: 15.2,
    temperature: 38.7,
    signal_strength: 98,
  });

  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const drones: Drone[] = [
    { id: "VOLT-001", name: "Drone VOLT-001", location: "Chennai", status: "active", battery: 92 },
    { id: "VOLT-002", name: "Drone VOLT-002", location: "Coimbatore", status: "active", battery: 85 },
    { id: "VOLT-003", name: "Drone VOLT-003", location: "Madurai", status: "warning", battery: 45 },
    { id: "VOLT-004", name: "Drone VOLT-004", location: "Trichy", status: "offline", battery: 0 },
  ];

  const faults: Fault[] = [
    {
      id: "FLT-V-001",
      type: "Damaged Insulator",
      location: "Chennai North, Tower 42",
      severity: "high",
      description: "Critical damage detected on power line insulator",
    },
    {
      id: "FLT-V-002",
      type: "Vegetation Encroachment",
      location: "Coimbatore West, Tower 18",
      severity: "medium",
      description: "Tree branches within 2m of power lines",
    },
    {
      id: "FLT-V-003",
      type: "Corroded Conductor",
      location: "Madurai East, Tower 7",
      severity: "resolved",
      description: "Previously detected corrosion - now repaired",
    },
  ];

  // Simulate joystick control with smooth transitions using requestAnimationFrame
  useEffect(() => {
    let rafId: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      cancelAnimationFrame(rafId);
      updateJoystickPosition(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        // Use requestAnimationFrame for smooth updates
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateJoystickPosition(e);
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      cancelAnimationFrame(rafId);
      // Reset joystick smoothly with animation
      setJoystickPos({ x: 0, y: 0 });
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      cancelAnimationFrame(rafId);
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      updateJoystickPosition(mouseEvent as any);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        cancelAnimationFrame(rafId);
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        rafId = requestAnimationFrame(() => {
          updateJoystickPosition(mouseEvent as any);
        });
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      cancelAnimationFrame(rafId);
      setJoystickPos({ x: 0, y: 0 });
    };

    const joystick = joystickRef.current;
    if (joystick) {
      joystick.addEventListener("mousedown", handleMouseDown);
      joystick.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        joystick.removeEventListener("mousedown", handleMouseDown);
        joystick.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleTouchEnd);
        cancelAnimationFrame(rafId);
      };
    }
  }, []);

  const updateJoystickPosition = (e: MouseEvent | any) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = e.clientX - centerX;
    let deltaY = e.clientY - centerY;

    const maxDistance = rect.width / 2 - 35;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > maxDistance) {
      deltaX = (deltaX * maxDistance) / distance;
      deltaY = (deltaY * maxDistance) / distance;
    }

    setJoystickPos({ x: deltaX, y: deltaY });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success-100 dark:bg-success-500/10 text-success-700 dark:text-success-400";
      case "warning":
        return "bg-warning-100 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400";
      case "offline":
        return "bg-error-100 dark:bg-error-500/10 text-error-700 dark:text-error-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-4 border-error-500 bg-error-50 dark:bg-error-500/10";
      case "medium":
        return "border-l-4 border-warning-500 bg-warning-50 dark:bg-warning-500/10";
      case "resolved":
        return "border-l-4 border-success-500 bg-success-50 dark:bg-success-500/10";
      default:
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className="space-y-0 h-screen flex flex-col overflow-hidden">
      <TnebBoardHeader />
      <div className="flex gap-4 flex-1 overflow-hidden px-4 pb-4 min-h-0">
        {/* Sidebar - Collapsed on this page */}
        <aside className="w-72 bg-white dark:bg-gray-800 rounded-2xl p-4 overflow-y-auto flex flex-col gap-4 flex-shrink-0 hidden lg:flex">
          {/* Active Drones Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              Active Drones
            </h3>
            <ul className="space-y-1">
              {drones.map((drone) => (
                <li
                  key={drone.id}
                  onClick={() => setActiveDrone(drone)}
                  className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                    activeDrone?.id === drone.id
                      ? "bg-brand-500 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        drone.status === "active"
                          ? "bg-success-500"
                          : drone.status === "warning"
                          ? "bg-warning-500"
                          : "bg-error-500"
                      }`}
                    ></span>
                    <span className="font-medium text-xs">{drone.name}</span>
                  </div>
                  <div className="text-xs mt-0.5 opacity-75">{drone.location}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Fault Detection Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              Faults
            </h3>
            <ul className="space-y-1">
              {faults.map((fault) => (
                <li key={fault.id} className={`p-2 rounded-lg text-xs ${getSeverityColor(fault.severity)}`}>
                  <div className="font-semibold opacity-75">{fault.id}</div>
                  <div className="font-medium mt-0.5">{fault.type}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar scrollbar-thumb-brand-400 dark:scrollbar-thumb-brand-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 min-h-0">
          {/* Map Container - Large */}
          <div className="h-[700px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 overflow-hidden shadow-lg border-2 border-blue-300 dark:border-blue-700 flex-shrink-0">
            <MapComponent />
          </div>

          {/* Control Panel - Larger, Scrollable */}
          <div className="flex gap-2 flex-shrink-0 min-h-0 h-96">
            {/* Video Feed */}
            <div className="w-56 rounded-2xl bg-black dark:bg-gray-900 relative overflow-hidden flex-shrink-0 shadow-lg border-2 border-gray-700">
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                src="https://assets.mixkit.co/videos/preview/mixkit-flying-a-drone-over-a-lake-1225-large.mp4"
              ></video>
              <div className="absolute top-3 left-3 bg-black/80 text-white rounded-lg p-3 text-xs font-mono space-y-1">
                <div>Drone: {activeDrone?.id || "VOLT-001"}</div>
                <div>Battery: {telemetry.battery}%</div>
                <div>Location: {activeDrone?.location || "Chennai"}</div>
              </div>
            </div>

            {/* Control Section */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg overflow-y-auto scrollbar scrollbar-thumb-brand-400 dark:scrollbar-thumb-brand-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
                🚁 Drone Control Panel
              </h3>
              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                <div className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 p-3 rounded-lg text-center font-bold text-base">
                  🔋 {telemetry.battery}%
                </div>
                <div className="bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400 p-3 rounded-lg text-center font-bold text-base">
                  ⚡ {telemetry.speed.toFixed(1)} m/s
                </div>
              </div>

              {/* Telemetry Data - Large */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-base font-mono text-gray-800 dark:text-gray-200 space-y-2 flex-shrink-0 border-l-4 border-brand-500">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Drone ID:</span>
                  <span className="text-brand-600 dark:text-brand-400">{telemetry.drone_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Temp:</span>
                  <span className="text-brand-600 dark:text-brand-400">{telemetry.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Signal:</span>
                  <span className="text-brand-600 dark:text-brand-400">{telemetry.signal_strength}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Altitude:</span>
                  <span className="text-brand-600 dark:text-brand-400">{telemetry.position.altitude.toFixed(1)}m</span>
                </div>
              </div>

              {/* Control Buttons - Large & Bold */}
              <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                <button className="px-4 py-3 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  ✈️ Takeoff
                </button>
                <button className="px-4 py-3 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  📍 Land
                </button>
                <button className="px-4 py-3 bg-error-500 text-white text-sm font-bold rounded-lg hover:bg-error-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  ⚠️ E-Stop
                </button>
                <button className="px-4 py-3 bg-success-500 text-white text-sm font-bold rounded-lg hover:bg-success-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  🔍 Inspect
                </button>
                <button className="px-4 py-3 bg-warning-500 text-white text-sm font-bold rounded-lg hover:bg-warning-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  ⏸️ Pause
                </button>
                <button className="px-4 py-3 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 active:scale-95 transition-all whitespace-nowrap shadow-md">
                  🏠 Home
                </button>
              </div>

              {/* Status Indicator */}
              <div className="bg-success-50 dark:bg-success-900/20 border-2 border-success-300 dark:border-success-700 p-3 rounded-lg flex-shrink-0">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-block w-4 h-4 bg-success-500 rounded-full animate-pulse"></span>
                    <span className="text-base font-bold text-success-700 dark:text-success-400">System Active</span>
                  </div>
                </div>
              </div>

              {/* Joystick Control */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border-2 border-gray-300 dark:border-gray-600">
                <p className="text-lg font-bold text-gray-900 dark:text-white">🕹️ Manual Control</p>
                <div
                  ref={joystickRef}
                  className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-600 border-4 border-gray-400 dark:border-gray-500 relative cursor-grab active:cursor-grabbing shadow-lg select-none"
                  style={{ touchAction: "none", userSelect: "none" }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 w-12 h-12 bg-brand-600 dark:bg-brand-500 rounded-full shadow-lg pointer-events-none"
                    style={{
                      transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                      willChange: "transform",
                    }}
                  ></div>
                </div>

                {/* Position Display */}
                <div className="text-center text-base font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded-lg w-full">
                  <div className="font-bold">X: {joystickPos.x.toFixed(1)}</div>
                  <div className="font-bold">Y: {joystickPos.y.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
