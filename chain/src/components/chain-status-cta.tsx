import { scrollToMailingListSection } from "@/lib/mailing-list-nav";
import { cn } from "@/lib/utils";

const chainStatusCtaClassName = cn(
  "inline-flex items-center justify-center rounded-full px-4 py-1.5 font-display text-xs font-semibold",
  "border border-blue-core/30 bg-blue-core/[0.08] text-foreground/90",
  "transition-[background-color,border-color,color] duration-200",
  "hover:bg-blue-core hover:border-blue-core hover:text-white",
  "dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:bg-blue-core dark:hover:text-white",
);

function scrollToNewsletter() {
  scrollToMailingListSection();
}

export default function ChainStatusCta() {
  return (
    <div className="hero-status">
      <button type="button" className={chainStatusCtaClassName} onClick={scrollToNewsletter}>
        Chain is not live yet, subscribe for updates
      </button>
    </div>
  );
}
