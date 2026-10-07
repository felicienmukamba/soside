import { WA_BASE } from "@/lib/site";

/** Floating WhatsApp button, fixed to the bottom-right on every page. */
export default function WhatsAppButton() {
  return (
    <a className="wa" href={WA_BASE} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
      WhatsApp
    </a>
  );
}
