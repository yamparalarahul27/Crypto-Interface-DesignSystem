export type LayerId = "face" | "ledger" | "contract" | "networks" | "reserves" | "issuer";
export type LayerScope = "on-chain" | "off-chain" | "market";
export type AnatomyChapter = {
  id: string;
  title: string;
  description: string;
  scope?: LayerScope | "both";
  layers: LayerId[];
  terms?: { title: string; description: string }[];
  source?: { label: string; href: string };
};
export type AnatomyAsset = {
  symbol: string;
  name: string;
  chapters: AnatomyChapter[];
};

const faq = { label: "Tether’s FAQ", href: "https://tether.to/en/faqs/" };
const transparency = { label: "Tether’s reserve disclosures", href: "https://tether.to/en/transparency/" };
const legal = { label: "Tether’s terms", href: "https://tether.to/en/legal/" };
export const anatomyLayers: { id: LayerId; label: string; scope: LayerScope }[] = [
  { id: "face", label: "The dollar peg", scope: "market" },
  { id: "ledger", label: "Balances", scope: "on-chain" },
  { id: "contract", label: "The contract", scope: "on-chain" },
  { id: "networks", label: "Blockchains", scope: "on-chain" },
  { id: "reserves", label: "Reserves", scope: "off-chain" },
  { id: "issuer", label: "The issuer", scope: "off-chain" },
];

// Narrative and source links are independent of the scroll renderer. New assets
// should have their own mechanics and artwork, rather than inherit USDT claims.
export const usdt: AnatomyAsset = {
  symbol: "USDT",
  name: "Tether",
  chapters: [
    { id: "intro", title: "Anatomy of a USDT", description: "A dollar on your screen. A whole system underneath. Scroll to take it apart, one layer at a time.", layers: ["face"] },
    { id: "ledger", title: "Start with a balance", scope: "on-chain", description: "There is no coin tucked inside your wallet. The blockchain records a balance for your address. Your wallet helps you read it and sign instructions to move it.", layers: ["ledger"], terms: [{ title: "What does a wallet actually hold?", description: "Keys, not coins. Your private key authorizes transactions; your balance is recorded on the network. Never share your recovery phrase." }], source: { label: "Ethereum’s token standard", href: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/" } },
    { id: "contract", title: "Rules written in code", scope: "on-chain", description: "A token contract tracks balances and processes transfers. On Ethereum, USDT is a token running on the network, separate from ETH, the network’s native asset.", layers: ["contract"], terms: [{ title: "Same ticker, different token?", description: "Names can be copied. Verify both the blockchain and the official contract address before trusting a token." }], source: faq },
    { id: "networks", title: "One name. Many networks.", scope: "on-chain", description: "USDT exists on several blockchains, including Ethereum, Tron, and Solana. Each network keeps its own records. The network you send on must match the one the recipient supports.", layers: ["networks"], terms: [{ title: "Why do I need another coin for fees?", description: "The blockchain charges a network fee, usually in its native asset. A USDT balance alone may not be enough to send a transaction." }], source: faq },
    { id: "supply", title: "Where tokens come from", scope: "both", description: "Tether authorizes tokens, then issues them from its treasury to eligible customers. Returned tokens leave circulation; they may stay in treasury or be burned. A mint is not always new circulating supply.", layers: ["contract", "issuer"], terms: [{ title: "Issued versus authorized", description: "Authorized inventory held by Tether’s treasury is not circulating supply. Issuance moves that inventory into circulation." }], source: faq },
    { id: "reserves", title: "Behind the dollar", scope: "off-chain", description: "Tether says its tokens are backed by reserves. Those reserves include cash equivalents and other assets. They live outside the token contract, so a blockchain balance cannot prove what is in the reserve.", layers: ["reserves"], terms: [{ title: "What can I verify?", description: "Read the dated reserve report, its asset categories, and the accountant’s scope. A report at one point in time is not a live view of every asset." }], source: transparency },
    { id: "interest", title: "Who gets the yield?", scope: "off-chain", description: "Some reserve assets earn income. Holding ordinary USDT does not entitle you to that income. A platform offering yield adds another arrangement, and another set of risks.", layers: ["reserves", "issuer"], terms: [{ title: "USDT versus a yield product", description: "Lending or depositing your tokens is a separate activity. Check who holds the assets, where returns come from, and how withdrawals work." }], source: legal },
    { id: "peg", title: "A target, not a force field", scope: "market", description: "USDT aims to trade at one US dollar. Markets still set the price. Redemption and arbitrage can pull it toward the target, but liquidity and confidence matter when markets come under stress.", layers: ["face", "reserves"], terms: [{ title: "How does arbitrage help?", description: "When market price differs from redemption value, eligible traders may profit from the difference. Fees, access, and timing affect whether that trade is practical." }], source: { label: "How Tether works", href: "https://tether.to/en/how-it-works/" } },
    { id: "controls", title: "There is a freeze switch", scope: "on-chain", description: "A public blockchain does not make every token permissionless. Tether has issuer controls that can restrict transfers and, in some circumstances, seize or destroy tokens.", layers: ["contract", "issuer"], terms: [{ title: "Self-custody has limits", description: "Controlling your keys protects access to your wallet. It does not remove administrative powers built into the token you hold." }], source: faq },
    { id: "trust", title: "The part you put trust in", scope: "off-chain", description: "Code is only part of the picture. You also rely on an issuer, reserve assets, custodians, and legal terms. Direct redemption has eligibility requirements and can be delayed under those terms.", layers: ["issuer", "reserves"], terms: [{ title: "Can everyone redeem directly?", description: "No. Direct redemption is subject to Tether’s verification, eligibility, minimum amounts, and fees. Selling on an exchange is a different route." }], source: legal },
    { id: "pieces", title: "Now you see the pieces", description: "A token you can track. Reserves you have to evaluate. A market that connects them. Explore where each part lives.", layers: ["face", "ledger", "contract", "networks", "reserves", "issuer"] },
  ],
};
