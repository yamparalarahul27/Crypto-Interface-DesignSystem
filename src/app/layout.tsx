import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Agentation } from "agentation";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

/* Mix stack (DESIGN.md → Typography):
   Satoshi UI → @font-face in globals (--font-sans)
   Space Grotesk → display / brand moments (--font-display)
   JetBrains Mono → code, addresses, handles (--font-mono)
   Geist Pixel Square → financial .data-* (unchanged) */

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "DeFi Triangle: Solana token intelligence",
    template: "%s · DeFi Triangle",
  },
  description:
    "Trending Solana markets, variants, and risk: scored in real time. Backed by Birdeye, Jupiter, and Tokens.xyz.",
  openGraph: {
    title: "DeFi Triangle: Solana token intelligence",
    description:
      "Trending Solana markets, variants, and risk: scored in real time.",
    type: "website",
    siteName: "DeFi Triangle",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeFi Triangle: Solana token intelligence",
    description:
      "Trending Solana markets, variants, and risk: scored in real time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-page text-fg pb-14">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
