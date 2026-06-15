"use client";

import AppHeader from "@/components/layout/AppHeader";
import { MarketDataProvider, useMarketData } from "@/providers/MarketDataProvider";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function MarketsContent() {
  const { markets, loading } = useMarketData();

  return (
    <section className="space-y-6 p-4 text-white md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Markets</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Live ArcPerps markets powered by resilient server-side price routes.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 text-sm text-zinc-500">
          Loading market data...
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {markets.map((market) => {
          const positive = market.change24h >= 0;

          return (
            <article
              key={market.id}
              className="rounded-xl border border-zinc-900 bg-zinc-950 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{market.symbol}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{market.name}</p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-sm ${
                    positive
                      ? "border-green-500/30 text-green-400"
                      : "border-red-500/30 text-red-400"
                  }`}
                >
                  {positive ? "+" : ""}
                  {market.change24h.toFixed(2)}%
                </span>
              </div>

              <p className="mt-6 text-3xl font-bold">
                {formatUsd(market.price)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-zinc-900 bg-black p-3">
                  <p className="text-zinc-500">24h Volume</p>
                  <p className="mt-2 font-semibold">
                    {formatUsd(market.volume24h)}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-900 bg-black p-3">
                  <p className="text-zinc-500">Collateral</p>
                  <p className="mt-2 font-semibold">USDC</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <AppHeader />
      <MarketDataProvider>
        <MarketsContent />
      </MarketDataProvider>
    </main>
  );
}
