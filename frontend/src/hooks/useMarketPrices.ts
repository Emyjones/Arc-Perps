"use client";

import { useEffect, useState } from "react";
import { getMarketPrices, type MarketPrice } from "@/services/prices";

export function useMarketPrices() {
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

  return { markets, loading };
}
