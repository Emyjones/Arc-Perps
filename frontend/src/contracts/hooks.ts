"use client";

import { parseUnits, stringToHex, type Address } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { arcUsdcAbi, perpEngineAbi, vaultAbi } from "@/contracts/abis";
import { ARC_USDC_ADDRESS, CONTRACT_ADDRESSES } from "@/contracts/addresses";

export function useArcBalances() {
  const { address } = useAccount();

  const usdcBalance = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: arcUsdcAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const vaultBalance = useReadContract({
    address: CONTRACT_ADDRESSES.vault,
    abi: vaultAbi,
    functionName: "balances",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  return { address, usdcBalance, vaultBalance };
}

export function useArcPerpsWrites() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();

  return {
    isPending,
    data,
    error,
    approveVault: (amount: string) =>
      writeContractAsync({
        address: ARC_USDC_ADDRESS,
        abi: arcUsdcAbi,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.vault, parseUnits(amount, 6)],
      }),
    deposit: (amount: string) =>
      writeContractAsync({
        address: CONTRACT_ADDRESSES.vault,
        abi: vaultAbi,
        functionName: "deposit",
        args: [parseUnits(amount, 6)],
      }),
    withdraw: (amount: string) =>
      writeContractAsync({
        address: CONTRACT_ADDRESSES.vault,
        abi: vaultAbi,
        functionName: "withdraw",
        args: [parseUnits(amount, 6)],
      }),
    openPosition: ({
      market,
      collateral,
      leverage,
      side,
    }: {
      market: string;
      collateral: string;
      leverage: number;
      side: "LONG" | "SHORT";
    }) =>
      writeContractAsync({
        address: CONTRACT_ADDRESSES.perpEngine,
        abi: perpEngineAbi,
        functionName: "openPosition",
        args: [
          stringToHex(market, { size: 32 }),
          parseUnits(collateral, 6),
          BigInt(leverage),
          side === "LONG" ? 0 : 1,
        ],
      }),
    closePosition: () =>
      writeContractAsync({
        address: CONTRACT_ADDRESSES.perpEngine,
        abi: perpEngineAbi,
        functionName: "closePosition",
      }),
  };
}

export function useOnchainPosition(address?: Address) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.perpEngine,
    abi: perpEngineAbi,
    functionName: "positions",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}
