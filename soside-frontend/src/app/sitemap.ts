import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { sectors } from "@/lib/sectors";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-28");
  const languages = { fr: `${SITE_URL}/`, en: `${SITE_URL}/en` };

  return [
    { url: `${SITE_URL}/`, lastModified, alternates: { languages } },
    { url: `${SITE_URL}/en`, lastModified, alternates: { languages } },
    ...sectors.map((s) => ({ url: `${SITE_URL}/${s.slug}`, lastModified })),
  ];
}
