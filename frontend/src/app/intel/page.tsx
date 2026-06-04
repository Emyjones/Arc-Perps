import AppHeader from "@/components/layout/AppHeader";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AppHeader />

      <section className="p-6">
        <h1 className="text-3xl font-bold">ArcIntel</h1>
        <p className="mt-2 text-zinc-500">Coming soon.</p>
      </section>
    </main>
  );
}