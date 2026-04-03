import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { isDocsPath } from "@/lib/docs-links";
import { cn } from "@/lib/utils";

export const prominentCtaClassName =
  "px-8 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 text-center";
export const highlightedCtaClassName =
  "px-8 py-3 rounded-full border border-blue-core/30 bg-blue-core/10 backdrop-blur-[10px] text-muted-foreground hover:text-foreground font-display font-semibold hover:bg-blue-core/20 hover:border-blue-glow ring-glow transition-all duration-300 text-center dark:border-blue-core/55 dark:bg-blue-core/28 dark:hover:bg-blue-core/42";
export const cardInlineCtaClassName =
  "inline-flex items-center justify-center glass-card !rounded-3xl px-5 py-2 text-center text-sm text-muted-foreground transition-all duration-300 hover:border-blue-glow hover:text-foreground ring-glow font-display font-semibold";

interface CardInlineCtaProps {
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function CardInlineCta({ children, className, href, onClick }: CardInlineCtaProps) {
  const resolvedClassName = cn(cardInlineCtaClassName, className);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={resolvedClassName}>
        {children}
      </a>
    );
  }

  if (isDocsPath(href)) {
    return (
      <a href={href} className={resolvedClassName}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={resolvedClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={resolvedClassName}>
      {children}
    </Link>
  );
}
