"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Tracks whether the element is in view (or already visible for
 * prefers-reduced-motion users) and returns a ref to attach plus the
 * "visible" flag. Fires once, then disconnects.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, className: `reveal${visible ? " in" : ""}` };
}

interface RevealProps {
  className?: string;
  children: ReactNode;
}

/** Reveal-on-scroll wrapper for a <div> (rows, the guardrails box, …). */
export function RevealDiv({ className = "", children }: RevealProps) {
  const { ref, className: rc } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`${rc} ${className}`.trim()}>
      {children}
    </div>
  );
}

/** Reveal-on-scroll wrapper for a numbered <li> (the method steps). */
export function RevealLi({ className = "", children }: RevealProps) {
  const { ref, className: rc } = useInView<HTMLLIElement>();
  return (
    <li ref={ref} className={`${rc} ${className}`.trim()}>
      {children}
    </li>
  );
}

/** Reveal-on-scroll wrapper for a <details> (the FAQ), keeps native toggle semantics. */
export function RevealDetails({ className = "", children }: RevealProps) {
  const { ref, className: rc } = useInView<HTMLDetailsElement>();
  return (
    <details ref={ref} className={`${rc} ${className}`.trim()}>
      {children}
    </details>
  );
}
