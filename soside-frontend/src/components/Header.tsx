import Link from "next/link";
import Image from "next/image";

export interface HeaderProps {
  /** "/" on the FR home, "/en/" on the EN home, "/" from a sector page. */
  homeHref: string;
  nav: { offers: string; references: string; method: string; faq: string; contact: string };
  brandTag: string;
  brandAria: string;
  navAria: string;
  logoAlt: string;
  /** Omit to hide the switcher entirely (used on the FR-only sector pages). */
  langSwitch?: { fr: string; en: string; current: "fr" | "en" };
}

export default function Header({
  homeHref,
  nav,
  brandTag,
  brandAria,
  navAria,
  logoAlt,
  langSwitch,
}: HeaderProps) {
  return (
    <header>
      <div className="w">
        <Link className="brand" href={homeHref} aria-label={brandAria}>
          <Image src="/icon.png" alt={logoAlt} width={38} height={38} priority />
          <span>SOSIDE</span>
          <span className="tag">{brandTag}</span>
        </Link>
        <nav aria-label={navAria}>
          <Link className="l" href={`${homeHref}#offres`}>
            {nav.offers}
          </Link>
          <Link className="l" href={`${homeHref}#references`}>
            {nav.references}
          </Link>
          <Link className="l" href={`${homeHref}#methode`}>
            {nav.method}
          </Link>
          <Link className="l" href={`${homeHref}#faq`}>
            {nav.faq}
          </Link>
          {langSwitch && (
            <div className="lg" role="group" aria-label="Langue / Language">
              <Link href={langSwitch.fr} hrefLang="fr" aria-current={langSwitch.current === "fr" ? "page" : undefined}>
                FR
              </Link>
              <Link href={langSwitch.en} hrefLang="en" aria-current={langSwitch.current === "en" ? "page" : undefined}>
                EN
              </Link>
            </div>
          )}
          <Link className="btn p" href={`${homeHref}#contact`}>
            {nav.contact}
          </Link>
        </nav>
      </div>
    </header>
  );
}
