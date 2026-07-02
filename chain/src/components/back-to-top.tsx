import { ArrowUp } from "lucide-react";
import type { MouseEvent } from "react";
import { getScrollBehavior } from "@/lib/utils";

const highlightedCtaClassName =
  "inline-flex items-center justify-center px-8 py-3 rounded-full border border-blue-core/30 bg-blue-core/[0.08] backdrop-blur-[10px] text-foreground/90 hover:text-foreground font-display font-semibold hover:bg-blue-core/[0.14] hover:border-blue-glow ring-glow cta-glow text-center dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24]";

function scrollToTop(event: MouseEvent<HTMLButtonElement>) {
  window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
  if (event.detail > 0) {
    event.currentTarget.blur();
  }
}

export default function BackToTop() {
  return (
    <div className="js-only px-6">
      <div className="mx-auto flex max-w-7xl justify-end">
        <button type="button" onClick={scrollToTop} className={`${highlightedCtaClassName} gap-2`}>
          Back to top
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
