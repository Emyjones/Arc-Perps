export default function OpenPositions() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Open Positions</h2>
        <p className="text-sm text-zinc-500">0 active</p>
      </div>

      <div className="rounded-lg border border-zinc-900 bg-black">
        <div className="grid grid-cols-7 border-b border-zinc-900 px-4 py-3 text-sm text-zinc-500">
          <span>Market</span>
          <span>Side</span>
          <span>Size</span>
          <span>Entry</span>
          <span>Mark</span>
          <span>PnL</span>
          <span>Status</span>
        </div>

        <div className="px-4 py-8 text-center text-sm text-zinc-600">
          No open positions yet.
        </div>
      </div>
    </section>
  );
}
