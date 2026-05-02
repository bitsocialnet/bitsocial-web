import { useTranslation } from "react-i18next";
import { Github, Lightbulb } from "lucide-react";
import CardInlineCta, { cardInlineCtaClassName } from "@/components/card-inline-cta";

const BITSOCIAL_TOPIC_URL = "https://github.com/topics/bitsocial";

export default function AppsGithubTopicCta() {
  const { t } = useTranslation();

  return (
    <div className="glass-card mb-6 px-4 py-3 md:px-5">
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-core/20 bg-blue-core/[0.07] text-blue-core dark:border-blue-core/35 dark:bg-blue-core/[0.14]"
            aria-hidden="true"
          >
            <Lightbulb className="h-3.5 w-3.5" />
          </span>
          <p>{t("apps.githubTopic.description")}</p>
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
