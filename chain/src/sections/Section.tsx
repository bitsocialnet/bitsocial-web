import type { ReactNode } from "react";
import { getSectionEyebrow, type SectionId } from "@/lib/faq";
import { useReveal } from "../lib/useReveal";

type SectionFrameProps = {
  id: string;
  className?: string;
  eyebrow: string;
  title: ReactNode;
  supporting: ReactNode;
  children: ReactNode;
  quote?: string;
};

// The shared section rhythm, mirroring bitsocial.net: an eyebrow label, one big
// headline, a supporting line, a bespoke artifact, and a quiet quote.
export function SectionFrame({
  id,
  className,
  eyebrow,
  title,
  supporting,
  children,
  quote,
}: SectionFrameProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={`section${className ? ` ${className}` : ""}${revealed ? " is-visible" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="section-inner">
        <p className="section-eyebrow reveal">
          <a href={`#${id}`}>{eyebrow}</a>
        </p>
        <h2 id={`${id}-title`} className="section-title reveal">
          {title}
        </h2>
        <p className="section-supporting reveal">{supporting}</p>
        <div className="section-artifact reveal">{children}</div>
        {quote ? <p className="section-quote reveal">{quote}</p> : null}
      </div>
    </section>
  );
}

type SectionProps = Omit<SectionFrameProps, "id" | "className" | "eyebrow"> & { id: SectionId };

/** A page section that answers one FAQ question. Its eyebrow comes from the FAQ list. */
export default function Section({ id, ...props }: SectionProps) {
  return <SectionFrame id={id} eyebrow={getSectionEyebrow(id)} {...props} />;
}
