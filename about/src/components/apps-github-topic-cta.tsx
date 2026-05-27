import { useTranslation } from "react-i18next";
import { Github, Lightbulb } from "lucide-react";
import CardInlineCta, { cardInlineCtaClassName } from "@/components/card-inline-cta";
import { BITSOCIAL_TOPIC_URL } from "@/lib/apps-urls";

/** Desktop-only context card explaining the GitHub topic with the lightbulb + description. */
export default function AppsGithubTopicCta() {
  const { t } = useTranslation();

  return (
    <div className="glass-card mb-6 hidden px-4 py-3 md:block md:px-5">
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-core/20 bg-blue-core/[0.07] text-blue-core dark:border-blue-core/35 dark:bg-blue-core/[0.14]"
            aria-hidden="true"
          >
            <Lightbulb className="h-3.5 w-3.5" />
          </span>
          <p className="min-w-0">{t("apps.githubTopic.description")}</p>
        </div>

        <CardInlineCta
          href={BITSOCIAL_TOPIC_URL}
          className={`apps-frosted-cta ${cardInlineCtaClassName} gap-2 !rounded-full !px-4 !py-2 text-sm md:shrink-0`}
        >
          <Github className="h-4 w-4" />
          <span>{t("apps.githubTopic.link")}</span>
        </CardInlineCta>
      </div>
    </div>
  );
}
