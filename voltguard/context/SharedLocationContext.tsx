"use client";
import React, { createContext, useContext, useState } from "react";

interface SharedLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  location: string;
}

type SharedLocationContextType = {
  sharedLocation: SharedLocationData | null;
  setSharedLocation: (location: SharedLocationData | null) => void;
  clearSharedLocation: () => void;
};

const SharedLocationContext = createContext<SharedLocationContextType | undefined>(undefined);

export const useSharedLocation = () => {
  const context = useContext(SharedLocationContext);
  if (!context) {
    throw new Error("useSharedLocation must be used within a SharedLocationProvider");
  }
  return context;
};

export const SharedLocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sharedLocation, setSharedLocation] = useState<SharedLocationData | null>(null);

  const clearSharedLocation = () => {
    setSharedLocation(null);
  };

  return (
    <SharedLocationContext.Provider
      value={{
        sharedLocation,
        setSharedLocation,
        clearSharedLocation,
      }}
    >
      {children}
    </SharedLocationContext.Provider>
  );
};
