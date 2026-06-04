"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { useSelectedMarket } from "@/providers/MarketProvider";
import { getMarketChart, type ChartPoint } from "@/services/chart";

export default function MarketChart() {
  const { selectedMarket } = useSelectedMarket();
  const { markets, loading } = useMarketPrices();
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const market = markets.find((item) => item.symbol === selectedMarket);
  const positive = (market?.change24h ?? 0) >= 0;

  useEffect(() => {
    async function loadChart() {
      try {
        const data = await getMarketChart(selectedMarket);
        setChartData(data);
      } catch (error) {
        console.error(error);
        setChartData([]);
      }
    }

    loadChart();
  }, [selectedMarket]);

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {selectedMarket} Perp
          </h2>
          <p className="text-sm text-zinc-500">24h live price chart</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {loading || !market
              ? "Loading..."
              : `$${market.price.toLocaleString()}`}
          </p>

          <p
            className={
              positive ? "text-sm text-green-400" : "text-sm text-red-400"
            }
          >
            {market
              ? `${positive ? "+" : ""}${market.change24h.toFixed(2)}%`
              : "--"}
          </p>
        </div>
      </div>

      <div className="h-[420px] w-full min-w-0 rounded-xl border border-zinc-900 bg-black p-4">
        <ResponsiveContainer width="99%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{ fill: "#71717a", fontSize: 12 }} />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#fafafa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
