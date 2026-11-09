# CIDS asset anatomy

The first asset story is at `/stablecoin/usdt`, linked from the CIDS home page.
It studies the scroll-driven exploded illustration in
[Gap’s USDT anatomy](https://gaplab.me/stablecoin/usdt), with original SVG artwork
and explanatory copy. The paper palette and handwriting are scoped to this
experience; the existing gallery, canvas, feed, and theme tokens stay available.

## What works

- Eleven chapters, scroll-linked coin separation, and chapter-specific highlights.
- Direct chapter links, keyboard-operable jump controls, previous content retained
  in the document, native expandable explanations, and a mobile chapter selector.
- A final layer explorer: all, on-chain, off-chain, or market.
- Share a chapter URL, restart, and reduced-motion support.
- Primary-source links. No live financial data or changing reserve totals.
  The reserve chart is explicitly illustrative, not a portfolio allocation.

## Where to extend

`src/components/asset-anatomy/usdt.ts` contains the typed asset story, six layers,
source references, and chapter-to-layer mappings. `AssetAnatomy.tsx` owns reading
and navigation; `CoinDrawing.tsx` owns the USDT-specific illustration. The renderer
is data-driven, but the artwork remains deliberately specific to USDT.

For Bitcoin, Ethereum, and Solana, create asset-specific narratives, sources,
layer definitions, and drawings. Do not reuse USDT’s reserve/issuer model for
native coins. Separate shared scene geometry from those drawings once the
second asset makes the common structure clear.

The next product direction is a social interaction demo built with CIDS:
asset stories can become items people discover and discuss in the feed. The
current work establishes the asset story; it does not add posting, accounts,
reactions, persistence, or a live market-data service.

## Local verification

Run `npm run dev`, then open `/stablecoin/usdt`. Check desktop and mobile, jump
between chapters, expand terms, and filter the final drawing. Run the project’s
CI checks and `npm run build` before shipping.

The existing canvas search helper was renamed to `canvasSearchUtils.ts` to avoid
a case-insensitive filename collision with `CanvasSearch.tsx` on macOS.
