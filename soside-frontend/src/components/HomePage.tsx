import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import Stats from "./Stats";
import DiagnosticForm from "./DiagnosticForm";
import WhatsAppButton from "./WhatsAppButton";
import JsonLd from "./JsonLd";
import { RevealDiv, RevealLi, RevealDetails } from "./Reveal";
import { content } from "@/lib/content";
import { waLink, mailLink, type Lang } from "@/lib/site";
import { faqSchema } from "@/lib/schema";

export default function HomePage({ lang }: { lang: Lang }) {
  const c = content[lang];
  const homeHref = lang === "en" ? "/en/" : "/";
  const otherHref = lang === "en" ? "/" : "/en/";

  return (
    <>
      <Header
        homeHref={homeHref}
        nav={c.nav}
        brandTag={c.brandTag}
        brandAria={c.alt.brandAria}
        navAria={c.alt.navAria}
        logoAlt={c.alt.logo}
        langSwitch={{ fr: lang === "en" ? otherHref : homeHref, en: lang === "en" ? homeHref : otherHref, current: lang }}
      />

      <main id="top">
        <div className="hero">
          <div className="w hg">
            <div>
              <h1>{c.hero.h1}</h1>
              <p>{c.hero.p1}</p>
              <p>{c.hero.p2}</p>
              <div className="acts">
                <a className="btn p" href={waLink(c.hero.waText)} target="_blank" rel="noopener noreferrer">
                  {c.hero.ctaPrimary}
                </a>
                <Link className="btn" href="#offres">
                  {c.hero.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="mark">
              <Image src="/logo.png" alt={c.alt.mark} width={480} height={480} priority />
            </div>
          </div>
        </div>

        <Stats stats={c.stats} lang={lang} />

        <section>
          <div className="w">
            <h2>{c.fixes.heading}</h2>
            <p className="lead">{c.fixes.lead}</p>
            {c.fixes.rows.map((r) => (
              <RevealDiv className="row two" key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </RevealDiv>
            ))}
          </div>
        </section>

        <section className="alt">
          <div className="w">
            <h2>{c.sectors.heading}</h2>
            <p className="lead">{c.sectors.lead}</p>
            {c.sectors.items.map((s) => (
              <RevealDiv className="row two" key={s.slug}>
                <h3>
                  <Link href={`/${s.slug}/`}>{s.name}</Link>
                </h3>
                <p>{s.blurb}</p>
              </RevealDiv>
            ))}
          </div>
        </section>

        <section id="offres">
          <div className="w">
            <h2>{c.offers.heading}</h2>
            <p className="lead">{c.offers.lead}</p>
            {c.offers.rows.map((r) => (
              <RevealDiv className="row" key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="price">{r.price}</span>
              </RevealDiv>
            ))}
            <p className="note">{c.offers.note}</p>
          </div>
        </section>

        <section id="references" className="alt">
          <div className="w">
            <h2>{c.references.heading}</h2>
            <p className="lead">{c.references.lead}</p>
            {c.references.rows.map((r) => (
              <RevealDiv className="row" key={r.title}>
                <h3>
                  {r.title}
                  {r.source && <span className="src">{r.source}</span>}
                </h3>
                <p>{r.body}</p>
                {r.linkHref && (
                  <a href={r.linkHref} target="_blank" rel="noopener noreferrer">
                    {r.linkLabel}
                  </a>
                )}
              </RevealDiv>
            ))}
          </div>
        </section>

        <section id="methode">
          <div className="w">
            <h2>{c.method.heading}</h2>
            <ol className="steps">
              {c.method.steps.map((s) => (
                <RevealLi key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </RevealLi>
              ))}
            </ol>
            <RevealDiv className="guard">
              <h3>{c.method.guardTitle}</h3>
              <p>{c.method.guardBody}</p>
            </RevealDiv>
          </div>
        </section>

        <section id="faq" className="alt">
          <div className="w">
            <h2>{c.faq.heading}</h2>
            {c.faq.items.map((item) => (
              <RevealDetails key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </RevealDetails>
            ))}
          </div>
        </section>

        <section id="diagnostic">
          <div className="w">
            <h2>{c.diagnostic.heading}</h2>
            <p className="lead">{c.diagnostic.lead}</p>
            <DiagnosticForm content={c.diagnostic} lang={lang} />
          </div>
        </section>

        <section id="contact" className="cta">
          <div className="w">
            <h2>{c.cta.heading}</h2>
            <p>{c.cta.body}</p>
            <div className="acts">
              <a className="btn p" href={waLink(c.cta.waText)} target="_blank" rel="noopener noreferrer">
                {c.cta.waLabel}
              </a>
              <a className="btn" href={mailLink(c.cta.mailSubject)}>
                {c.cta.mailLabel}
              </a>
            </div>
            <p className="ct">
              <span>felicienmukamba.cd@gmail.com</span>
              <span>+243 995 209 133</span>
              <span>{c.cta.address}</span>
            </p>
          </div>
        </section>
      </main>

      <Footer footer={c.footer} />
      <WhatsAppButton />
      <JsonLd data={faqSchema(c.faq.items)} />
    </>
  );
}
