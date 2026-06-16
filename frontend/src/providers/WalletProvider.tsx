"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ARC_TESTNET } from "@/lib/arc";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "0336b4af3b2a96ba504609512b471b76";

const config = getDefaultConfig({
  appName: "ArcPerps",
  projectId: walletConnectProjectId,
  chains: [ARC_TESTNET],
  transports: {
    [ARC_TESTNET.id]: http("https://rpc.testnet.arc.network"),
  },
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
