"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ARC_TESTNET } from "@/lib/arc";

const config = getDefaultConfig({
  appName: "ArcPerps",
  projectId: "0336b4af3b2a96ba504609512b471b76",
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
