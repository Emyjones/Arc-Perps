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
  currentPrice: number;
}

export interface ClosedPosition extends Position {
  exitPrice: number;
  realizedPnl: number;
  realizedRoi: number;
  closedAt: string;
}

interface TradeState {
  positions: Position[];
  closedPositions: ClosedPosition[];
  addPosition: (position: Position) => void;
  closePosition: (id: string, exitPrice: number) => void;
}

export function calculatePositionPnl(position: Position, currentPrice: number) {
  const priceDelta =
    position.side === "LONG"
      ? currentPrice - position.entryPrice
      : position.entryPrice - currentPrice;

  return (priceDelta / position.entryPrice) * position.size;
}

export const useTradeStore = create<TradeState>((set) => ({
  positions: [],
  closedPositions: [],

  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),

  closePosition: (id, exitPrice) =>
    set((state) => {
      const position = state.positions.find((item) => item.id === id);

      if (!position) return state;

      const realizedPnl = calculatePositionPnl(position, exitPrice);
      const realizedRoi = (realizedPnl / position.collateral) * 100;
      const closedPosition: ClosedPosition = {
        ...position,
        currentPrice: exitPrice,
        exitPrice,
        realizedPnl,
        realizedRoi,
        closedAt: new Date().toISOString(),
      };

      return {
        positions: state.positions.filter((item) => item.id !== id),
        closedPositions: [closedPosition, ...state.closedPositions],
      };
    }),
}));
