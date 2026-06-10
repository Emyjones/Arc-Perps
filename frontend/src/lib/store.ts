"use client";

import { create } from "zustand";

export interface Position {
  id: string;
  market: string;
  side: "LONG" | "SHORT";
  collateral: number;
  leverage: number;
  size: number;
  entryPrice: number;
}

interface TradeState {
  positions: Position[];
  addPosition: (position: Position) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  positions: [],
  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),
}));
