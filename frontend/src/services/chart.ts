export type ChartPoint = {
  time: string;
  price: number;
};

export type Timeframe = "1" | "7" | "14" | "30";

export type CandlePoint = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type VolumePoint = {
  time: number;
  value: number;
  color: string;
};

export type MarketChartData = {
  candles: CandlePoint[];
  volumes: VolumePoint[];
  line: ChartPoint[];
};

export async function getMarketChart(
  marketSymbol: string,
  days: Timeframe = "1"
): Promise<MarketChartData> {
  try {
    const res = await fetch(`/api/chart?market=${marketSymbol}&days=${days}`, {
      cache: "no-store",
    });

    if (!res.ok) return { candles: [], volumes: [], line: [] };

    const data = await res.json();
    const candles = Array.isArray(data.candles)
      ? data.candles.map(
          ([timestamp, open, high, low, close]: [
            number,
            number,
            number,
            number,
            number,
          ]) => ({
            time: Math.floor(timestamp / 1000),
            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close),
          })
        )
      : [];
    const volumes = Array.isArray(data.volumes)
      ? data.volumes.map(([timestamp, volume]: [number, number], index: number) => {
          const candle = candles[index];
          const isUp = !candle || candle.close >= candle.open;

          return {
            time: Math.floor(timestamp / 1000),
            value: Number(volume),
            color: isUp ? "rgba(16, 185, 129, 0.35)" : "rgba(244, 63, 94, 0.35)",
          };
        })
      : [];
    const line = Array.isArray(data.prices)
      ? data.prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: Number(price.toFixed(2)),
        }))
      : [];

    return { candles, volumes, line };
  } catch {
    return { candles: [], volumes: [], line: [] };
  }
}
