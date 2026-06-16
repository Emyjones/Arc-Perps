"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickSeries,
  createChart,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useMarketData } from "@/providers/MarketDataProvider";
import { useSelectedMarket } from "@/providers/MarketProvider";
import {
  getMarketChart,
  type CandlePoint,
  type Timeframe,
  type VolumePoint,
} from "@/services/chart";

const TIMEFRAMES: Array<{ label: string; value: Timeframe }> = [
  { label: "24H", value: "1" },
  { label: "7D", value: "7" },
  { label: "14D", value: "14" },
  { label: "30D", value: "30" },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export default function MarketChart() {
  const { selectedMarket } = useSelectedMarket();
  const { markets, loading } = useMarketData();
  const [timeframe, setTimeframe] = useState<Timeframe>("1");
  const [candles, setCandles] = useState<CandlePoint[]>([]);
  const [volumes, setVolumes] = useState<VolumePoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const market = markets.find((item) => item.symbol === selectedMarket);
  const positive = (market?.change24h ?? 0) >= 0;
  const latestCandle = candles.at(-1);
  const previousCandle = candles.at(-2);
  const candleMove =
    latestCandle && previousCandle
      ? latestCandle.close - previousCandle.close
      : 0;

  const priceStats = useMemo(
    () => [
      { label: "Mark Price", value: market ? formatUsd(market.price) : "--" },
      {
        label: "24H Change",
        value: market
          ? `${positive ? "+" : ""}${market.change24h.toFixed(2)}%`
          : "--",
        tone: positive ? "text-green-400" : "text-red-400",
      },
      {
        label: "24H Volume",
        value: market ? formatUsd(market.volume24h) : "--",
      },
      {
        label: "Last Candle",
        value: latestCandle ? formatUsd(latestCandle.close) : "--",
        tone: candleMove >= 0 ? "text-green-400" : "text-red-400",
      },
    ],
    [candleMove, latestCandle, market, positive]
  );

  useEffect(() => {
    async function loadChart() {
      setChartLoading(true);

      try {
        const data = await getMarketChart(selectedMarket, timeframe);
        setCandles(data.candles);
        setVolumes(data.volumes);
      } catch (error) {
        console.error(error);
        setCandles([]);
        setVolumes([]);
      } finally {
        setChartLoading(false);
      }
    }

    loadChart();
  }, [selectedMarket, timeframe]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { color: "#050505" },
        textColor: "#a1a1aa",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(39, 39, 42, 0.7)" },
        horzLines: { color: "rgba(39, 39, 42, 0.7)" },
      },
      rightPriceScale: {
        borderColor: "#27272a",
        scaleMargins: {
          top: 0.08,
          bottom: 0.26,
        },
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: "#71717a",
          labelBackgroundColor: "#18181b",
        },
        horzLine: {
          color: "#71717a",
          labelBackgroundColor: "#18181b",
        },
      },
    });

    const candlesSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderUpColor: "#10b981",
      borderDownColor: "#f43f5e",
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
      priceLineColor: "#e11d48",
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.78,
        bottom: 0,
      },
    });

    chartApiRef.current = chart;
    candleSeriesRef.current = candlesSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
      chartApiRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

    candleSeriesRef.current.setData(
      candles.map((item) => ({
        ...item,
        time: item.time as UTCTimestamp,
      }))
    );
    volumeSeriesRef.current.setData(
      volumes.map((item) => ({
        ...item,
        time: item.time as UTCTimestamp,
      }))
    );
    chartApiRef.current?.timeScale().fitContent();
  }, [candles, volumes]);

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950 text-white">
      <div className="border-b border-zinc-900 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{selectedMarket} Perp</h2>
              <span className="rounded bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400">
                {market ? `${Math.max(1, Math.round(20 + market.change24h))}x` : "20x"}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              USDC-settled perpetual market on Arc testnet
            </p>
          </div>

          <div className="flex rounded-lg border border-zinc-900 bg-black p-1">
            {TIMEFRAMES.map((item) => (
              <button
                key={item.value}
                onClick={() => setTimeframe(item.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  timeframe === item.value
                    ? "bg-white text-black"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {priceStats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className="text-xs text-zinc-500">{stat.label}</p>
              <p className={`mt-1 truncate text-sm font-semibold ${stat.tone ?? ""}`}>
                {loading ? "--" : stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2 text-xs text-zinc-500">
        <span>Chart</span>
        <span className="text-white">Candles</span>
        <span>Depth</span>
        <span>Funding</span>
        <span>Tools</span>
      </div>

      <div className="relative h-[480px] w-full min-w-0 bg-black">
        <div ref={chartRef} className="h-full w-full" />

        {chartLoading && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 text-sm text-zinc-500">
            Loading chart...
          </div>
        )}

        {!chartLoading && candles.length === 0 && (
          <div className="absolute inset-0 grid place-items-center bg-black/80 text-sm text-zinc-500">
            Chart data is temporarily unavailable.
          </div>
        )}
      </div>

      {latestCandle && (
        <div className="grid grid-cols-4 gap-3 border-t border-zinc-900 p-4 text-xs text-zinc-500">
          <span>O {formatUsd(latestCandle.open)}</span>
          <span>H {formatUsd(latestCandle.high)}</span>
          <span>L {formatUsd(latestCandle.low)}</span>
          <span>C {formatUsd(latestCandle.close)}</span>
        </div>
      )}
    </section>
  );
}
