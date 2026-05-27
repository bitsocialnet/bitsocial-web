import { useTranslation } from "react-i18next";
import { Code2, Github } from "lucide-react";
import CardInlineCta, { cardInlineCtaClassName } from "@/components/card-inline-cta";
import { BITSOCIAL_TOPIC_URL, SUBMIT_APP_URL } from "@/lib/apps-urls";

const compactCtaClassName = `${cardInlineCtaClassName} !px-3 !py-1.5 !text-xs`;

/**
 * Mobile-only combined CTA: keeps both developer actions (Submit App, Explore GitHub)
 * in one compact row so neither has to be a full-width block on phones.
 */
export default function AppsDevsCta() {
  const { t } = useTranslation();

  return (
    <div className="glass-card mb-6 px-3 py-2.5 md:hidden">
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex shrink-0 items-center gap-1.5 font-display font-semibold uppercase tracking-[0.16em] text-foreground/55">
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t("apps.devsLabel", { defaultValue: "Devs:" })}</span>
        </span>
        <CardInlineCta href={SUBMIT_APP_URL} className={compactCtaClassName}>
          {t("apps.submitApp")}
        </CardInlineCta>
        <span className="text-muted-foreground/70">{t("apps.or", { defaultValue: "or" })}</span>
        <CardInlineCta href={BITSOCIAL_TOPIC_URL} className={`${compactCtaClassName} gap-1.5`}>
          <Github className="h-3.5 w-3.5" />
          <span>{t("apps.githubTopic.linkShort", { defaultValue: "Explore GitHub" })}</span>
        </CardInlineCta>
      </div>
    </div>
  );
}
