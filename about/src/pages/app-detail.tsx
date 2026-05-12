import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Download, Github, Package } from "lucide-react";
import AppLinksSection from "@/components/app-links-section";
import AppLogo from "@/components/app-logo";
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
  getAppLinkLabel,
  getAppBySlug,
  getAppPlatforms,
  getAppTagLabel,
  getAppTagline,
  getCategoryBySlug,
  getCategoryLabel,
  getGithubUrl,
  getMirrorLinks,
  linkHasVerifiableStatus,
  getPlatformShortLabel,
  getPrimaryLinks,
  type AppLink,
} from "@/lib/apps-data";
import {
  filterCryptoWalletGatedLinks,
  useHasCryptoWalletProvider,
} from "@/lib/crypto-wallet-provider";
import { cn } from "@/lib/utils";

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const app = slug ? getAppBySlug(slug) : undefined;
  const hasCryptoWalletProvider = useHasCryptoWalletProvider();

  if (!app) {
    return (
      <div className="min-h-screen">
        <Topbar />
        <main className="px-6 pb-12 pt-28">
          <div className="mx-auto max-w-4xl">
            <div className="glass-card p-8 text-center md:p-10">
              <h1 className="text-3xl font-display font-normal text-muted-foreground">
                {t("apps.notFound")}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t("apps.notFoundDescription")}
              </p>
              <CardInlineCta
                href="/apps"
                className={`${highlightedCtaClassName} mt-6 !px-6 !py-3 text-sm`}
              >
                {t("apps.notFoundBack")}
              </CardInlineCta>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getCategoryBySlug(app.category);
  const platformTags = getAppPlatforms(app);
  const primaryLinks = getPrimaryLinks(app);
  const mirrors = filterCryptoWalletGatedLinks(getMirrorLinks(app), hasCryptoWalletProvider);
  const githubUrl = getGithubUrl(app);
  const tagline = getAppTagline(app, t);
  const description = getAppDescription(app, t);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Topbar />
      <main className="px-6 pb-14 pt-28">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/apps"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("apps.backToApps")}
          </Link>

          <section className="glass-card overflow-hidden p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 gap-5">
                <AppLogo
                  name={app.name}
                  icon={app.icon}
                  logoSrc={app.logoSrc}
                  loading="eager"
                  pixelated={app.logoPixelated}
                  size="lg"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {category ? (
                      <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                        {getCategoryLabel(category, t)}
                      </span>
                    ) : null}
                    {platformTags.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {getPlatformShortLabel(platform, t)}
                      </span>
                    ))}
                    {app.status ? (
                      <span className={getStatusClassName(app.status)}>
                        {app.status === "ready" ? t("apps.readyToUse") : t("apps.experimental")}
                      </span>
                    ) : null}
                  </div>

                  <h1 className="optical-display-start mt-4 text-4xl font-display font-normal text-foreground md:text-5xl">
                    {app.name}
                  </h1>
                  <p className="mt-3 text-lg font-medium leading-7 text-foreground/70">{tagline}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <AppTagPill
                  key={tag}
                  href={`/apps?tag=${encodeURIComponent(tag)}`}
                  label={getAppTagLabel(tag, t)}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {primaryLinks.map((link, index) =>
                linkHasVerifiableStatus(link) ? (
                  <AppMirrorLinkCta
                    key={link.url}
                    link={link}
                    icon={getPrimaryLinkIcon(link)}
                    className={
                      index < 2
                        ? `${highlightedCtaClassName} !px-5 !py-2.5 text-sm`
                        : `${cardInlineCtaClassName} !rounded-full !px-5 !py-2.5`
                    }
                  />
                ) : (
                  <CardInlineCta
                    key={link.url}
                    href={link.url}
                    className={
                      index < 2
                        ? `${highlightedCtaClassName} !px-5 !py-2.5 text-sm`
                        : `${cardInlineCtaClassName} !rounded-full !px-5 !py-2.5`
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
                className={`${cardInlineCtaClassName} !rounded-full !px-5 !py-2.5`}
              >
                <span className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>{t("apps.sourceCode")}</span>
                </span>
              </CardInlineCta>
            </div>

            {mirrors.length > 0 ? (
              <div className="mt-6 rounded-[1.4rem] border border-border/60 p-4">
                <div className="mb-3 text-[11px] font-display uppercase tracking-[0.18em] text-foreground/45">
                  {t("apps.mirrors")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {mirrors.map((mirror) => (
                    <AppMirrorLinkCta
                      key={mirror.url}
                      link={mirror}
                      className={`${cardInlineCtaClassName} !rounded-full !px-3 !py-1.5 !text-xs`}
                      iconClassName="h-3.5 w-3.5"
                    />
                  ))}
                </div>
              </div>
            ) : null}
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

function getStatusClassName(status: "ready" | "experimental") {
  return cn(
    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
    status === "ready"
      ? "border-blue-core/20 text-blue-core dark:border-blue-core/55"
      : "border-amber-500/25 text-amber-700 dark:border-amber-400/35 dark:text-amber-200",
  );
}

function getPrimaryLinkIcon(link: AppLink) {
  if (link.kind === "package") {
    return <Package className="h-4 w-4" />;
  }

  if (link.kind === "download") {
    return <Download className="h-4 w-4" />;
  }

  return <ArrowUpRight className="h-4 w-4" />;
}
