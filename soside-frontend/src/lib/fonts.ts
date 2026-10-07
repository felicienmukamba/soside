import { Figtree, Unbounded } from "next/font/google";

// Self-hosted by Next.js at build time (no runtime request to Google Fonts,
// no layout shift). Both (fr) and (en) root layouts import these so the
// font files are only fetched/compiled once.
export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-unbounded",
  display: "swap",
});
