import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "@/rich-list/primitives";

/** A text link to another site, marked with the arrow the topbar and chart use for the same. */
export default function OutboundLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ExternalLink href={href} className={cn("rl-link nm-outbound", className)}>
      {children}
      <ArrowUpRight aria-hidden size={12} strokeWidth={2} className="rtl:-scale-x-100" />
    </ExternalLink>
  );
}
