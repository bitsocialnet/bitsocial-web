import { triggerFeatureGlow } from "@/lib/utils";

const MAILING_LIST_SECTION_ID = "mailing-list";

/** Scrolls to the mailing list and applies the same temporary border glow as on bitsocial.net/about. */
export function scrollToMailingListSection() {
  triggerFeatureGlow(MAILING_LIST_SECTION_ID);
}
