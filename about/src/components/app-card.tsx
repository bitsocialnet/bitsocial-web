import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download, Github, Globe, Monitor, Smartphone } from "lucide-react";
import AppLogo from "@/components/app-logo";
import AppTagPill from "@/components/app-tag-pill";
import CardInlineCta, {
  cardInlineCtaClassName,
  highlightedCtaClassName,
} from "@/components/card-inline-cta";
import {
  PLATFORM_META,
  type AppCategorySlug,
  type AppData,
  type AppLink,
  type AppPlatformSlug,
  getAppPlatforms,
  getCategoryBySlug,
  getGithubUrl,
  getMirrorLinks,
  getPrimaryLinks,
  tagsMatchFilter,
} from "@/lib/apps-data";
import { cn } from "@/lib/utils";

interface AppCardProps {
  activeCategory?: AppCategorySlug | null;
  activePlatform?: AppPlatformSlug | null;
  activeTag?: string | null;
  app: AppData;
  compact?: boolean;
  onCategorySelect?: (slug: AppCategorySlug) => void;
  onPlatformSelect?: (platform: AppPlatformSlug) => void;
  onTagSelect?: (tag: string) => void;
  preferredPlatform?: AppPlatformSlug | null;
}

export default function AppCard({
  activeCategory = null,
  activePlatform = null,
  activeTag = null,
  app,
  onCategorySelect,
  onPlatformSelect,
  onTagSelect,
  preferredPlatform = null,
  compact = false,
}: AppCardProps) {
  const { t } = useTranslation();
  const category = getCategoryBySlug(app.category);
  const mirrors = getMirrorLinks(app);
  const platformTags = getAppPlatforms(app);
  const primaryLinks = getPrimaryLinks(app, preferredPlatform ?? undefined);
  const primaryActionLink = primaryLinks[0];
  const quickLinks = primaryLinks.slice(1, compact ? 3 : app.featured ? 5 : 4);
  const sourceUrl = getGithubUrl(app);

  return (
    <article
      className={cn(
        "glass-card flex h-full flex-col overflow-hidden p-5 md:p-6",
        compact ? "gap-4" : "gap-5",
        app.status === "ready" &&
          !compact &&
          "border-blue-core/20 shadow-[0_0_20px_rgba(37,99,235,0.14)]",
        app.status === "experimental" &&
          !compact &&
          "border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.14)]",
      )}
    >
      <div className="flex items-start gap-4">
        <AppLogo
          name={app.name}
          icon={app.icon}
          logoSrc={app.logoSrc}
          pixelated={app.logoPixelated}
          size={compact ? "sm" : "md"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/apps/${app.slug}`}
              className="font-display text-2xl leading-none text-foreground transition-colors hover:text-blue-core"
            >
              {app.name}
            </Link>
            {app.status ? (
              <span className={getStatusClassName(app.status)}>
                {app.status === "ready" ? t("apps.readyToUse") : t("apps.experimental")}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/70">
            {app.tagline}
          </p>
        </div>
      </div>

      {!compact ? (
        <p className="text-sm leading-6 text-muted-foreground">{app.description}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {category ? (
          <AppTagPill
            active={activeCategory === category.slug}
            href={
              onCategorySelect ? undefined : `/apps?category=${encodeURIComponent(category.slug)}`
            }
            label={category.label}
            onClick={onCategorySelect ? () => onCategorySelect(category.slug) : undefined}
          />
        ) : null}
        {app.tags.map((tag) => (
          <AppTagPill
            key={tag}
            active={tagsMatchFilter(activeTag, tag)}
            href={onTagSelect ? undefined : `/apps?tag=${encodeURIComponent(tag)}`}
            label={tag}
            onClick={onTagSelect ? () => onTagSelect(tag) : undefined}
          />
        ))}
        {platformTags.map((platform) => (
          <AppTagPill
            key={platform}
            active={activePlatform === platform}
            href={onPlatformSelect ? undefined : `/apps?platform=${encodeURIComponent(platform)}`}
            label={PLATFORM_META[platform].shortLabel}
            onClick={onPlatformSelect ? () => onPlatformSelect(platform) : undefined}
          />
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-2">
          <CardInlineCta
            href={`/apps/${app.slug}`}
            className={`apps-frosted-cta ${highlightedCtaClassName} !px-5 !py-2 text-sm`}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              <span>{t("apps.viewDetails")}</span>
            </span>
          </CardInlineCta>

          {primaryActionLink ? (
            <CardInlineCta
              href={primaryActionLink.url}
              className={`apps-frosted-cta ${highlightedCtaClassName} !px-5 !py-2 text-sm`}
            >
              <span className="inline-flex items-center gap-2">
                {getLinkIcon(primaryActionLink)}
                <span>{primaryActionLink.label}</span>
              </span>
            </CardInlineCta>
          ) : null}
        </div>

        {quickLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <CardInlineCta
                key={link.url}
                href={link.url}
                className={`apps-frosted-cta ${cardInlineCtaClassName} !rounded-full !px-4 !py-2`}
              >
                <span className="inline-flex items-center gap-2">
                  {getLinkIcon(link)}
                  <span>{link.label}</span>
                </span>
              </CardInlineCta>
            ))}
          </div>
        ) : null}

        {mirrors.length > 0 ? (
          <div className="rounded-[1.25rem] border border-border/60 px-3 py-3">
            <div className="mb-2 text-[11px] font-display uppercase tracking-[0.18em] text-foreground/45">
              {t("apps.mirrors")}
            </div>
            <div className="flex flex-wrap gap-2">
              {mirrors.slice(0, compact ? 1 : 3).map((mirror) => (
                <CardInlineCta
                  key={mirror.url}
                  href={mirror.url}
                  className={`apps-frosted-cta ${cardInlineCtaClassName} !rounded-full !px-3 !py-1.5 !text-xs`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{mirror.label}</span>
                  </span>
                </CardInlineCta>
              ))}
            </div>
          </div>
        ) : null}

        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          <span>{t("apps.sourceCode")}</span>
        </a>
      </div>
    </article>
  );
}

function getStatusClassName(status: NonNullable<AppData["status"]>) {
  return cn(
    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
    status === "ready"
      ? "border-blue-core/20 text-blue-core dark:border-blue-core/55"
      : "border-amber-500/25 text-amber-700 dark:border-amber-400/35 dark:text-amber-200",
  );
}

function getLinkIcon(link: AppLink) {
  if (link.platform === "web") {
    return <Globe className="h-4 w-4" />;
  }

  if (link.platform === "android" || link.platform === "ios") {
    return <Smartphone className="h-4 w-4" />;
  }

  if (link.platform === "desktop") {
    return link.kind === "download" ? (
      <Download className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    );
  }

  return <ArrowUpRight className="h-4 w-4" />;
}
