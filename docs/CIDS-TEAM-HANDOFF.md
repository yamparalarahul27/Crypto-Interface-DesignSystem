# CIDS: interactive asset anatomy — team handoff

Date: November 9, 2026

## What we are building

CIDS is expanding from a crypto component library into a working demonstration
of financial and social interactions. The first step is an interactive asset
breakdown that explains what someone actually holds, using a coin that separates
into its underlying systems as the reader scrolls.

USDT is the first completed demo. Bitcoin, Ethereum, and Solana are planned next.
A social discovery and discussion experience is the broader product direction.

## Current delivery

Open `/stablecoin/usdt` in a running instance. The CIDS home page also links to
**Asset anatomy**. This is a local/repository delivery; no production deployment
was requested as part of this change.

The USDT experience includes:

- Eleven chapters covering balances, contracts, networks, issuance, reserves,
  yield, the dollar peg, issuer controls, and trust.
- An original six-layer SVG illustration that separates with scrolling and
  highlights the systems discussed in the current chapter.
- Chapter navigation and direct links, expandable explanations, source links,
  restart, and sharing a chapter link.
- A final explorer that filters on-chain, off-chain, and market layers.
- Phone, tablet, and desktop layouts, visible keyboard focus, and reduced-motion
  behavior.
- Official Tether wordmark and USDT token artwork in the header and title.

## Reference and assets

The visual and interaction reference is
[Gap’s Anatomy of a USDT](https://gaplab.me/stablecoin/usdt). This implementation
uses original SVG scene artwork and explanatory copy, with attribution in the
page. It is a close interaction study, not a pixel-identical reproduction.

The official brand assets come from [Tether’s media kit](https://tether.to/en/media).
They are stored locally under `public/brands/tether/`, alongside provenance notes.
Caveat handwriting is self-hosted with its open font license. The paper palette
is scoped to this page, preserving the existing CIDS themes.

## Content boundaries

The story links to Tether’s FAQ, reserve disclosures, terms, and Ethereum’s token
standard. It does not fetch live prices or reserves. The reserve chart is
illustrative and explicitly not to scale. This demo is educational and is not
affiliated with Tether.

Posting, comments, reactions, profiles, persistence, and additional asset stories
are not part of this first delivery. The existing CIDS gallery, canvas, templates,
and feed remain available.

## Next steps

1. Review the USDT story’s illustration quality, reading flow, and explanations.
2. Build Bitcoin with a narrative appropriate to Bitcoin: keys, UTXOs, mining,
   consensus, supply, and custody. Do not inherit USDT’s reserve/issuer model.
3. Build Ethereum and Solana around their own network and asset mechanics.
4. Extract shared illustration geometry once a second asset demonstrates what
   can actually be reused.
5. Compose these stories into a CIDS social demo, then define which interactions
   should be simulated and which require backend persistence.

## Engineering map

- `src/app/stablecoin/usdt/page.tsx`: route and page metadata.
- `src/components/asset-anatomy/usdt.ts`: typed narrative, layers, and sources.
- `src/components/asset-anatomy/AssetAnatomy.tsx`: reading and navigation behavior.
- `src/components/asset-anatomy/CoinDrawing.tsx`: USDT-specific illustration.
- `src/components/asset-anatomy/anatomy.module.css`: scoped styling and breakpoints.
- `src/components/asset-anatomy/AssetAnatomy.test.tsx`: interaction regressions.
- `docs/asset-anatomy.md`: implementation and extension notes.

The story renderer uses structured content. The drawing and layer definitions
are currently USDT-specific; adding a native coin requires its own asset model
and art rather than changing just a ticker.

An existing macOS filename collision was also corrected by renaming the canvas
search helper to `canvasSearchUtils.ts` and updating its imports.

## Run and verify

```sh
npm ci
npm run dev
# Visit http://localhost:3000/stablecoin/usdt
```

Validation for this delivery includes TypeScript, ESLint, CIDS theme/contrast/
polish/portability/registry guards, the Vitest suite, and a production build.
Browser checks cover chapter jumps, disclosures, filters, and layouts at 375,
768, and 1280 pixels. One existing ESLint warning in `check-contrast.mjs` remains.

To stop the development server, press Ctrl+C in its terminal. The local server
started during implementation is stopped after merge.
