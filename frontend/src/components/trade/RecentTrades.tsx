"use client";

import { useMemo, useState } from "react";
import { useMarketData } from "@/providers/MarketDataProvider";
import { useSelectedMarket } from "@/providers/MarketProvider";

export default function RecentTrades() {
  const [snapshotTime] = useState(() => Date.now());
  const { selectedMarket } = useSelectedMarket();
  const { markets } = useMarketData();
  const market = markets.find((item) => item.symbol === selectedMarket);
  const trades = useMemo(() => {
    const price = market?.price ?? 65000;

    return Array.from({ length: 14 }, (_, index) => {
      const side = index % 3 === 0 ? "SELL" : "BUY";
      const offset = (index - 7) * price * 0.00001;

      return {
        id: `${selectedMarket}-${index}`,
        side,
        price: price + offset,
        size: 0.024 + index * 0.013,
        time: new Date(snapshotTime - index * 21_000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });
  }, [market?.price, selectedMarket, snapshotTime]);

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950 text-white">
      <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
        <h2 className="font-bold">Market Trades</h2>
        <span className="text-xs text-zinc-500">Live tape model</span>
      </div>

      <div className="grid grid-cols-3 px-4 py-2 text-xs text-zinc-500">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Time</span>
      </div>

      <div className="max-h-[300px] space-y-1 overflow-hidden px-4 pb-4">
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 text-xs">
            <span className={trade.side === "BUY" ? "text-emerald-400" : "text-red-400"}>
              {trade.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className="text-right">{trade.size.toFixed(4)}</span>
            <span className="text-right text-zinc-500">{trade.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
