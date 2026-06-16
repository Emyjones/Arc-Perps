"use client";

import { useState, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { useSelectedMarket } from "@/providers/MarketProvider";
import { useMarketData } from "@/providers/MarketDataProvider";
import { useTradeStore } from "@/lib/store";

export default function TradePanel() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [collateral, setCollateral] = useState("100");
  const [leverage, setLeverage] = useState(5);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const { selectedMarket } = useSelectedMarket();
  const { markets } = useMarketData();
  const { isConnected } = useAccount();
  const addPosition = useTradeStore((state) => state.addPosition);

  const market = markets.find((item) => item.symbol === selectedMarket);
  const collateralAmount = Number(collateral || 0);
  const size = collateralAmount * leverage;
  const walletReady = mounted && isConnected;
  const canOpenPosition = walletReady && Boolean(market) && collateralAmount > 0;
  const estimatedFee = size * 0.00038;
  const liquidationPrice =
    market && collateralAmount > 0
      ? side === "long"
        ? market.price * (1 - 0.8 / leverage)
        : market.price * (1 + 0.8 / leverage)
      : 0;

  function handleOpenPosition() {
    if (!canOpenPosition || !market) return;

    addPosition({
      id: crypto.randomUUID(),
      market: selectedMarket,
      side: side.toUpperCase() as "LONG" | "SHORT",
      collateral: Number(collateral),
      leverage,
      size,
      entryPrice: market.price,
      currentPrice: market.price,
    });
  }

  return (
    <aside className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Ticket</h2>
        <span className="rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-400">
          Demo Mode
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
        {["Market", "Limit", "Advanced"].map((mode) => (
          <button
            key={mode}
            className={`rounded-lg border py-2 font-semibold ${
              mode === "Market"
                ? "border-white bg-white text-black"
                : "border-zinc-900 bg-black text-zinc-500"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide("long")}
          className={`rounded-lg py-3 font-bold ${
            side === "long"
              ? "bg-green-500 text-black"
              : "border border-zinc-800 bg-black text-zinc-400"
          }`}
        >
          Long
        </button>

        <button
          onClick={() => setSide("short")}
          className={`rounded-lg py-3 font-bold ${
            side === "short"
              ? "bg-red-500 text-black"
              : "border border-zinc-800 bg-black text-zinc-400"
          }`}
        >
          Short
        </button>
      </div>

      <label className="text-sm text-zinc-400">Collateral</label>
      <div className="mt-2 flex rounded-lg border border-zinc-800 bg-black">
        <input
          value={collateral}
          onChange={(e) => setCollateral(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none"
          placeholder="100"
        />
        <span className="border-l border-zinc-800 px-3 py-3 text-sm font-semibold text-zinc-400">
          USDC
        </span>
      </div>

      <label className="mt-4 block text-sm text-zinc-400">
        Leverage: {leverage}x
      </label>

      <input
        type="range"
        min="1"
        max="20"
        value={leverage}
        onChange={(e) => setLeverage(Number(e.target.value))}
        className="mt-3 w-full"
      />

      <div className="mt-4 rounded-lg border border-zinc-900 bg-black p-3 text-sm text-zinc-400">
        <div className="flex justify-between">
          <span>Position Size</span>
          <span>{size.toLocaleString()} USDC</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Entry Price</span>
          <span>{market ? `$${market.price.toLocaleString()}` : "--"}</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Margin Required</span>
          <span>{collateralAmount.toLocaleString()} USDC</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Est. Fee</span>
          <span>{estimatedFee.toFixed(2)} USDC</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Liq. Price</span>
          <span>
            {liquidationPrice ? `$${liquidationPrice.toLocaleString()}` : "--"}
          </span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Side</span>
          <span className={side === "long" ? "text-green-400" : "text-red-400"}>
            {side.toUpperCase()}
          </span>
        </div>
      </div>

      <button
        onClick={handleOpenPosition}
        disabled={!canOpenPosition}
        className="mt-4 w-full rounded-lg bg-white py-3 font-bold text-black transition disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {walletReady ? "Open Position" : "Connect wallet to trade"}
      </button>
    </aside>
  );
}
