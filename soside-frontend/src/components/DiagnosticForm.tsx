"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import type { HomeContent } from "@/lib/content";
import type { Lang } from "@/lib/site";

const LABELS: Record<Lang, { sector: string; process: string; hours: string }> = {
  fr: { sector: "Secteur", process: "Processus lent", hours: "Heures perdues par semaine" },
  en: { sector: "Sector", process: "Slow process", hours: "Hours lost per week" },
};

export default function DiagnosticForm({
  content,
  lang,
}: {
  content: HomeContent["diagnostic"];
  lang: Lang;
}) {
  const [sector, setSector] = useState(content.sectorOptions[0]);
  const [process, setProcess] = useState("");
  const [hours, setHours] = useState(content.hoursOptions[0]);

  const l = LABELS[lang];
  const message = [
    content.waIntro,
    `${l.sector}: ${sector}`,
    `${l.process}: ${process.trim() || "-"}`,
    `${l.hours}: ${hours}`,
  ].join("\n");

  return (
    <div className="dx">
      <label>
        <span>{content.sectorLabel}</span>
        <select value={sector} onChange={(e) => setSector(e.target.value)}>
          {content.sectorOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label>
        <span>{content.processLabel}</span>
        <input
          type="text"
          maxLength={120}
          autoComplete="off"
          value={process}
          onChange={(e) => setProcess(e.target.value)}
        />
      </label>
      <label>
        <span>{content.hoursLabel}</span>
        <select value={hours} onChange={(e) => setHours(e.target.value)}>
          {content.hoursOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <a className="btn p" href={waLink(message)} target="_blank" rel="noopener noreferrer">
        {content.submit}
      </a>
    </div>
  );
}
