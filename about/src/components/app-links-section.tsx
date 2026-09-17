import { useTranslation } from "react-i18next";
import { ArrowUpRight, Download, Github, Globe, Package, Smartphone } from "lucide-react";
import AppMirrorLinkCta from "@/components/app-mirror-link-cta";
import CardInlineCta, { cardInlineCtaClassName } from "@/components/card-inline-cta";
import {
  getAppLinkLabel,
  getGithubUrl,
  getMirrorLinks,
  getSecondaryLinks,
  linkHasVerifiableStatus,
  type AppData,
  type AppLink,
} from "@/lib/apps-data";
import {
  filterCryptoWalletGatedLinks,
  useHasCryptoWalletProvider,
} from "@/lib/crypto-wallet-provider";

interface AppLinksSectionProps {
  app: AppData;
}

export default function AppLinksSection({ app }: AppLinksSectionProps) {
  const { t } = useTranslation();
  const hasCryptoWalletProvider = useHasCryptoWalletProvider();
  const webLinks = app.links.filter(
    (link) => link.platform === "web" && link.kind === "launch" && link.primary !== false,
  );
  const mobileLinks = app.links.filter(
    (link) =>
      (link.platform === "android" || link.platform === "ios") &&
      link.kind === "download" &&
      link.primary !== false,
  );
  const desktopLinks = app.links.filter(
    (link) => link.platform === "desktop" && link.kind === "download" && link.primary !== false,
  );
  const packageLinks = app.links.filter((link) => link.kind === "package");
  const extraLinks = getSecondaryLinks(app).filter((link) => link.kind !== "package");
  const mirrorLinks = filterCryptoWalletGatedLinks(getMirrorLinks(app), hasCryptoWalletProvider);
  const githubUrl = getGithubUrl(app);

  return (
    <section className="glass-card surface-pad">
      <div className="mb-5">
        <h2 className="text-xl font-display font-semibold text-foreground">
          {t("apps.linksAndMirrors")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t("apps.linksSectionDescription")}
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {webLinks.length > 0 ? (
          <LinkGroup title={t("apps.webLinks")} links={webLinks} t={t} />
        ) : null}
        {mobileLinks.length > 0 ? (
          <LinkGroup title={t("apps.mobileDownloads")} links={mobileLinks} t={t} />
        ) : null}
        {desktopLinks.length > 0 ? (
          <LinkGroup title={t("apps.desktopDownloads")} links={desktopLinks} t={t} />
        ) : null}
        {packageLinks.length > 0 ? (
          <LinkGroup
            title={t("apps.packages", { defaultValue: "Packages" })}
            links={packageLinks}
            t={t}
          />
        ) : null}
        {extraLinks.length > 0 ? (
          <LinkGroup title={t("apps.extraDownloads")} links={extraLinks} t={t} />
        ) : null}
        {mirrorLinks.length > 0 ? (
          <LinkGroup title={t("apps.mirrors")} links={mirrorLinks} t={t} />
        ) : null}

        <div className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
          <div className="sm:pt-2">
            <h3 className="font-display text-sm font-semibold leading-5 text-foreground">
              {t("apps.sourceCode")}
            </h3>
          </div>
          <CardInlineCta
            href={githubUrl}
            className={`${cardInlineCtaClassName} max-w-full justify-self-start !rounded-full !px-4 !py-2`}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Github className="h-4 w-4 shrink-0" />
              <span className="break-all">{githubUrl.replace("https://github.com/", "")}</span>
            </span>
          </CardInlineCta>
        </div>
      </div>
    </section>
  );
}

function LinkGroup({
  title,
  links,
  t,
}: {
  title: string;
  links: AppLink[];
  t: ReturnType<typeof useTranslation>["t"];
}) {
  return (
    <div className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
      <h3 className="font-display text-sm font-semibold leading-5 text-foreground sm:pt-2">
        {title}
      </h3>
      <div className="flex min-w-0 flex-wrap items-start gap-2">
        {links.map((link) =>
          linkHasVerifiableStatus(link) ? (
            <AppMirrorLinkCta
              key={link.url}
              link={link}
              icon={link.kind === "mirror" ? undefined : getLinkIcon(link)}
              className={`${cardInlineCtaClassName} max-w-full !rounded-full !px-4 !py-2`}
              showVerifiedLabel={link.kind === "mirror"}
            />
          ) : (
            <CardInlineCta
              key={link.url}
              href={link.url}
              className={`${cardInlineCtaClassName} max-w-full !rounded-full !px-4 !py-2`}
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                {getLinkIcon(link)}
                <span>{getAppLinkLabel(link, t)}</span>
              </span>
            </CardInlineCta>
          ),
        )}
      </div>
    </div>
  );
}

function getLinkIcon(link: AppLink) {
  if (link.kind === "package") {
    return <Package className="h-4 w-4" />;
  }

  if (link.kind === "download") {
    return <Download className="h-4 w-4" />;
  }

  if (link.platform === "web") {
    return link.kind === "mirror" ? (
      <ArrowUpRight className="h-4 w-4" />
    ) : (
      <Globe className="h-4 w-4" />
    );
  }

  if (link.platform === "android" || link.platform === "ios") {
    return <Smartphone className="h-4 w-4" />;
  }

  return <ArrowUpRight className="h-4 w-4" />;
}
