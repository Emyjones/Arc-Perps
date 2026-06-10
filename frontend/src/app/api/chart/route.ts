import { NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") ?? "BTC-USD";
  const coinId = COINGECKO_IDS[market] ?? "bitcoin";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
      {
        next: { revalidate: 30 },
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ prices: [] });
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ prices: [] });
  }
}
