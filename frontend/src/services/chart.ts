export type ChartPoint = {
  time: string;
  price: number;
};

export async function getMarketChart(marketSymbol: string): Promise<ChartPoint[]> {
  try {
    const res = await fetch(`/api/chart?market=${marketSymbol}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    if (!Array.isArray(data.prices)) return [];

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: Number(price.toFixed(2)),
    }));
  } catch {
    return [];
  }
}
