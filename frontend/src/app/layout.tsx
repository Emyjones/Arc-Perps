import WalletProvider from "@/providers/WalletProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc Perps",
  description: "Trade perpetual markets on Arc testnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
