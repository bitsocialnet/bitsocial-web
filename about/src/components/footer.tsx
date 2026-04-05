import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Github } from "lucide-react";
import { useState } from "react";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import { DOCS_LINKS, STATS_LINKS, isDocsPath, isStatsPath } from "@/lib/docs-links";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { goHomeScrollTop, goRouteScrollTop } from "@/lib/home-nav";
import { goToMailingListSection } from "@/lib/mailing-list-nav";

const linkClassName = "text-muted-foreground hover:text-foreground transition-colors text-sm";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDominoEffect, setShowDominoEffect] = useState(false);
  const productLinks = [
    { label: t("footer.apps"), to: "/apps" },
    { label: t("footer.docs"), to: DOCS_LINKS.home },
    { label: t("footer.status"), to: STATS_LINKS.home },
  ].filter((link) => isRouteAccessible(link.to));
  const resourceLinks = [
    { label: t("footer.blog"), to: "/blog" },
    { label: t("footer.about"), to: "/about" },
  ].filter((link) => isRouteAccessible(link.to));

  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToMailingListSection(location.pathname, location.hash, navigate);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goHomeScrollTop(location.pathname, navigate);
  };

  const handlePrivacyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goRouteScrollTop(location.pathname, "/privacy", navigate);
  };

  return (
    <footer
      className="footer-glass px-6 pt-6 mt-8 md:pt-14 md:mt-12"
      style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Branding */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="inline-flex items-center gap-1.5 mb-4 group"
            >
              <img src="/logo-small.png" alt="Bitsocial" className="h-6 w-6" />
              <span className="text-lg font-display text-muted-foreground group-hover:text-foreground transition-colors">
                Bitsocial
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product */}
          {productLinks.length > 0 ? (
            <div>
              <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
                {t("footer.product")}
              </h4>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    {isDocsPath(link.to) || isStatsPath(link.to) ? (
                      <a href={link.to} className={linkClassName}>
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className={linkClassName}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Resources */}
          <div>
            <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/privacy" className={linkClassName} onClick={handlePrivacyClick}>
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <a href="/#mailing-list" className={linkClassName} onClick={handleNewsletterClick}>
                  {t("footer.newsletter")}
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.community")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <Github className="h-3.5 w-3.5" />
                  {t("footer.github")}
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <XIcon className="h-3.5 w-3.5" />
                  {t("footer.twitter")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground/70 text-xs">
          <button
            type="button"
            onClick={() => setShowDominoEffect(true)}
            className="font-display tracking-wide rounded-md transition-colors duration-300 hover:text-muted-foreground/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t("footer.bottomTagline")}
          </button>
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/bitsocialnet/bitsocial-web"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.contribute")}
            </a>
            <span className="text-border/50">&bull;</span>
            <a
              href="https://bitsocialforge.com"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="hover:text-foreground transition-colors"
            >
              &copy; {new Date().getFullYear()} Bitsocial Forge, Inc.
            </a>
          </div>
        </div>
      </div>

      <EasterEggOverlay
        imageSrc="/domino-effect-easter-egg.jpg"
        alt="Domino effect"
        open={showDominoEffect}
        onOpenChange={setShowDominoEffect}
      />
    </footer>
  );
}
