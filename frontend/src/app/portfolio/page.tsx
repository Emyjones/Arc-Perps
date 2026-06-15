"use client";

import AppHeader from "@/components/layout/AppHeader";
import { calculatePositionPnl, useTradeStore } from "@/lib/store";
import { MarketDataProvider, useMarketData } from "@/providers/MarketDataProvider";

function PortfolioContent() {
  const positions = useTradeStore((state) => state.positions);
  const closedPositions = useTradeStore((state) => state.closedPositions);
  const { markets } = useMarketData();

  const totalCollateral = positions.reduce(
    (sum, position) => sum + position.collateral,
    0
  );
  const unrealizedPnl = positions.reduce((sum, position) => {
    const market = markets.find((item) => item.symbol === position.market);
    const currentPrice = market?.price ?? position.entryPrice;

    return sum + calculatePositionPnl(position, currentPrice);
  }, 0);
  const realizedPnl = closedPositions.reduce(
    (sum, position) => sum + position.realizedPnl,
    0
  );

  const stats = [
    {
      label: "Total Collateral",
      value: `${totalCollateral.toLocaleString()} USDC`,
      tone: "text-white",
    },
    {
      label: "Open Positions",
      value: positions.length.toString(),
      tone: "text-white",
    },
    {
      label: "Unrealized PnL",
      value: `${unrealizedPnl >= 0 ? "+" : ""}$${unrealizedPnl.toFixed(2)}`,
      tone: unrealizedPnl >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      label: "Realized PnL",
      value: `${realizedPnl >= 0 ? "+" : ""}$${realizedPnl.toFixed(2)}`,
      tone: realizedPnl >= 0 ? "text-green-400" : "text-red-400",
    },
  ];

  return (
    <section className="space-y-6 p-4 text-white md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Account-level view across demo positions and realized trades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-900 bg-zinc-950 p-5"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className={`mt-3 text-2xl font-bold ${stat.tone}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Closed Trades History</h2>
          <p className="text-sm text-zinc-500">{closedPositions.length} trades</p>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-900 bg-black">
          <div className="grid grid-cols-6 border-b border-zinc-900 px-4 py-3 text-sm text-zinc-500">
            <span>Market</span>
            <span>Side</span>
            <span>Collateral</span>
            <span>Entry / Exit</span>
            <span>Realized PnL</span>
            <span>Closed</span>
          </div>

          {closedPositions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-600">
              Close a position from the trade terminal to populate history.
            </div>
          ) : (
            closedPositions.map((position) => (
              <div
                key={`${position.id}-${position.closedAt}`}
                className="grid grid-cols-6 border-b border-zinc-900 px-4 py-4 text-sm"
              >
                <span>{position.market}</span>
                <span
                  className={
                    position.side === "LONG" ? "text-green-400" : "text-red-400"
                  }
                >
                  {position.side}
                </span>
                <span>{position.collateral.toLocaleString()} USDC</span>
                <span>
                  ${position.entryPrice.toLocaleString()} / $
                  {position.exitPrice.toLocaleString()}
                </span>
                <span
                  className={
                    position.realizedPnl >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {position.realizedPnl >= 0 ? "+" : ""}
                  ${position.realizedPnl.toFixed(2)}
                </span>
                <span className="text-zinc-500">
                  {new Date(position.closedAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <AppHeader />
      <MarketDataProvider>
        <PortfolioContent />
      </MarketDataProvider>
    </main>
  );
}
