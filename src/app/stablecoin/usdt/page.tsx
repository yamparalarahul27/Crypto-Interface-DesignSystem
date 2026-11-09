import type { Metadata } from "next";
import { AssetAnatomy } from "@/components/asset-anatomy/AssetAnatomy";
import { usdt } from "@/components/asset-anatomy/usdt";

export const metadata: Metadata = {
  title: { absolute: "Anatomy of a USDT · CIDS" },
  description: "Take USDT apart in an interactive visual story. Explore its ledger, smart contract, networks, reserves, and the trust behind the dollar peg.",
};

export default function USDTAnatomyPage() {
  return <AssetAnatomy asset={usdt} />;
}
