"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AgeStatus = "unknown" | "adult" | "underage";

interface AgeContextType {
  ageStatus: AgeStatus;
  setAgeStatus: (status: AgeStatus) => void;
  isVerified: boolean;
}

const AgeContext = createContext<AgeContextType | undefined>(undefined);

export function AgeProvider({ children }: { children: React.ReactNode }) {
  const [ageStatus, setAgeStatusState] = useState<AgeStatus>("unknown");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Odczyt statusu pełnoletności z localStorage podczas pierwszego renderowania po stronie klienta
    const storedStatus = localStorage.getItem("alkozon_age_status") as AgeStatus | null;
    if (storedStatus) {
      setAgeStatusState(storedStatus);
    }
    setIsVerified(true);
  }, []);

  const setAgeStatus = (status: AgeStatus) => {
    setAgeStatusState(status);
    localStorage.setItem("alkozon_age_status", status);
  };

  return (
    <AgeContext.Provider value={{ ageStatus, setAgeStatus, isVerified }}>
      {children}
    </AgeContext.Provider>
  );
}

export function useAge() {
  const context = useContext(AgeContext);
  if (context === undefined) {
    throw new Error("useAge must be used within an AgeProvider");
  }
  return context;
}
