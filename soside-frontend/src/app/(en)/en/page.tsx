import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const seo = content.en.seo;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: { fr: `${SITE_URL}/`, en: `${SITE_URL}/en`, "x-default": `${SITE_URL}/` },
  },
  openGraph: {
    type: "website",
    siteName: "SOSIDE",
    locale: "en_US",
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/en`,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <HomePage lang="en" />;
}
