import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import JsonLd from "./JsonLd";
import { RevealDiv } from "./Reveal";
import { getSector, sectors, type SectorContent } from "@/lib/sectors";
import { content } from "@/lib/content";
import { waLink, mailLink } from "@/lib/site";
import { serviceSchema, videoSchema } from "@/lib/schema";

export default function SectorPage({ slug }: { slug: SectorContent["slug"] }) {
  const sector = getSector(slug);
  if (!sector) notFound();

  const fr = content.fr;
  const others = sectors.filter((s) => s.slug !== slug);

  return (
    <>
      <Header
        homeHref="/"
        nav={fr.nav}
        brandTag={fr.brandTag}
        brandAria={fr.alt.brandAria}
        navAria={fr.alt.navAria}
        logoAlt={fr.alt.logo}
      />

      <main id="top">
        <div className="hero">
          <div className="w hg">
            <div>
              <h1>{sector.h1}</h1>
              <p>{sector.intro}</p>
              <div className="acts">
                <a className="btn p" href={waLink(sector.waText)} target="_blank" rel="noopener noreferrer">
                  Demander un diagnostic
                </a>
                <Link className="btn" href="/#offres">
                  Voir les offres
                </Link>
              </div>
            </div>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption -- decorative product demo, not spoken content */}
            <video
              className="vid"
              src={`/videos/${sector.slug}.mp4`}
              poster={`/videos/${sector.slug}.jpg`}
              muted
              playsInline
              loop
              autoPlay
              controls
              preload="metadata"
              aria-label={sector.h1}
            />
          </div>
        </div>

        <section>
          <div className="w">
            <h2>Ce que nous automatisons</h2>
            {sector.pairs.map((p) => (
              <RevealDiv className="row two" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </RevealDiv>
            ))}
          </div>
        </section>

        <section className="alt">
          <div className="w">
            <h2>Comment ça se passe</h2>
            <p className="lead" style={{ margin: 0 }}>
              Un diagnostic de 60 à 120 minutes cartographie votre processus et classe trois automatisations par
              impact. Vous recevez un rapport de 3 à 7 pages et un plan à 30 jours, puis vous décidez de la suite.
            </p>
          </div>
        </section>

        <section id="contact" className="cta">
          <div className="w">
            <h2>Parlons de votre processus.</h2>
            <p>Décrivez-nous ce qui vous prend le plus de temps. Nous répondons avec une proposition de diagnostic.</p>
            <div className="acts">
              <a className="btn p" href={waLink(sector.waText)} target="_blank" rel="noopener noreferrer">
                Écrire sur WhatsApp
              </a>
              <a className="btn" href={mailLink("Diagnostic Digital & IA")}>
                Envoyer un email
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="w">
            <h2>Autres secteurs</h2>
            <div className="acts">
              {others.map((s) => (
                <Link className="btn" href={`/${s.slug}/`} key={s.slug}>
                  {s.navName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer footer={fr.footer} />
      <WhatsAppButton />
      <JsonLd data={serviceSchema(sector.h1, sector.seoTitle.split("|")[0].trim())} />
      <JsonLd data={videoSchema(sector.h1, sector.seoDescription, sector.slug)} />
    </>
  );
}
