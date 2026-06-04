"use client";

import { createContext, useContext, useState } from "react";

type MarketContextType = {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
};

const MarketContext = createContext<MarketContextType | null>(null);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [selectedMarket, setSelectedMarket] = useState("BTC-USD");

  return (
    <MarketContext.Provider value={{ selectedMarket, setSelectedMarket }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useSelectedMarket() {
  const context = useContext(MarketContext);

  if (!context) {
    throw new Error("useSelectedMarket must be used inside MarketProvider");
  }

  return context;
}
