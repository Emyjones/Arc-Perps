"use client";

import { useMarketData } from "@/providers/MarketDataProvider";

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function MarketTicker() {
  const { markets, loading } = useMarketData();

  return (
    <div className="border-b border-zinc-900 bg-zinc-950 px-4 py-2 text-white">
      <div className="flex items-center gap-4 overflow-x-auto">
        <div className="shrink-0 rounded-md border border-zinc-800 bg-black px-3 py-1 text-xs font-semibold text-zinc-400">
          Arc Markets
        </div>

        {loading && (
          <div className="shrink-0 text-sm text-zinc-600">Loading live tape...</div>
        )}

        {markets.map((market) => {
          const positive = market.change24h >= 0;

          return (
            <div
              key={market.id}
              className="flex shrink-0 items-center gap-2 text-sm"
            >
              <span className="font-semibold">{market.symbol}</span>
              <span className="text-zinc-500">{formatCompactUsd(market.price)}</span>
              <span className={positive ? "text-green-400" : "text-red-400"}>
                {positive ? "+" : ""}
                {market.change24h.toFixed(2)}%
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-500">
                Vol {formatCompactUsd(market.volume24h)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
