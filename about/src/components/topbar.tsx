import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DOCS_LINKS, STATS_LINKS, isDocsPath, isStatsPath } from "@/lib/docs-links";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { cn } from "@/lib/utils";
import { goHomeScrollTop } from "@/lib/home-nav";
import { goToMailingListSection } from "@/lib/mailing-list-nav";
import { ThemeToggle } from "./theme-toggle";
import HamburgerButton from "./hamburger-button";
import LanguageSelector from "./language-selector";
import MobileMenu from "./mobile-menu";

const navLinkClassName =
  "text-muted-foreground hover:text-foreground transition-colors relative group text-lg md:text-base font-display leading-none py-2 px-2 block";
// Trigger the compact nav before the desktop layout looks cramped.
const compactNavigationTriggerBufferPx = 24;

function NavLink({
  to,
  href,
  children,
  onClick,
  className: extraClassName,
  noUnderline,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  noUnderline?: boolean;
}) {
  const className = extraClassName ? `${navLinkClassName} ${extraClassName}` : navLinkClassName;
  const content = (
    <>
      {children}
      {!noUnderline && (
        <span className="absolute bottom-1 left-0 w-0 h-px bg-blue-glow group-hover:w-full transition-all duration-300" />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (to) {
    if (isDocsPath(to) || isStatsPath(to)) {
      return (
        <a href={to} className={className} onClick={onClick}>
          {content}
        </a>
      );
    }

    return (
      <Link to={to} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  );
}

function TopbarLinks({
  sourceCodeLabel,
  newsletterLabel,
  onNavClick,
  onNewsletterClick,
  routeLinks,
}: {
  sourceCodeLabel: string;
  newsletterLabel: string;
  onNavClick: () => void;
  onNewsletterClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
}) {
  return (
    <div className="flex items-center gap-5">
      {routeLinks.map((link) => (
        <NavLink key={link.to} to={link.to} onClick={onNavClick} noUnderline>
          {link.label}
        </NavLink>
      ))}
      <NavLink
        href="https://github.com/bitsocialnet"
        onClick={onNavClick}
        noUnderline
        className="capitalize"
      >
        {sourceCodeLabel}
      </NavLink>
      <a href="/#mailing-list" className={navLinkClassName} onClick={onNewsletterClick}>
        {newsletterLabel}
      </a>
    </div>
  );
}

function DesktopNavigation({
  sourceCodeLabel,
  newsletterLabel,
  onNavClick,
  onNewsletterClick,
  routeLinks,
}: {
  sourceCodeLabel: string;
  newsletterLabel: string;
  onNavClick: () => void;
  onNewsletterClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
}) {
  return (
    <div className="flex items-center">
      <TopbarLinks
        sourceCodeLabel={sourceCodeLabel}
        newsletterLabel={newsletterLabel}
        onNavClick={onNavClick}
        onNewsletterClick={onNewsletterClick}
        routeLinks={routeLinks}
      />
      {routeLinks.length > 0 ? <div className="h-4 w-px bg-border mx-4" /> : null}
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default function Topbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [usesCompactNavigation, setUsesCompactNavigation] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const topbarContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const desktopNavMeasureRef = useRef<HTMLDivElement>(null);

  const updateNavigationMode = useCallback(() => {
    const availableWidth = topbarContentRef.current?.getBoundingClientRect().width ?? 0;
    const logoWidth = logoRef.current?.getBoundingClientRect().width ?? 0;
    const desktopNavWidth = desktopNavMeasureRef.current?.getBoundingClientRect().width ?? 0;

    if (!availableWidth || !logoWidth || !desktopNavWidth) {
      return;
    }

    const nextUsesCompactNavigation =
      logoWidth + desktopNavWidth + compactNavigationTriggerBufferPx > availableWidth;
    setUsesCompactNavigation((current) =>
      current === nextUsesCompactNavigation ? current : nextUsesCompactNavigation,
    );
  }, []);

  useLayoutEffect(() => {
    updateNavigationMode();

    const resizeObserver = new ResizeObserver(() => {
      updateNavigationMode();
    });

    if (topbarContentRef.current) {
      resizeObserver.observe(topbarContentRef.current);
    }

    if (logoRef.current) {
      resizeObserver.observe(logoRef.current);
    }

    if (desktopNavMeasureRef.current) {
      resizeObserver.observe(desktopNavMeasureRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updateNavigationMode]);

  useEffect(() => {
    if (!usesCompactNavigation) {
      setIsMobileMenuOpen(false);
      setIsMenuExpanded(false);
    }
  }, [usesCompactNavigation]);

  useEffect(() => {
    if (!usesCompactNavigation || !isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [usesCompactNavigation, isMobileMenuOpen]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((isOpen) => {
      const nextIsOpen = !isOpen;
      if (nextIsOpen) {
        setIsMenuExpanded(true);
      }
      return nextIsOpen;
    });
  };

  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToMailingListSection(location.pathname, location.hash, navigate, handleNavClick);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    handleNavClick();
    goHomeScrollTop(location.pathname, navigate);
  };

  const appsLabel = t("nav.apps");
  const docsLabel = t("nav.docs");
  const statsLabel = t("nav.status");
  const sourceCodeLabel = t("nav.sourceCode");
  const newsletterLabel = t("nav.newsletter");
  const routeLinks = [
    { label: appsLabel, to: "/apps" },
    { label: docsLabel, to: DOCS_LINKS.home },
    { label: statsLabel, to: STATS_LINKS.home },
  ].filter((link) => isRouteAccessible(link.to));

  return (
    <>
      <m.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed top-3 left-4 right-4 z-50 mx-auto max-w-7xl"
      >
        <div
          className={cn(
            "relative overflow-hidden topbar-frosted",
            isMenuExpanded ? "rounded-[2rem]" : "rounded-full",
          )}
        >
          <div className="relative px-5 md:px-7 py-2">
            <div
              ref={desktopNavMeasureRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
            >
              <DesktopNavigation
                sourceCodeLabel={sourceCodeLabel}
                newsletterLabel={newsletterLabel}
                onNavClick={handleNavClick}
                onNewsletterClick={handleNewsletterClick}
                routeLinks={routeLinks}
              />
            </div>

            <div ref={topbarContentRef} className="flex items-center justify-between">
              <Link
                ref={logoRef}
                to="/"
                onClick={handleLogoClick}
                className="flex items-center gap-1 group transition-colors"
              >
                <img
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="Bitsocial"
                  className="h-8 w-8 transition-[filter] group-hover:brightness-110"
                />
                <span className="text-xl font-display font-regular text-muted-foreground group-hover:text-foreground transition-colors">
                  Bitsocial
                </span>
              </Link>

              {usesCompactNavigation ? (
                <HamburgerButton isOpen={isMobileMenuOpen} onClick={handleMenuToggle} />
              ) : (
                <DesktopNavigation
                  sourceCodeLabel={sourceCodeLabel}
                  newsletterLabel={newsletterLabel}
                  onNavClick={handleNavClick}
                  onNewsletterClick={handleNewsletterClick}
                  routeLinks={routeLinks}
                />
              )}
            </div>
          </div>
          <MobileMenu
            isOpen={usesCompactNavigation && isMobileMenuOpen}
            onExitComplete={() => setIsMenuExpanded(false)}
          >
            <div className="flex flex-col gap-1">
              {routeLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={handleNavClick} noUnderline>
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                href="https://github.com/bitsocialnet"
                onClick={handleNavClick}
                noUnderline
                className="capitalize"
              >
                {sourceCodeLabel}
              </NavLink>
              <a href="/#mailing-list" className={navLinkClassName} onClick={handleNewsletterClick}>
                {newsletterLabel}
              </a>
            </div>

            <div className="mt-2 flex flex-row gap-2 border-t border-border/30 pt-4">
              <div className="flex-1">
                <LanguageSelector mobile />
              </div>
              <div className="flex-1">
                <ThemeToggle mobile />
              </div>
            </div>
          </MobileMenu>
        </div>
      </m.nav>
    </>
  );
}
