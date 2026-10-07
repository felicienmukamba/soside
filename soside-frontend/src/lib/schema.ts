import { SITE_URL, EMAIL, PHONE_E164 } from "./site";

/** schema.org ProfessionalService for SOSIDE, included on every page. */
export const organizationSchema = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#org`,
  name: "SOSIDE",
  alternateName: "Solution Side with AI",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og.png`,
  email: EMAIL,
  telephone: `+${PHONE_E164}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bukavu",
    addressRegion: "Sud-Kivu",
    addressCountry: "CD",
  },
  areaServed: ["Bukavu", "Sud-Kivu", "République démocratique du Congo"],
  founder: {
    "@type": "Person",
    name: "Félicien Mukamba",
    url: "https://felicienmukamba.vercel.app",
    sameAs: [
      "https://www.linkedin.com/in/felicien-mukamba-5b49ab252/",
      "https://github.com/felicienmukamba",
    ],
  },
};

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceSchema(name: string, serviceType: string) {
  return {
    "@type": "Service",
    name,
    serviceType,
    areaServed: "Bukavu, Sud-Kivu, RDC",
    provider: { "@type": "Organization", name: "SOSIDE", url: `${SITE_URL}/` },
  };
}

export function videoSchema(name: string, description: string, slug: string) {
  return {
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${SITE_URL}/videos/${slug}.jpg`,
    contentUrl: `${SITE_URL}/videos/${slug}.mp4`,
    uploadDate: "2026-09-28",
    duration: "PT8S",
  };
}
