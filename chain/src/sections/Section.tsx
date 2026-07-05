import type { ReactNode } from "react";
import { useReveal } from "../lib/useReveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  question: ReactNode;
  supporting: ReactNode;
  children: ReactNode;
  quote?: string;
};

// The shared section rhythm, mirroring bitsocial.net: an eyebrow label, one big
// question headline, a supporting line, a bespoke artifact, and a quiet quote.
export default function Section({
  id,
  eyebrow,
  question,
  supporting,
  children,
  quote,
}: SectionProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={`section${revealed ? " is-visible" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="section-inner">
        <p className="section-eyebrow reveal">
          <a href={`#${id}`}>{eyebrow}</a>
        </p>
        <h2 id={`${id}-title`} className="section-title reveal">
          {question}
        </h2>
        <p className="section-supporting reveal">{supporting}</p>
        <div className="section-artifact reveal">{children}</div>
        {quote ? <p className="section-quote reveal">{quote}</p> : null}
      </div>
    </section>
  );
}
