import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { isDocsPath } from "@/lib/docs-links";
import { cn } from "@/lib/utils";

export const prominentCtaClassName =
  "inline-flex items-center justify-center px-8 py-3 rounded-full glass-card text-foreground/82 hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow cta-glow text-center";
export const highlightedCtaClassName =
  "inline-flex items-center justify-center px-8 py-3 rounded-full border border-blue-core/30 bg-blue-core/[0.08] backdrop-blur-[10px] text-foreground/90 hover:text-foreground font-display font-semibold hover:bg-blue-core/[0.14] hover:border-blue-glow ring-glow cta-glow text-center dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:bg-blue-core/[0.24]";
export const cardInlineCtaClassName =
  "inline-flex items-center justify-center glass-card !rounded-3xl px-5 py-2 text-center text-sm text-foreground/82 hover:border-blue-glow hover:text-foreground ring-glow cta-glow font-display font-semibold";

interface CardInlineCtaProps {
  "aria-describedby"?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function CardInlineCta({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  children,
  className,
  href,
  onClick,
}: CardInlineCtaProps) {
  const resolvedClassName = cn(className ?? cardInlineCtaClassName);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={resolvedClassName}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (isDocsPath(href)) {
    return (
      <a
        href={href}
        className={resolvedClassName}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/api/")) {
    return (
      <a
        href={href}
        className={resolvedClassName}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={resolvedClassName}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className={resolvedClassName}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
