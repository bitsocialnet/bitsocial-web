import { Trans, useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Download, Github, Package } from "lucide-react";
import AppLinksSection from "@/components/app-links-section";
import AppLogo from "@/components/app-logo";
import AppStatusBadge from "@/components/app-status-badge";
import AppMirrorLinkCta from "@/components/app-mirror-link-cta";
import AppTagPill from "@/components/app-tag-pill";
import CardInlineCta, {
  cardInlineCtaClassName,
  highlightedCtaClassName,
} from "@/components/card-inline-cta";
import Footer from "@/components/footer";
import RelatedApps from "@/components/related-apps";
import Topbar from "@/components/topbar";
import {
  getAppDescription,
  getAppDescriptionKey,
  getAppLinkLabel,
  getAppBySlug,
  getAppPlatforms,
  getAppTagLabel,
  getAppTagline,
  getCategoryBySlug,
  getCategoryLabel,
  getGithubUrl,
  linkHasVerifiableStatus,
  getPlatformShortLabel,
  getPrimaryLinks,
  type AppLink,
} from "@/lib/apps-data";

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const app = slug ? getAppBySlug(slug) : undefined;

  if (!app) {
    return (
      <div className="min-h-screen">
        <Topbar />
        <main className="page-main">
          <div className="mx-auto max-w-4xl">
            <div className="glass-card surface-pad text-center">
              <h1 className="text-3xl font-display font-normal text-muted-foreground">
                {t("apps.notFound")}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t("apps.notFoundDescription")}
              </p>
              <CardInlineCta
                href="/projects"
                className={`${highlightedCtaClassName} mt-6 !px-6 !py-3 text-sm`}
              >
                {t("apps.allProjects")}
              </CardInlineCta>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categories = app.categories.flatMap((slug) => getCategoryBySlug(slug) ?? []);
  const platformTags = getAppPlatforms(app);
  const primaryLinks = getPrimaryLinks(app);
  const githubUrl = getGithubUrl(app);
  const tagline = getAppTagline(app, t);
  const description = getAppDescription(app, t);
  const descriptionKey = getAppDescriptionKey(app);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Topbar />
      <main className="page-main">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/projects"
            className="touch-target mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("apps.allProjects")}
          </Link>

          <section className="glass-card surface-pad overflow-hidden">
            <div className="flex items-start gap-4 sm:gap-5">
              <AppLogo
                name={app.name}
                icon={app.icon}
                logoSrc={app.logoSrc}
                loading="eager"
                pixelated={app.logoPixelated}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h1 className="project-title optical-display-start min-w-0 break-words font-display font-semibold text-foreground">
                    {app.name}
                  </h1>
                  {app.status ? <AppStatusBadge status={app.status} /> : null}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.slug}
                      className="rounded-full border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {getCategoryLabel(category, t)}
                    </span>
                  ))}
                  {platformTags.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {getPlatformShortLabel(platform, t)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-base font-medium leading-relaxed text-foreground/80">
              {tagline}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {descriptionKey ? (
                <Trans
                  i18nKey={descriptionKey}
                  defaults={app.description}
                  components={descriptionRichTextComponents}
                />
              ) : (
                description
              )}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <AppTagPill
                  key={tag}
                  href={`/projects?tag=${encodeURIComponent(tag)}`}
                  label={getAppTagLabel(tag, t)}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {primaryLinks.slice(0, 2).map((link, index) =>
                linkHasVerifiableStatus(link) ? (
                  <AppMirrorLinkCta
                    key={link.url}
                    link={link}
                    icon={getPrimaryLinkIcon(link)}
                    className={
                      index === 0
                        ? `${highlightedCtaClassName} !px-4 !py-2 text-sm`
                        : `${cardInlineCtaClassName} !rounded-full !px-4 !py-2`
                    }
                  />
                ) : (
                  <CardInlineCta
                    key={link.url}
                    href={link.url}
                    className={
                      index === 0
                        ? `${highlightedCtaClassName} !px-4 !py-2 text-sm`
                        : `${cardInlineCtaClassName} !rounded-full !px-4 !py-2`
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      {getPrimaryLinkIcon(link)}
                      <span>{getAppLinkLabel(link, t)}</span>
                    </span>
                  </CardInlineCta>
                ),
              )}

              <CardInlineCta
                href={githubUrl}
                className={`${cardInlineCtaClassName} !rounded-full !px-4 !py-2`}
              >
                <span className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>{t("apps.sourceCode")}</span>
                </span>
              </CardInlineCta>
            </div>
          </section>

          <div className="mt-6">
            <AppLinksSection app={app} />
          </div>

          <div className="mt-10">
            <RelatedApps app={app} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const descriptionRichTextComponents = {
  code: (
    <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em] text-foreground" />
  ),
  robot9000: (
    <a
      href="https://blog.xkcd.com/2008/01/14/robot9000-and-xkcd-signal-attacking-noise-in-chat/"
      target="_blank"
      rel="noreferrer"
      className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-blue-core"
    />
  ),
};

function getPrimaryLinkIcon(link: AppLink) {
  if (link.kind === "package") {
    return <Package className="h-4 w-4" />;
  }

  if (link.kind === "download") {
    return <Download className="h-4 w-4" />;
  }

  return <ArrowUpRight className="h-4 w-4" />;
}
