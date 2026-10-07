export type Lang = "fr" | "en";

// TODO: replace with the real production domain once it is confirmed,
// then update it here only — every canonical URL, the sitemap and the
// JSON-LD in this project all read from this one constant.
export const SITE_URL = "https://sosside.vercel.app";

export const PHONE_E164 = "243995209133";
export const PHONE_DISPLAY = "+243 995 209 133";
export const EMAIL = "felicienmukamba.cd@gmail.com";

/** Bare WhatsApp link, no prefilled message (used by the floating button). */
export const WA_BASE = `https://wa.me/${PHONE_E164}`;

/** WhatsApp deep link with a prefilled, URL-encoded message. */
export function waLink(text: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

/** mailto: link with a prefilled subject line. */
export function mailLink(subject: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}
