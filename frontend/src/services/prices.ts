export type MarketPrice = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
};

export async function getMarketPrices(): Promise<MarketPrice[]> {
  try {
    const res = await fetch("/api/prices", { cache: "no-store" });

    if (!res.ok) return [];

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: `${coin.symbol.toUpperCase()}-USD`,
      name: `${coin.name} Perp`,
      price: Number(coin.current_price ?? 0),
      change24h: Number(coin.price_change_percentage_24h ?? 0),
    }));
  } catch {
    return [];
  }
}
