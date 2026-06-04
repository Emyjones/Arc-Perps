"use client";

import { useState } from "react";

export default function TradePanel() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [collateral, setCollateral] = useState("100");
  const [leverage, setLeverage] = useState(5);

  const size = Number(collateral || 0) * leverage;

  return (
    <aside className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 text-white">
      <h2 className="mb-4 text-xl font-bold">Trade</h2>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide("long")}
          className={`rounded-lg py-3 font-bold ${
            side === "long"
              ? "bg-green-500 text-black"
              : "bg-black text-zinc-400 border border-zinc-800"
          }`}
        >
          Long
        </button>

        <button
          onClick={() => setSide("short")}
          className={`rounded-lg py-3 font-bold ${
            side === "short"
              ? "bg-red-500 text-black"
              : "bg-black text-zinc-400 border border-zinc-800"
          }`}
        >
          Short
        </button>
      </div>

      <label className="text-sm text-zinc-400">Collateral</label>
      <input
        value={collateral}
        onChange={(e) => setCollateral(e.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-800 bg-black px-3 py-3 outline-none"
        placeholder="100"
      />

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
          <span>Side</span>
          <span className={side === "long" ? "text-green-400" : "text-red-400"}>
            {side.toUpperCase()}
          </span>
        </div>
      </div>

      <button className="mt-4 w-full rounded-lg bg-white py-3 font-bold text-black">
        Open Position
      </button>
    </aside>
  );
}
