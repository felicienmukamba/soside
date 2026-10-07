"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/content";
import type { Lang } from "@/lib/site";

function format(n: number, suffix: string, lang: Lang) {
  const locale = lang === "en" ? "en-US" : "fr-FR";
  const formatted = Math.round(n).toLocaleString(locale);
  if (suffix === "%") return lang === "en" ? `${formatted}%` : `${formatted} %`;
  return `${formatted}${suffix}`;
}

export default function Stats({ stats, lang }: { stats: Stat[]; lang: Lang }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  // 1 = final values. This is also what the server-rendered (pre-hydration)
  // HTML shows, so crawlers and no-JS visitors always see the real numbers.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    setProgress(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1200, 1);
            setProgress(1 - Math.pow(1 - p, 3));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="stats" ref={sectionRef}>
      <div className="w">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <b>{format(s.value * progress, s.suffix, lang)}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
