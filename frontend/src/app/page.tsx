import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AppHeader />

      <section className="flex min-h-[80vh] items-center justify-center px-6 text-center">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Built on Arc Testnet
          </p>

          <h1 className="text-7xl font-bold">
            ArcPerps
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
            Stablecoin-native perpetual trading powered by Arc&apos;s USDC gas,
            fast finality, and institutional-grade settlement rails.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/trade"
              className="rounded-xl bg-white px-6 py-3 font-bold text-black"
            >
              Launch App
            </Link>

            <Link
              href="/intel"
              className="rounded-xl border border-zinc-800 px-6 py-3 font-bold text-white hover:bg-zinc-900"
            >
              ArcIntel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
