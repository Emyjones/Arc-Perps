import { NextResponse } from "next/server";

type CoinGeckoGlobalResponse = {
  data?: {
    active_cryptocurrencies?: number;
    markets?: number;
    total_market_cap?: Record<string, number>;
    total_volume?: Record<string, number>;
    market_cap_change_percentage_24h_usd?: number;
  };
};

type CryptoCompareNewsItem = {
  id?: string;
  title?: string;
  body?: string;
  url?: string;
  source?: string;
  published_on?: number;
};

type CryptoCompareNewsResponse = {
  Data?: CryptoCompareNewsItem[];
};

const FALLBACK_INTEL = {
  fundamentals: {
    activeCryptocurrencies: 0,
    markets: 0,
    totalMarketCapUsd: 0,
    totalVolumeUsd: 0,
    marketCapChange24h: 0,
  },
  news: [],
};

export async function GET() {
  const [globalResult, newsResult] = await Promise.allSettled([
    fetch("https://api.coingecko.com/api/v3/global", {
      next: { revalidate: 60 },
      headers: { accept: "application/json" },
    }),
    fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", {
      next: { revalidate: 120 },
      headers: { accept: "application/json" },
    }),
  ]);

  try {
    const globalData: CoinGeckoGlobalResponse =
      globalResult.status === "fulfilled" && globalResult.value.ok
        ? await globalResult.value.json()
        : {};
    const newsData: CryptoCompareNewsResponse =
      newsResult.status === "fulfilled" && newsResult.value.ok
        ? await newsResult.value.json()
        : {};

    const fundamentals = {
      activeCryptocurrencies: Number(
        globalData.data?.active_cryptocurrencies ?? 0
      ),
      markets: Number(globalData.data?.markets ?? 0),
      totalMarketCapUsd: Number(globalData.data?.total_market_cap?.usd ?? 0),
      totalVolumeUsd: Number(globalData.data?.total_volume?.usd ?? 0),
      marketCapChange24h: Number(
        globalData.data?.market_cap_change_percentage_24h_usd ?? 0
      ),
    };

    const news = (newsData.Data ?? []).slice(0, 6).map((item) => ({
      id: item.id ?? item.url ?? item.title ?? crypto.randomUUID(),
      title: item.title ?? "Untitled market update",
      summary: item.body ?? "",
      url: item.url ?? "",
      source: item.source ?? "CryptoCompare",
      publishedAt: item.published_on
        ? new Date(item.published_on * 1000).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({ fundamentals, news });
  } catch {
    return NextResponse.json(FALLBACK_INTEL);
  }
}
