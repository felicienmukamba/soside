import type { Metadata, Viewport } from "next";
import { figtree, unbounded } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import "../globals.css";

// Next.js supports multiple root layouts via route groups: this (fr) group
// and the (en) group each render their own <html>/<body>, which is how the
// two get a correct, distinct `lang` attribute without a client-side
// language switch. See: https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/icon.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#88e24b",
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${figtree.variable} ${unbounded.variable}`}>
      <body>
        {/* Adds .js before first paint so reveal-on-scroll only hides
            content when JavaScript can actually reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
