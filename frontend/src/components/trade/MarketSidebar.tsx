"use client";

import { useMarketData } from "@/providers/MarketDataProvider";
import { useSelectedMarket } from "@/providers/MarketProvider";

export default function MarketSidebar() {
  const { markets, loading } = useMarketData();
  const { selectedMarket, setSelectedMarket } = useSelectedMarket();

  return (
    <aside className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
      <h2 className="mb-4 text-sm font-semibold text-zinc-400">
        Markets
      </h2>

      <div className="space-y-3">
        {loading && (
          <p className="text-sm text-zinc-600">Loading markets...</p>
        )}

        {markets.map((market) => {
          const positive = market.change24h >= 0;
          const active = selectedMarket === market.symbol;

          return (
            <button
              key={market.id}
              onClick={() => setSelectedMarket(market.symbol)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                active
                  ? "border-white bg-zinc-900"
                  : "border-zinc-900 bg-black hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  {market.symbol}
                </span>

                <span
                  className={
                    positive
                      ? "text-sm text-green-400"
                      : "text-sm text-red-400"
                  }
                >
                  {positive ? "+" : ""}
                  {market.change24h.toFixed(2)}%
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                {market.name}
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                ${market.price.toLocaleString()}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
