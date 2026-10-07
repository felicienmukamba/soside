export interface SectorPair {
  title: string;
  body: string;
}

export interface SectorContent {
  slug: "pme" | "ong" | "ecoles" | "cliniques";
  navName: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  pairs: SectorPair[];
  waText: string;
}

// Sector pages are French-only for now (they were not part of the bilingual
// scope). Adding English versions later just means adding a `lang` axis
// here and a matching route under app/(en)/en/[slug]/.
export const sectors: SectorContent[] = [
  {
    slug: "pme",
    navName: "PME et commerces",
    seoTitle: "Automatisation PME à Bukavu : stocks, factures | SOSIDE",
    seoDescription:
      "Automatisez le suivi des stocks, les factures et les rapports de vente de votre PME à Bukavu. Diagnostic digital et IA en 60 à 120 minutes.",
    h1: "Automatisez les stocks, les factures et les ventes de votre PME à Bukavu",
    intro:
      "Vos équipes recopient encore les ventes, refont les factures et suivent les stocks sur Excel. SOSIDE relie ces tâches dans un système simple : alertes de stock, factures générées et rapport hebdomadaire prêt sans effort.",
    pairs: [
      { title: "Stocks suivis sur Excel", body: "Alertes automatiques quand un produit passe sous son seuil." },
      { title: "Factures refaites à la main", body: "Factures générées à partir des ventes déjà enregistrées." },
      { title: "Ventes recopiées chaque soir", body: "Une saisie unique, puis un rapport envoyé chaque semaine." },
    ],
    waText: "Bonjour SOSIDE, je souhaite un diagnostic pour mon entreprise.",
  },
  {
    slug: "ong",
    navName: "ONG et projets financés",
    seoTitle: "Rapports bailleurs et suivi de terrain pour ONG | SOSIDE",
    seoDescription:
      "Automatisez les rapports bailleurs, la collecte de données de terrain et le suivi des projets de votre ONG au Sud-Kivu. Diagnostic digital dès 100 $.",
    h1: "Des rapports bailleurs sans ressaisie pour votre ONG au Sud-Kivu",
    intro:
      "Les données de terrain arrivent dans plusieurs fichiers, puis sont recopiées pour chaque rapport bailleur. SOSIDE centralise la collecte, le suivi des activités et la production des rapports, avec des accès par rôle.",
    pairs: [
      { title: "Rapports bailleurs refaits", body: "Un rapport généré à partir des données du projet." },
      { title: "Données de terrain recopiées", body: "Une collecte centralisée, sans ressaisie." },
      { title: "Suivi dans cinq fichiers", body: "Un tableau de bord unique par projet." },
    ],
    waText: "Bonjour SOSIDE, je souhaite un diagnostic pour mon ONG.",
  },
  {
    slug: "ecoles",
    navName: "Écoles",
    seoTitle: "Gestion scolaire à Bukavu : frais, bulletins | SOSIDE",
    seoDescription:
      "Numérisez les frais scolaires, les bulletins et les relances de parents de votre école à Bukavu. Référence : 8 écoles numérisées avec GEVAPOM.",
    h1: "Frais scolaires, bulletins et relances : numérisez votre école à Bukavu",
    intro:
      "Frais suivis sur papier, bulletins saisis à la main, parents relancés un par un : le temps administratif s’accumule. SOSIDE numérise ces processus, comme dans les 8 écoles accompagnées avec GEVAPOM, où le temps administratif a baissé de 60 %.",
    pairs: [
      { title: "Frais scolaires sur papier", body: "Suivi des paiements et rappels automatiques." },
      { title: "Bulletins saisis à la main", body: "Notes saisies une fois, bulletins générés." },
      { title: "Parents relancés un par un", body: "Messages de rappel envoyés en série." },
    ],
    waText: "Bonjour SOSIDE, je souhaite un diagnostic pour mon école.",
  },
  {
    slug: "cliniques",
    navName: "Cliniques et centres de santé",
    seoTitle: "Logiciel pour cliniques à Bukavu : dossier patient | SOSIDE",
    seoDescription:
      "Dossier patient unique, rendez-vous et facturation automatique pour les cliniques et centres de santé de Bukavu. Accès contrôlés et journal d’audit.",
    h1: "Dossiers patients, rendez-vous et facturation pour les cliniques de Bukavu",
    intro:
      "Dossiers sur papier, rendez-vous notés à la main, facturation refaite en fin de mois. SOSIDE met en place un dossier patient unique et une facturation automatique, avec contrôle des accès et journal d’audit. Notre fondateur a dirigé la conception de HMS Elite, un système hospitalier interopérable HL7 / FHIR.",
    pairs: [
      { title: "Dossiers patients sur papier", body: "Un dossier patient unique et sécurisé." },
      { title: "Rendez-vous notés à la main", body: "Un agenda partagé avec rappels." },
      { title: "Facturation refaite en fin de mois", body: "Une facture générée à chaque consultation." },
    ],
    waText: "Bonjour SOSIDE, je souhaite un diagnostic pour ma clinique.",
  },
];

export function getSector(slug: string): SectorContent | undefined {
  return sectors.find((s) => s.slug === slug);
}
