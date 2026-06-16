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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function loadIntel() {
      const snapshot = await getIntelSnapshot();
      setIntel(snapshot);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
    }

    loadIntel();

    const interval = setInterval(loadIntel, 120000);

    return () => clearInterval(interval);
  }, []);

  const fundamentals = intel?.fundamentals;
  const marketChange = fundamentals?.marketCapChange24h ?? 0;
  const positive = marketChange >= 0;
  const liquidityRatio =
    fundamentals && fundamentals.totalMarketCapUsd > 0
      ? (fundamentals.totalVolumeUsd / fundamentals.totalMarketCapUsd) * 100
      : 0;
  const signals = [
    {
      label: "Market Regime",
      value: fundamentals?.regime ?? "--",
      detail: "Blends 24h market-cap move with sentiment.",
      tone:
        fundamentals?.regime === "Risk-on"
          ? "text-green-400"
          : fundamentals?.regime === "Risk-off"
            ? "text-red-400"
            : "text-zinc-300",
    },
    {
      label: "Sentiment",
      value: fundamentals
        ? `${fundamentals.sentimentValue}/100 ${fundamentals.sentimentLabel}`
        : "--",
      detail: "Fear and greed proxy for positioning risk.",
      tone:
        (fundamentals?.sentimentValue ?? 0) >= 50
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Liquidity Ratio",
      value: `${liquidityRatio.toFixed(2)}%`,
      detail: "Total volume divided by total market cap.",
      tone: "text-zinc-300",
    },
    {
      label: "BTC / ETH Dominance",
      value: fundamentals
        ? `${fundamentals.btcDominance.toFixed(1)}% / ${fundamentals.ethDominance.toFixed(1)}%`
        : "--",
      detail: "Helps identify broad beta concentration.",
      tone: "text-zinc-300",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <AppHeader />

      <section className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold">ArcIntel</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Live market fundamentals and crypto news routed through ArcPerps.
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {lastUpdated
              ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
              : "Syncing intel feed..."}
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

        <div className="grid gap-4 md:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-xl border border-zinc-900 bg-zinc-950 p-5"
            >
              <p className="text-sm text-zinc-500">{signal.label}</p>
              <p className={`mt-3 text-xl font-bold ${signal.tone}`}>
                {loading ? "--" : signal.value}
              </p>
              <p className="mt-2 text-xs text-zinc-600">{signal.detail}</p>
            </div>
          ))}
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
                <article
                  key={item.id}
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
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Open source
                    </a>
                  )}
                </article>
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
