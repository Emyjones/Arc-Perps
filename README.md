# ArcPerps

ArcPerps is a stablecoin-native perpetual trading terminal built for Circle's Arc testnet. The project demonstrates a USDC-first trading UX on an EVM-compatible chain with live markets, perp-style risk controls, ArcIntel market intelligence, and onchain contract scaffolding for deposits and positions.

## Why Arc

- Native USDC collateral and gas UX
- EVM-compatible Solidity contracts
- Fast testnet execution for trading-style workflows
- Stablecoin-native accounting from deposit through PnL

## Product Surface

- Trading terminal with live BTC/ETH/SOL market data
- TradingView-style candlestick chart powered by `lightweight-charts`
- Market ticker, mark/index stats, funding/countdown row
- Demo order ticket with margin, estimated fees, liquidation estimate
- Simulated order book and market trades derived from live mark prices
- Open positions, realized PnL, and closed trade history
- Portfolio overview across open and closed positions
- ArcIntel dashboard with market fundamentals, sentiment, dominance, regime, and live news

## Contracts

Current Arc testnet deployment:

- Arc USDC: `0x3600000000000000000000000000000000000000`
- Vault: `0x7Ee2e72E7e28DFb901C27dfb2Ee05D923f769283`
- OracleManager: `0xb0D980b96001b19D08C0E0f0D0990dB6C7513e33`
- PerpEngine: `0xAb00fdbf9d5C59bA218aACE33DB637FE846549f9`

Contract integration config lives in `frontend/src/contracts`.

## Local Development

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the frontend in webpack mode:

```bash
npm run dev -- --webpack
```

Build the frontend:

```bash
npm run build
```

Build contracts:

```bash
forge build
```

Deploy contracts to Arc testnet:

```bash
forge script script/Deploy.s.sol:Deploy --rpc-url arc --broadcast
```

## Data Sources

All browser-facing market data is routed through Next.js API routes:

- `/api/prices` for live market cards and ticker data
- `/api/chart` for OHLC and volume chart data
- `/api/intel` for fundamentals, sentiment, and news

This keeps the UI resilient and avoids direct browser calls to third-party market APIs.

## Hackathon Roadmap

- Wire order ticket to real Arc testnet transactions
- Add deposit/withdraw modal with USDC approval flow
- Seed onchain oracle prices from trusted API snapshots
- Add contract tests around PnL, liquidation, and vault accounting
- Replace simulated order book/trade tape with indexed events or a real feed
