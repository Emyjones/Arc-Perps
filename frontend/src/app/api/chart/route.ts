import { NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana",
};

const VALID_DAYS = new Set(["1", "7", "14", "30"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") ?? "BTC-USD";
  const days = searchParams.get("days") ?? "1";
  const coinId = COINGECKO_IDS[market] ?? "bitcoin";
  const safeDays = VALID_DAYS.has(days) ? days : "1";

  try {
    const [ohlcRes, marketRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${safeDays}`,
        {
          next: { revalidate: 30 },
          headers: {
            accept: "application/json",
          },
        }
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${safeDays}`,
        {
          next: { revalidate: 30 },
          headers: {
            accept: "application/json",
          },
        }
      ),
    ]);

    if (!ohlcRes.ok || !marketRes.ok) {
      return NextResponse.json({ candles: [], volumes: [], prices: [] });
    }

    const [ohlcData, marketData] = await Promise.all([
      ohlcRes.json(),
      marketRes.json(),
    ]);

    const volumes = Array.isArray(marketData.total_volumes)
      ? marketData.total_volumes
      : [];

    return NextResponse.json({
      candles: Array.isArray(ohlcData) ? ohlcData : [],
      volumes,
      prices: Array.isArray(marketData.prices) ? marketData.prices : [],
    });
  } catch {
    return NextResponse.json({ candles: [], volumes: [], prices: [] });
  }
}
