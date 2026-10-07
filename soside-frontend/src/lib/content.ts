import type { Lang } from "./site";

export interface Row {
  title: string;
  body: string;
}
export interface PricedRow extends Row {
  price: string;
}
export interface RefRow extends Row {
  source?: string;
  linkLabel?: string;
  linkHref?: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface Stat {
  value: number;
  suffix: string;
  label: string;
}
export interface SectorLink {
  slug: string;
  name: string;
  blurb: string;
}

export interface HomeContent {
  seo: { title: string; description: string };
  nav: {
    offers: string;
    references: string;
    method: string;
    faq: string;
    contact: string;
  };
  brandTag: string;
  hero: {
    h1: string;
    p1: string;
    p2: string;
    ctaPrimary: string;
    ctaSecondary: string;
    waText: string;
  };
  stats: Stat[];
  fixes: { heading: string; lead: string; rows: Row[] };
  sectors: { heading: string; lead: string; items: SectorLink[] };
  offers: { heading: string; lead: string; rows: PricedRow[]; note: string };
  references: { heading: string; lead: string; rows: RefRow[] };
  method: {
    heading: string;
    steps: Row[];
    guardTitle: string;
    guardBody: string;
  };
  faq: { heading: string; items: Faq[] };
  diagnostic: {
    heading: string;
    lead: string;
    sectorLabel: string;
    sectorOptions: string[];
    processLabel: string;
    hoursLabel: string;
    hoursOptions: string[];
    submit: string;
    waIntro: string;
  };
  cta: {
    heading: string;
    body: string;
    waLabel: string;
    mailLabel: string;
    waText: string;
    mailSubject: string;
    address: string;
  };
  footer: { copyright: string; founder: string };
  alt: {
    logo: string;
    mark: string;
    brandAria: string;
    navAria: string;
  };
}

export const content: Record<Lang, HomeContent> = {
  fr: {
    seo: {
      title: "SOSIDE : automatisation et IA à Bukavu, RDC",
      description:
        "SOSIDE automatise vos rapports, stocks et factures et intègre l’IA sans complexité. Logiciels sur mesure pour PME, ONG, écoles et cliniques à Bukavu, RDC.",
    },
    nav: {
      offers: "Offres",
      references: "Références",
      method: "Méthode",
      faq: "FAQ",
      contact: "Contact",
    },
    brandTag: "Solution Side with AI",
    hero: {
      h1: "Automatisez vos opérations. Intégrez l’IA sans complexité inutile.",
      p1: "SOSIDE conçoit des logiciels, des automatisations et des assistants IA pour les entreprises, ONG, écoles et structures de santé. Basés à Bukavu, nous travaillons partout en RDC et à distance.",
      p2: "Solution Side with AI : nous nous plaçons du côté de la solution, pas de la technologie pour la technologie.",
      ctaPrimary: "Demander un diagnostic",
      ctaSecondary: "Voir les offres",
      waText: "Bonjour SOSIDE, je souhaite un diagnostic digital et IA.",
    },
    stats: [
      { value: 10000, suffix: "+", label: "utilisateurs sur le portail citoyen (PGCC)" },
      { value: 8, suffix: "", label: "écoles numérisées (GEVAPOM)" },
      { value: 60, suffix: "%", label: "de temps administratif en moins dans ces écoles" },
      { value: 40, suffix: "%", label: "de délais de mise en marché en moins sur les plateformes B2B" },
    ],
    fixes: {
      heading: "Ce que nous réglons",
      lead: "Le client achète un résultat : moins de travail manuel, une meilleure visibilité, de meilleures décisions.",
      rows: [
        {
          title: "Automatiser",
          body: "Rapports refaits chaque semaine, données recopiées d’un fichier à l’autre, relances oubliées. Nous les transformons en flux qui tournent seuls.",
        },
        {
          title: "Intégrer",
          body: "Vos outils, vos documents et l’IA reliés dans un même système : recherche documentaire, extraction de données, réponses assistées.",
        },
        {
          title: "Transformer",
          body: "Pour les organisations prêtes à aller plus loin : choix des cas d’usage, gouvernance, formation et mesure des résultats.",
        },
      ],
    },
    sectors: {
      heading: "Des solutions par secteur",
      lead: "Choisissez votre secteur pour voir ce que nous automatisons en priorité.",
      items: [
        { slug: "pme", name: "PME et commerces", blurb: "Stocks, factures et ventes sans ressaisie." },
        { slug: "ong", name: "ONG et projets financés", blurb: "Rapports bailleurs et suivi de terrain sans ressaisie." },
        { slug: "ecoles", name: "Écoles", blurb: "Frais scolaires, bulletins et relances numérisés." },
        { slug: "cliniques", name: "Cliniques et centres de santé", blurb: "Dossier patient, rendez-vous et facturation." },
      ],
    },
    offers: {
      heading: "Cinq offres, du premier diagnostic au programme complet",
      lead: "Commencez petit : le diagnostic vous montre où vous perdez du temps avant tout engagement plus large.",
      rows: [
        {
          title: "Diagnostic Digital & IA",
          body: "En 60 à 120 minutes, nous cartographions un processus, estimons le temps perdu et classons trois automatisations par impact. Vous recevez un rapport de 3 à 7 pages et un plan à 30 jours.",
          price: "Dès 100 $",
        },
        {
          title: "Automatisation express",
          body: "Un périmètre fermé, un délai court, un critère d’acceptation clair. Exemple : votre rapport hebdomadaire automatisé en moins de 7 jours.",
          price: "Dès 500 $",
        },
        {
          title: "Systèmes métiers",
          body: "Applications web sur mesure : RH, stocks, ventes, projets, finances, rendez-vous, gestion documentaire.",
          price: "Dès 2 000 $",
        },
        {
          title: "Abonnement maintenance",
          body: "Après la livraison : sauvegardes, supervision, support, hébergement et petites évolutions, avec un niveau de service écrit.",
          price: "Dès 50 $/mois",
        },
        {
          title: "Transformation IA",
          body: "Audit, cas d’usage, gouvernance, formation, intégration et mesure des résultats. Validation humaine et confidentialité incluses.",
          price: "Sur devis",
        },
      ],
      note: "Tarifs indicatifs, confirmés par un devis après le diagnostic.",
    },
    references: {
      heading: "Des systèmes critiques déjà en production",
      lead: "Réalisations menées par notre fondateur, Félicien Mukamba : 3 plateformes B2B livrées avec 100 % d’adoption chez les clients de lancement, et des délais de mise en marché réduits de 40 %.",
      rows: [
        {
          title: "PGCC, portail des citoyens congolais",
          body: "Identité numérique et services publics sécurisés : chiffrement AES-256-GCM, réponses sous 200 ms, plus de 10 000 utilisateurs.",
          linkLabel: "Voir la démo",
          linkHref: "https://www.youtube.com/watch?v=zPOI5yNTQFs",
        },
        {
          title: "HMS Elite, système hospitalier",
          source: "Aumsoft Technology",
          body: "Un dossier patient unique, de l’admission à la facturation, interopérable HL7 / FHIR.",
          linkLabel: "Voir le site",
          linkHref: "https://hms.aumsoft.net/",
        },
        {
          title: "UMS, gestion universitaire",
          source: "Aumsoft Technology",
          body: "Plus de 5 établissements sur une même plateforme, 100 % d’isolation des données, plus de 50 modules.",
          linkLabel: "Voir le site",
          linkHref: "https://umsaap.com",
        },
        {
          title: "Maago, marketplace et caisse hors ligne",
          source: "Aumsoft Technology",
          body: "Une caisse qui continue de vendre sans réseau, en USD, CDF et EUR, avec M-Pesa, Orange Money et Airtel Money.",
          linkLabel: "Voir le site",
          linkHref: "https://maago.aumsoft.net/marketplace-bientot",
        },
        {
          title: "GEVAPOM, 8 écoles numérisées",
          body: "100 % des processus administratifs numérisés, 60 % de temps administratif en moins, plus de 50 enseignants formés.",
        },
      ],
    },
    method: {
      heading: "Comment nous travaillons",
      steps: [
        { title: "Diagnostic", body: "Nous cartographions le processus et chiffrons le temps perdu." },
        { title: "Proposition", body: "Trois automatisations classées par impact, un plan à 30 jours, un devis." },
        {
          title: "Livraison",
          body: "Périmètre fermé, recette avec vous, mise en production. Toute demande hors périmètre est chiffrée à part.",
        },
        { title: "Suivi", body: "Maintenance, support et évolutions selon un niveau de service écrit." },
      ],
      guardTitle: "L’IA avec garde-fous",
      guardBody:
        "Chaque assistant a un périmètre défini. Nous prévoyons la validation humaine quand elle est nécessaire, le contrôle des accès, la journalisation et la protection des données. Les données sensibles font l’objet d’une analyse juridique et technique avant toute intégration.",
    },
    faq: {
      heading: "Questions fréquentes",
      items: [
        {
          q: "Que contient le diagnostic ?",
          a: "Une cartographie du processus actuel, les tâches répétitives repérées, une estimation des gains, trois automatisations classées par impact et un plan à 30 jours. Le devis est optionnel.",
        },
        {
          q: "Combien de temps faut-il pour une automatisation ?",
          a: "Le périmètre est fermé et le délai court. Par exemple, un rapport hebdomadaire automatisé en moins de 7 jours.",
        },
        {
          q: "Travaillez-vous en dehors de Bukavu ?",
          a: "Oui. Nous sommes basés à Bukavu et travaillons à distance avec des organisations de RDC et de l’espace francophone.",
        },
        {
          q: "Que devient mon logiciel après la livraison ?",
          a: "Vous pouvez souscrire un abonnement : sauvegardes, supervision, support, hébergement et petites évolutions, avec un temps de réponse défini par écrit.",
        },
      ],
    },
    diagnostic: {
      heading: "Votre diagnostic express",
      lead: "Répondez à trois questions. Elles nous arrivent sur WhatsApp et nous répondons avec une première analyse.",
      sectorLabel: "Votre secteur",
      sectorOptions: ["PME ou commerce", "ONG ou projet financé", "École", "Clinique ou centre de santé", "Autre"],
      processLabel: "Quel processus est lent ou manuel ?",
      hoursLabel: "Heures perdues par semaine (estimation)",
      hoursOptions: ["1–5", "5–10", "10–20", "Plus de 20"],
      submit: "Envoyer sur WhatsApp",
      waIntro: "Bonjour SOSIDE, je souhaite un diagnostic express.",
    },
    cta: {
      heading: "Parlons du premier processus à automatiser.",
      body: "Décrivez-nous ce qui vous prend le plus de temps. Nous vous répondons avec une proposition de diagnostic.",
      waLabel: "Écrire sur WhatsApp",
      mailLabel: "Envoyer un email",
      waText: "Bonjour SOSIDE, je souhaite un diagnostic digital et IA.",
      mailSubject: "Diagnostic Digital & IA",
      address: "Bukavu, Sud-Kivu, République démocratique du Congo",
    },
    footer: {
      copyright: "© 2026 SOSIDE, Solution Side with AI. Bukavu, RDC.",
      founder: "Le fondateur",
    },
    alt: {
      logo: "Logo SOSIDE : un S formé de lignes noires entrelacées sur fond vert",
      mark: "Symbole SOSIDE : un S formé de lignes noires entrelacées",
      brandAria: "SOSIDE, accueil",
      navAria: "Navigation principale",
    },
  },
  en: {
    seo: {
      title: "SOSIDE: automation and AI in Bukavu, DR Congo",
      description:
        "SOSIDE automates your reports, inventory and billing and adds AI without complexity. Custom software for SMEs, NGOs, schools and clinics in Bukavu, DR Congo.",
    },
    nav: {
      offers: "Offers",
      references: "References",
      method: "Method",
      faq: "FAQ",
      contact: "Contact",
    },
    brandTag: "Solution Side with AI",
    hero: {
      h1: "Automate your operations. Add AI without unnecessary complexity.",
      p1: "SOSIDE builds software, automations and AI assistants for businesses, NGOs, schools and health organizations. Based in Bukavu, we work across DR Congo and remotely.",
      p2: "Solution Side with AI: we stand on the side of the solution, not technology for its own sake.",
      ctaPrimary: "Request a diagnostic",
      ctaSecondary: "See our offers",
      waText: "Hello SOSIDE, I would like a digital and AI diagnostic.",
    },
    stats: [
      { value: 10000, suffix: "+", label: "users on the citizen portal (PGCC)" },
      { value: 8, suffix: "", label: "schools digitized (GEVAPOM)" },
      { value: 60, suffix: "%", label: "less administrative time in those schools" },
      { value: 40, suffix: "%", label: "shorter time-to-market on B2B platforms" },
    ],
    fixes: {
      heading: "What we fix",
      lead: "Clients buy a result: less manual work, better visibility, better decisions.",
      rows: [
        {
          title: "Automate",
          body: "Reports rebuilt every week, data retyped from one file to another, forgotten follow-ups. We turn them into workflows that run on their own.",
        },
        {
          title: "Integrate",
          body: "Your tools, your documents and AI connected in one system: document search, data extraction, assisted replies.",
        },
        {
          title: "Transform",
          body: "For organizations ready to go further: choosing use cases, governance, training and measuring results.",
        },
      ],
    },
    sectors: {
      heading: "Solutions by sector",
      lead: "Choose your sector to see what we automate first.",
      items: [
        { slug: "pme", name: "SMEs and shops", blurb: "Inventory, invoices and sales without retyping." },
        { slug: "ong", name: "NGOs and funded projects", blurb: "Funder reports and field tracking without retyping." },
        { slug: "ecoles", name: "Schools", blurb: "School fees, report cards and reminders digitized." },
        { slug: "cliniques", name: "Clinics and health centers", blurb: "Patient records, appointments and billing." },
      ],
    },
    offers: {
      heading: "Five offers, from first diagnostic to full program",
      lead: "Start small: the diagnostic shows you where you lose time before any wider commitment.",
      rows: [
        {
          title: "Digital & AI Diagnostic",
          body: "In 60 to 120 minutes, we map a process, estimate the time lost and rank three automations by impact. You receive a 3–7 page report and a 30-day plan.",
          price: "From $100",
        },
        {
          title: "Express automation",
          body: "A closed scope, a short timeline, a clear acceptance criterion. Example: your weekly report automated in under 7 days.",
          price: "From $500",
        },
        {
          title: "Business systems",
          body: "Custom web applications: HR, inventory, sales, projects, finance, appointments, document management.",
          price: "From $2,000",
        },
        {
          title: "Maintenance subscription",
          body: "After delivery: backups, monitoring, support, hosting and small improvements, with a written service level.",
          price: "From $50/month",
        },
        {
          title: "AI transformation",
          body: "Audit, use cases, governance, training, integration and measurement of results. Human review and confidentiality included.",
          price: "Quote on request",
        },
      ],
      note: "Indicative prices, confirmed by a quote after the diagnostic.",
    },
    references: {
      heading: "Critical systems already in production",
      lead: "Work led by our founder, Félicien Mukamba: 3 B2B platforms delivered with 100% adoption among launch clients, and time-to-market cut by 40%.",
      rows: [
        {
          title: "PGCC, Congolese citizen portal",
          body: "Digital identity and secure public services: AES-256-GCM encryption, responses under 200 ms, more than 10,000 users.",
          linkLabel: "Watch the demo",
          linkHref: "https://www.youtube.com/watch?v=zPOI5yNTQFs",
        },
        {
          title: "HMS Elite, hospital system",
          source: "Aumsoft Technology",
          body: "One patient record, from admission to billing, interoperable via HL7 / FHIR.",
          linkLabel: "Visit the site",
          linkHref: "https://hms.aumsoft.net/",
        },
        {
          title: "UMS, university management",
          source: "Aumsoft Technology",
          body: "More than 5 institutions on one platform, 100% data isolation, more than 50 modules.",
          linkLabel: "Visit the site",
          linkHref: "https://umsaap.com",
        },
        {
          title: "Maago, marketplace and offline point of sale",
          source: "Aumsoft Technology",
          body: "A point of sale that keeps selling without a network, in USD, CDF and EUR, with M-Pesa, Orange Money and Airtel Money.",
          linkLabel: "Visit the site",
          linkHref: "https://maago.aumsoft.net/marketplace-bientot",
        },
        {
          title: "GEVAPOM, 8 schools digitized",
          body: "100% of administrative processes digitized, 60% less administrative time, more than 50 teachers trained.",
        },
      ],
    },
    method: {
      heading: "How we work",
      steps: [
        { title: "Diagnostic", body: "We map the process and quantify the time lost." },
        { title: "Proposal", body: "Three automations ranked by impact, a 30-day plan, a quote." },
        {
          title: "Delivery",
          body: "Closed scope, acceptance testing with you, go-live. Anything outside the scope is quoted separately.",
        },
        { title: "Support", body: "Maintenance, support and improvements under a written service level." },
      ],
      guardTitle: "AI with guardrails",
      guardBody:
        "Each assistant has a defined scope. We provide human review where needed, access control, logging and data protection. Sensitive data goes through a legal and technical analysis before any integration.",
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          q: "What does the diagnostic include?",
          a: "A map of the current process, the repetitive tasks found, an estimate of the gains, three automations ranked by impact and a 30-day plan. The quote is optional.",
        },
        {
          q: "How long does an automation take?",
          a: "The scope is closed and the timeline short. For example, a weekly report automated in under 7 days.",
        },
        {
          q: "Do you work outside Bukavu?",
          a: "Yes. We are based in Bukavu and work remotely with organizations in DR Congo and the French-speaking world.",
        },
        {
          q: "What happens to my software after delivery?",
          a: "You can take a subscription: backups, monitoring, support, hosting and small improvements, with a response time defined in writing.",
        },
      ],
    },
    diagnostic: {
      heading: "Your express diagnostic",
      lead: "Answer three questions. They reach us on WhatsApp and we reply with a first analysis.",
      sectorLabel: "Your sector",
      sectorOptions: ["SME or business", "NGO or funded project", "School", "Clinic or health center", "Other"],
      processLabel: "Which process is slow or manual?",
      hoursLabel: "Hours lost per week (estimate)",
      hoursOptions: ["1–5", "5–10", "10–20", "More than 20"],
      submit: "Send on WhatsApp",
      waIntro: "Hello SOSIDE, I would like an express diagnostic.",
    },
    cta: {
      heading: "Let’s talk about the first process to automate.",
      body: "Tell us what takes up the most of your time. We reply with a diagnostic proposal.",
      waLabel: "Write on WhatsApp",
      mailLabel: "Send an email",
      waText: "Hello SOSIDE, I would like a digital and AI diagnostic.",
      mailSubject: "Digital & AI Diagnostic",
      address: "Bukavu, South Kivu, Democratic Republic of the Congo",
    },
    footer: {
      copyright: "© 2026 SOSIDE, Solution Side with AI. Bukavu, DR Congo.",
      founder: "The founder",
    },
    alt: {
      logo: "SOSIDE logo: an S made of interlocking black lines on a green background",
      mark: "SOSIDE symbol: an S made of interlocking black lines",
      brandAria: "SOSIDE, home",
      navAria: "Main navigation",
    },
  },
};
