import type { Address } from "viem";

export const ARC_CHAIN_ID = 5042002;

export const ARC_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as Address;

export const CONTRACT_ADDRESSES = {
  vault: "0x7Ee2e72E7e28DFb901C27dfb2Ee05D923f769283",
  oracle: "0xb0D980b96001b19D08C0E0f0D0990dB6C7513e33",
  perpEngine: "0xAb00fdbf9d5C59bA218aACE33DB637FE846549f9",
} as const satisfies Record<string, Address>;
