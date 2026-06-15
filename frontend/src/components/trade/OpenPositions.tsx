"use client";

import { calculatePositionPnl, useTradeStore } from "@/lib/store";
import { useMarketData } from "@/providers/MarketDataProvider";

export default function OpenPositions() {
  const positions = useTradeStore((state) => state.positions);
  const closedPositions = useTradeStore((state) => state.closedPositions);
  const closePosition = useTradeStore((state) => state.closePosition);
  const { markets } = useMarketData();

  return (
    <section className="space-y-4 text-white">
      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Open Positions</h2>

        <p className="text-sm text-zinc-500">
          {positions.length} active
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-900 bg-black">
        <div className="grid grid-cols-8 border-b border-zinc-900 px-4 py-3 text-sm text-zinc-500">
          <span>Market</span>
          <span>Side</span>
          <span>Size</span>
          <span>Entry</span>
          <span>Current</span>
          <span>PnL</span>
          <span>ROI</span>
          <span>Action</span>
        </div>

        {positions.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600">
            No open positions yet.
          </div>
        ) : (
          positions.map((position) => {
            const market = markets.find(
              (m) => m.symbol === position.market
            );

            const currentPrice =
              market?.price ?? position.entryPrice;

            const pnl = calculatePositionPnl(position, currentPrice);

            const roi =
              (pnl / position.collateral) * 100;

            return (
              <div
                key={position.id}
                className="grid grid-cols-8 border-b border-zinc-900 px-4 py-4 text-sm"
              >
                <span>{position.market}</span>

                <span
                  className={
                    position.side === "LONG"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {position.side}
                </span>

                <span>{position.size} USDC</span>

                <span>
                  ${position.entryPrice.toLocaleString()}
                </span>

                <span>
                  ${currentPrice.toLocaleString()}
                </span>

                <span
                  className={
                    pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {pnl >= 0 ? "+" : ""}
                  ${pnl.toFixed(2)}
                </span>

                <span
                  className={
                    roi >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {roi >= 0 ? "+" : ""}
                  {roi.toFixed(2)}%
                </span>

                <button
                  onClick={() => closePosition(position.id, currentPrice)}
                  className="rounded-lg border border-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                >
                  Close
                </button>
              </div>
            );
          })
        )}
      </div>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Closed Trades</h2>

          <p className="text-sm text-zinc-500">
            {closedPositions.length} realized
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-900 bg-black">
          <div className="grid grid-cols-7 border-b border-zinc-900 px-4 py-3 text-sm text-zinc-500">
            <span>Market</span>
            <span>Side</span>
            <span>Collateral</span>
            <span>Entry</span>
            <span>Exit</span>
            <span>Realized PnL</span>
            <span>Closed</span>
          </div>

          {closedPositions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-600">
              No closed trades yet.
            </div>
          ) : (
            closedPositions.map((position) => (
              <div
                key={`${position.id}-${position.closedAt}`}
                className="grid grid-cols-7 border-b border-zinc-900 px-4 py-4 text-sm"
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
                <span>${position.entryPrice.toLocaleString()}</span>
                <span>${position.exitPrice.toLocaleString()}</span>
                <span
                  className={
                    position.realizedPnl >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {position.realizedPnl >= 0 ? "+" : ""}
                  ${position.realizedPnl.toFixed(2)} ({position.realizedRoi.toFixed(2)}%)
                </span>
                <span className="text-zinc-500">
                  {new Date(position.closedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
