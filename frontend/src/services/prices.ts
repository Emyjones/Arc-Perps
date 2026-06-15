export type MarketPrice = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
};

type CoinGeckoMarket = {
  id?: string;
  symbol?: string;
  name?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
};

export async function getMarketPrices(): Promise<MarketPrice[]> {
  try {
    const res = await fetch("/api/prices", { cache: "no-store" });

    if (!res.ok) return [];

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((coin: CoinGeckoMarket) => ({
      id: coin.id ?? "",
      symbol: `${coin.symbol?.toUpperCase() ?? "UNKNOWN"}-USD`,
      name: `${coin.name ?? "Unknown"} Perp`,
      price: Number(coin.current_price ?? 0),
      change24h: Number(coin.price_change_percentage_24h ?? 0),
      volume24h: Number(coin.total_volume ?? 0),
    }));
  } catch {
    return [];
  }
}
