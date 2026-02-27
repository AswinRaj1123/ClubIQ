"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droneMarkersRef = useRef<L.CircleMarker[]>([]);
  const wheelHandlerRef = useRef<(e: WheelEvent) => void | null>(null);

  const cities = [
    { name: "Chennai", coords: [13.0827, 80.2707], type: "power-station" },
    { name: "Coimbatore", coords: [11.0168, 76.9558], type: "power-station" },
    { name: "Madurai", coords: [9.9252, 78.1198], type: "power-station" },
    { name: "Trichy", coords: [10.7905, 78.7047], type: "power-station" },
    { name: "Salem", coords: [11.6643, 78.146], type: "power-station" },
    { name: "Tirunelveli", coords: [8.7139, 77.7567], type: "power-station" },
    { name: "Vellore", coords: [12.9165, 79.1325], type: "power-station" },
  ];

  const drones = [
    { id: "VOLT-001", coords: [13.0827, 80.2707], status: "active" },
    { id: "VOLT-002", coords: [11.0168, 76.9558], status: "active" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView([10.8505, 78.7873], 8);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      className: "brightness-110 contrast-125",
    }).addTo(map);

    mapRef.current = map;

    // Disable default scroll wheel zoom
    map.scrollWheelZoom.disable();

    // Custom wheel event handler for Alt + scroll zoom
    const mapContainer = containerRef.current;
    const handleWheel = (e: WheelEvent) => {
      if (e.altKey) {
        // Prevent browser default zoom behavior
        e.preventDefault();
        e.stopPropagation();

        // Only zoom if map is fully initialized
        if (!(map as any)._container || !(map as any)._loaded) {
          return;
        }

        // Zoom the map
        const currentZoom = map.getZoom();
        const minZoom = map.getMinZoom();
        const maxZoom = map.getMaxZoom();

        let newZoom: number;
        if (e.deltaY > 0) {
          newZoom = Math.max(currentZoom - 1, minZoom);
        } else {
          newZoom = Math.min(currentZoom + 1, maxZoom);
        }

        if (newZoom !== currentZoom) {
          map.setZoom(newZoom);
        }
      }
      // Without Alt, allow normal page scroll (default browser behavior)
    };

    // Attach wheel handler to map container when map is ready
    if (mapContainer) {
      mapContainer.addEventListener("wheel", handleWheel, { passive: false });
      wheelHandlerRef.current = handleWheel;
    }

    // Add power stations with better visibility
    cities.forEach((city) => {
      // Add a larger background circle first
      L.circleMarker([city.coords[0], city.coords[1]], {
        radius: 15,
        fillColor: "#465fff",
        color: "#1e40af",
        weight: 1,
        opacity: 0.3,
        fillOpacity: 0.2,
      }).addTo(map);

      // Add the main marker
      L.circleMarker([city.coords[0], city.coords[1]], {
        radius: 8,
        fillColor: "#465fff",
        color: "#2563eb",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup(
          `<strong>${city.name}</strong><br/>Power Station<br/>${city.coords[0].toFixed(4)}°, ${city.coords[1].toFixed(4)}°`
        )
        .addTo(map);
    });

    // Define power lines for drone movement
    const powerLines = [
      [cities[0].coords, cities[1].coords], // Chennai to Coimbatore
      [cities[1].coords, cities[2].coords], // Coimbatore to Madurai
      [cities[2].coords, cities[3].coords], // Madurai to Trichy
      [cities[3].coords, cities[0].coords], // Trichy to Chennai
      [cities[1].coords, cities[4].coords], // Coimbatore to Salem
      [cities[4].coords, cities[6].coords], // Salem to Vellore
    ];

    // Add power lines
    powerLines.forEach((line) => {
      L.polyline([line[0] as any, line[1] as any], {
        color: "#ff4757",
        weight: 3,
        opacity: 0.7,
        dashArray: "8, 4",
      }).addTo(map);
    });

    // Add drones with custom styling
    const droneMarkers: L.CircleMarker[] = [];
    drones.forEach((drone) => {
      // Create a circle marker for the drone
      const marker = L.circleMarker([drone.coords[0], drone.coords[1]], {
        radius: 12,
        fillColor: "#10b981",
        color: "#059669",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.95,
      })
        .bindPopup(
          `
          <div style="font-weight: bold; color: #10b981;">
            ${drone.id}
          </div>
          <div style="font-size: 12px; margin-top: 5px;">
            Status: ${drone.status}<br/>
            Lat: ${drone.coords[0].toFixed(4)}°<br/>
            Lng: ${drone.coords[1].toFixed(4)}°
          </div>
        `
        )
        .addTo(map);

      droneMarkers.push(marker);
      droneMarkersRef.current.push(marker);
    });

    // Animate drones along power lines
    let droneProgress = [0, 0.5]; // Start positions on lines (0-1 range)
    const animationInterval = setInterval(() => {
      // Update progress for each drone
      droneProgress = droneProgress.map((progress, droneIndex) => {
        let newProgress = progress + 0.002; // Speed of movement

        // Calculate which line the drone is on based on progress
        const totalLineLength = powerLines.length;
        const lineIndex = Math.floor(newProgress * totalLineLength) % totalLineLength;
        const positionOnLine = (newProgress * totalLineLength) % 1;

        const line = powerLines[lineIndex];
        const startCoords = line[0] as [number, number];
        const endCoords = line[1] as [number, number];

        // Interpolate position along the line
        const newLat = startCoords[0] + (endCoords[0] - startCoords[0]) * positionOnLine;
        const newLng = startCoords[1] + (endCoords[1] - startCoords[1]) * positionOnLine;

        // Update drone marker position
        if (droneMarkers[droneIndex]) {
          droneMarkers[droneIndex].setLatLng([newLat, newLng]);
        }

        // Reset when completed full cycle
        return newProgress >= 1 ? 0 : newProgress;
      });
    }, 100); // Update every 100ms for smooth movement

    return () => {
      clearInterval(animationInterval);
      // Clean up event listener
      const container = containerRef.current;
      if (wheelHandlerRef.current && container) {
        container.removeEventListener("wheel", wheelHandlerRef.current);
      }
      map.remove();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
}
