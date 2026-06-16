export type MarketFundamentals = {
  activeCryptocurrencies: number;
  markets: number;
  totalMarketCapUsd: number;
  totalVolumeUsd: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  sentimentValue: number;
  sentimentLabel: string;
  regime: string;
};

export type IntelNewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
};

export type IntelSnapshot = {
  fundamentals: MarketFundamentals;
  news: IntelNewsItem[];
};

const EMPTY_INTEL: IntelSnapshot = {
  fundamentals: {
    activeCryptocurrencies: 0,
    markets: 0,
    totalMarketCapUsd: 0,
    totalVolumeUsd: 0,
    marketCapChange24h: 0,
    btcDominance: 0,
    ethDominance: 0,
    sentimentValue: 0,
    sentimentLabel: "Unavailable",
    regime: "Unknown",
  },
  news: [],
};

export async function getIntelSnapshot(): Promise<IntelSnapshot> {
  try {
    const res = await fetch("/api/intel", { cache: "no-store" });

    if (!res.ok) return EMPTY_INTEL;

    const data = await res.json();

    return {
      fundamentals: {
        activeCryptocurrencies: Number(
          data.fundamentals?.activeCryptocurrencies ?? 0
        ),
        markets: Number(data.fundamentals?.markets ?? 0),
        totalMarketCapUsd: Number(data.fundamentals?.totalMarketCapUsd ?? 0),
        totalVolumeUsd: Number(data.fundamentals?.totalVolumeUsd ?? 0),
        marketCapChange24h: Number(data.fundamentals?.marketCapChange24h ?? 0),
        btcDominance: Number(data.fundamentals?.btcDominance ?? 0),
        ethDominance: Number(data.fundamentals?.ethDominance ?? 0),
        sentimentValue: Number(data.fundamentals?.sentimentValue ?? 0),
        sentimentLabel: String(
          data.fundamentals?.sentimentLabel ?? "Unavailable"
        ),
        regime: String(data.fundamentals?.regime ?? "Unknown"),
      },
      news: Array.isArray(data.news) ? data.news : [],
    };
  } catch {
    return EMPTY_INTEL;
  }
}
