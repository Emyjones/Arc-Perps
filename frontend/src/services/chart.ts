export type ChartPoint = {
  time: string;
  price: number;
};

const COINGECKO_IDS: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana",
};

export async function getMarketChart(
  marketSymbol: string
): Promise<ChartPoint[]> {
  const coinId = COINGECKO_IDS[marketSymbol] ?? "bitcoin";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Chart request failed:", res.status);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data.prices)) {
      return [];
    }

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: Number(price.toFixed(2)),
    }));
  } catch (error) {
    console.warn("Failed to fetch chart:", error);
    return [];
  }
}
