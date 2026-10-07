import type { Metadata, Viewport } from "next";
import { figtree, unbounded } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import "../globals.css";

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

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${unbounded.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
