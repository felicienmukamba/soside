import type { Metadata } from "next";
import SectorPage from "@/components/SectorPage";
import { getSector } from "@/lib/sectors";
import { SITE_URL } from "@/lib/site";

const slug = "ecoles" as const;
const sector = getSector(slug)!;

export const metadata: Metadata = {
  title: sector.seoTitle,
  description: sector.seoDescription,
  alternates: { canonical: `${SITE_URL}/${slug}` },
  openGraph: {
    type: "website",
    siteName: "SOSIDE",
    locale: "fr_FR",
    title: sector.seoTitle,
    description: sector.seoDescription,
    url: `${SITE_URL}/${slug}`,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <SectorPage slug={slug} />;
}
