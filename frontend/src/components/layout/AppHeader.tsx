"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Trade", href: "/trade" },
  { label: "Markets", href: "/markets" },
  { label: "ArcIntel", href: "/intel" },
  { label: "Portfolio", href: "/portfolio" },
];

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-4">
      <div className="flex items-center gap-10">
        <Link href="/">
          <div>
            <h1 className="text-2xl font-bold text-white">
              ArcPerps
            </h1>
            <p className="text-sm text-zinc-500">
              Stablecoin-native perpetual trading on Arc
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <ConnectButton />
    </header>
  );
}
      
