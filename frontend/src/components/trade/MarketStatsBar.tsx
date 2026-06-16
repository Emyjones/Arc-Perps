"use client";

import { useMarketData } from "@/providers/MarketDataProvider";
import { useSelectedMarket } from "@/providers/MarketProvider";

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function MarketStatsBar() {
  const { selectedMarket } = useSelectedMarket();
  const { markets } = useMarketData();
  const market = markets.find((item) => item.symbol === selectedMarket);
  const positive = (market?.change24h ?? 0) >= 0;

  const stats = [
    { label: "Mark Price", value: market ? formatCompactUsd(market.price) : "--" },
    { label: "Index Price", value: market ? formatCompactUsd(market.price * 1.00003) : "--" },
    {
      label: "24H Change",
      value: market ? `${positive ? "+" : ""}${market.change24h.toFixed(2)}%` : "--",
      tone: positive ? "text-emerald-400" : "text-red-400",
    },
    { label: "24H Volume", value: market ? formatCompactUsd(market.volume24h) : "--" },
    { label: "Open Interest", value: market ? formatCompactUsd(market.volume24h * 0.018) : "--" },
    { label: "Funding / Countdown", value: "+0.003% / 00:42:12", tone: "text-emerald-400" },
  ];

  return (
    <section className="border-b border-zinc-900 bg-black px-4 py-3 text-white">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 font-bold text-black">
            {selectedMarket.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-xl font-bold">{selectedMarket}</h1>
            <p className="text-xs text-zinc-500">USDC perpetual</p>
          </div>
        </div>

        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className={`text-sm font-semibold ${stat.tone ?? "text-white"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
