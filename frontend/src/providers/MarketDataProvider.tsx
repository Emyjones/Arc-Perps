"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMarketPrices, type MarketPrice } from "@/services/prices";

type MarketDataContextType = {
  markets: MarketPrice[];
  loading: boolean;
};

const MarketDataContext = createContext<MarketDataContextType | null>(null);

export function MarketDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [markets, setMarkets] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await getMarketPrices();
        setMarkets(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();

    const interval = setInterval(loadPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider value={{ markets, loading }}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);

  if (!context) {
    throw new Error("useMarketData must be used inside MarketDataProvider");
  }

  return context;
}
