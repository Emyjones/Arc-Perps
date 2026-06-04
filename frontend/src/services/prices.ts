export type MarketPrice = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
};

const FALLBACK_MARKETS: MarketPrice[] = [
  {
    id: "bitcoin",
    symbol: "BTC-USD",
    name: "Bitcoin Perp",
    price: 0,
    change24h: 0,
  },
  {
    id: "ethereum",
    symbol: "ETH-USD",
    name: "Ethereum Perp",
    price: 0,
    change24h: 0,
  },
  {
    id: "solana",
    symbol: "SOL-USD",
    name: "Solana Perp",
    price: 0,
    change24h: 0,
  },
];

export async function getMarketPrices(): Promise<MarketPrice[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("CoinGecko request failed:", res.status);
      return FALLBACK_MARKETS;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("Unexpected CoinGecko response:", data);
      return FALLBACK_MARKETS;
    }

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: `${coin.symbol.toUpperCase()}-USD`,
      name: `${coin.name} Perp`,
      price: Number(coin.current_price ?? 0),
      change24h: Number(coin.price_change_percentage_24h ?? 0),
    }));
  } catch (error) {
    console.warn("Failed to fetch market prices:", error);
    return FALLBACK_MARKETS;
  }
}
