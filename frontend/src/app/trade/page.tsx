import AppHeader from "@/components/layout/AppHeader";
import MarketSidebar from "@/components/trade/MarketSidebar";
import MarketChart from "@/components/trade/MarketChart";
import TradePanel from "@/components/trade/TradePanel";
import OpenPositions from "@/components/trade/OpenPositions";
import { MarketProvider } from "@/providers/MarketProvider";
import { MarketDataProvider } from "@/providers/MarketDataProvider";

export default function TradePage() {
  return (
    <MarketProvider>
      <MarketDataProvider>
        <main className="min-h-screen bg-black">
          <AppHeader />

          <section className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <MarketSidebar />
            </div>

            <div className="col-span-6">
              <MarketChart />
            </div>

            <div className="col-span-3">
              <TradePanel />
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
