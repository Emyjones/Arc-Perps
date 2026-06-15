"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import {
  getIntelSnapshot,
  type IntelSnapshot,
} from "@/services/intel";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: value >= 1_000_000_000 ? "compact" : "standard",
  }).format(value);
}

export default function Page() {
  const [intel, setIntel] = useState<IntelSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntel() {
      const snapshot = await getIntelSnapshot();
      setIntel(snapshot);
      setLoading(false);
    }

    loadIntel();
  }, []);

  const fundamentals = intel?.fundamentals;
  const marketChange = fundamentals?.marketCapChange24h ?? 0;
  const positive = marketChange >= 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <AppHeader />

      <section className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold">ArcIntel</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Live market fundamentals and crypto news routed through ArcPerps.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Crypto Market Cap</p>
            <p className="mt-3 text-2xl font-bold">
              {loading || !fundamentals
                ? "--"
                : formatUsd(fundamentals.totalMarketCapUsd)}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">24h Volume</p>
            <p className="mt-3 text-2xl font-bold">
              {loading || !fundamentals
                ? "--"
                : formatUsd(fundamentals.totalVolumeUsd)}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">24h Market Move</p>
            <p
              className={`mt-3 text-2xl font-bold ${
                positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {loading ? "--" : `${positive ? "+" : ""}${marketChange.toFixed(2)}%`}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Tracked Markets</p>
            <p className="mt-3 text-2xl font-bold">
              {loading || !fundamentals
                ? "--"
                : fundamentals.markets.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Market News</h2>
            <p className="text-sm text-zinc-500">
              {intel?.news.length ?? 0} updates
            </p>
          </div>

          <div className="grid gap-3">
            {loading ? (
              <div className="rounded-lg border border-zinc-900 bg-black p-4 text-sm text-zinc-500">
                Loading intelligence feed...
              </div>
            ) : intel?.news.length ? (
              intel.news.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-zinc-900 bg-black p-4 transition hover:border-zinc-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>{item.source}</span>
                    <span>{new Date(item.publishedAt).toLocaleString()}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  {item.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                      {item.summary}
                    </p>
                  )}
                </a>
              ))
            ) : (
              <div className="rounded-lg border border-zinc-900 bg-black p-4 text-sm text-zinc-500">
                Intel feed is temporarily unavailable.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
