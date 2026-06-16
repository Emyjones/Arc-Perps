import AppHeader from "@/components/layout/AppHeader";
import MarketSidebar from "@/components/trade/MarketSidebar";
import MarketChart from "@/components/trade/MarketChart";
import MarketStatsBar from "@/components/trade/MarketStatsBar";
import MarketTicker from "@/components/trade/MarketTicker";
import OrderBook from "@/components/trade/OrderBook";
import TradePanel from "@/components/trade/TradePanel";
import OpenPositions from "@/components/trade/OpenPositions";
import RecentTrades from "@/components/trade/RecentTrades";
import { MarketProvider } from "@/providers/MarketProvider";
import { MarketDataProvider } from "@/providers/MarketDataProvider";

export default function TradePage() {
  return (
    <MarketProvider>
      <MarketDataProvider>
        <main className="min-h-screen bg-black">
          <AppHeader />
          <MarketTicker />
          <MarketStatsBar />

          <section className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12 lg:col-span-2">
              <MarketSidebar />
            </div>

            <div className="col-span-12 lg:col-span-7">
              <MarketChart />
            </div>

            <div className="col-span-12 space-y-4 lg:col-span-3">
              <TradePanel />
              <OrderBook />
              <RecentTrades />
            </div>
          </section>

          <section className="px-4 pb-4">
            <OpenPositions />
          </section>
        </main>
      </MarketDataProvider>
    </MarketProvider>
  );
}
