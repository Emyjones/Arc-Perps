"use client";

import { useMemo } from "react";
import { useMarketData } from "@/providers/MarketDataProvider";
import { useSelectedMarket } from "@/providers/MarketProvider";

type BookRow = {
  price: number;
  amount: number;
  total: number;
};

function buildBook(midPrice: number) {
  const asks: BookRow[] = [];
  const bids: BookRow[] = [];
  const tickSize = Math.max(0.5, midPrice * 0.00002);
  let bidTotal = 0;
  let askTotal = 0;

  for (let index = 8; index >= 1; index--) {
    const amount = Number((0.08 + index * 0.041).toFixed(4));
    askTotal += amount;
    asks.push({
      price: midPrice + tickSize * index,
      amount,
      total: askTotal,
    });
  }

  for (let index = 1; index <= 8; index++) {
    const amount = Number((0.11 + index * 0.036).toFixed(4));
    bidTotal += amount;
    bids.push({
      price: midPrice - tickSize * index,
      amount,
      total: bidTotal,
    });
  }

  return { asks, bids };
}

export default function OrderBook() {
  const { selectedMarket } = useSelectedMarket();
  const { markets } = useMarketData();
  const market = markets.find((item) => item.symbol === selectedMarket);
  const midPrice = market?.price ?? 0;
  const book = useMemo(() => buildBook(midPrice || 65000), [midPrice]);
  const maxTotal = Math.max(...book.asks.map((row) => row.total), ...book.bids.map((row) => row.total));

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950 text-white">
      <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
        <h2 className="font-bold">Order Book</h2>
        <span className="text-xs text-zinc-500">Simulated depth</span>
      </div>

      <div className="grid grid-cols-3 px-4 py-2 text-xs text-zinc-500">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="space-y-1 px-2 pb-2">
        {book.asks.map((row) => (
          <div
            key={`ask-${row.price}`}
            className="relative grid grid-cols-3 rounded px-2 py-1 text-xs"
          >
            <div
              className="absolute inset-y-0 right-0 rounded bg-red-500/10"
              style={{ width: `${(row.total / maxTotal) * 100}%` }}
            />
            <span className="relative text-red-400">{row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="relative text-right">{row.amount.toFixed(4)}</span>
            <span className="relative text-right">{row.total.toFixed(4)}</span>
          </div>
        ))}
      </div>

      <div className="border-y border-zinc-900 px-4 py-3">
        <p className="text-center text-lg font-bold text-white">
          {midPrice ? `$${midPrice.toLocaleString()}` : "--"}
        </p>
        <p className="text-center text-xs text-zinc-500">{selectedMarket} mark</p>
      </div>

      <div className="space-y-1 px-2 py-2">
        {book.bids.map((row) => (
          <div
            key={`bid-${row.price}`}
            className="relative grid grid-cols-3 rounded px-2 py-1 text-xs"
          >
            <div
              className="absolute inset-y-0 right-0 rounded bg-emerald-500/10"
              style={{ width: `${(row.total / maxTotal) * 100}%` }}
            />
            <span className="relative text-emerald-400">{row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="relative text-right">{row.amount.toFixed(4)}</span>
            <span className="relative text-right">{row.total.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
