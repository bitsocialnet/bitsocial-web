import { useTranslation } from "react-i18next";
import { ArrowUpRight, Download, Github, Globe, Package, Smartphone } from "lucide-react";
import CardInlineCta, {
  cardInlineCtaClassName,
  highlightedCtaClassName,
} from "@/components/card-inline-cta";
import {
  getAppLinkLabel,
  getGithubUrl,
  getMirrorLinks,
  getSecondaryLinks,
  type AppData,
  type AppLink,
} from "@/lib/apps-data";

interface AppLinksSectionProps {
  app: AppData;
}

export default function AppLinksSection({ app }: AppLinksSectionProps) {
  const { t } = useTranslation();
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
  const mirrorLinks = getMirrorLinks(app);
  const githubUrl = getGithubUrl(app);

  return (
    <section className="glass-card p-6 md:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-normal text-muted-foreground">
            {t("apps.linksAndMirrors")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("apps.linksSectionDescription")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
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

        <div className="rounded-[1.4rem] border border-border/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display text-lg text-foreground">{t("apps.sourceCode")}</h3>
          </div>
          <CardInlineCta
            href={githubUrl}
            className={`${cardInlineCtaClassName} !rounded-full !px-4 !py-2`}
          >
            <span className="inline-flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>{githubUrl.replace("https://github.com/", "")}</span>
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
    <div className="rounded-[1.4rem] border border-border/60 p-4">
      <h3 className="mb-3 font-display text-lg text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2.5">
        {links.map((link) => (
          <CardInlineCta
            key={link.url}
            href={link.url}
            className={
              link.kind === "mirror"
                ? `${cardInlineCtaClassName} !rounded-full !px-4 !py-2`
                : `${highlightedCtaClassName} !px-4 !py-2 text-sm`
            }
          >
            <span className="inline-flex items-center gap-2">
              {getLinkIcon(link)}
              <span>{getAppLinkLabel(link, t)}</span>
            </span>
          </CardInlineCta>
        ))}
      </div>
    </div>
  );
}

function getLinkIcon(link: AppLink) {
  if (link.kind === "package") {
    return <Package className="h-4 w-4" />;
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

  if (link.platform === "desktop" && link.kind === "download") {
    return <Download className="h-4 w-4" />;
  }

  return <ArrowUpRight className="h-4 w-4" />;
}
