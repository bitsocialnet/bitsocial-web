import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DOCS_LINKS, STATS_LINKS, isDocsPath, isStatsPath } from "@/lib/docs-links";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { cn } from "@/lib/utils";
import { goHomeScrollTop, goRouteScrollTop } from "@/lib/home-nav";
import { goToMailingListSection } from "@/lib/mailing-list-nav";
import { NoJsThemeToggle, ThemeToggle } from "./theme-toggle";
import HamburgerButton from "./hamburger-button";
import LanguageSelector, { NoJsLanguageSelector } from "./language-selector";
import MobileMenu from "./mobile-menu";

const navLinkClassName =
  "text-muted-foreground hover:text-foreground transition-colors relative group text-lg md:text-base font-display leading-none py-2 px-2 block";
const compactNavigationTriggerBufferPx = 160;
const MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE = "data-mobile-menu-interaction-guard";

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
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
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
  onAppsClick,
  onNewsletterClick,
  routeLinks,
}: {
  sourceCodeLabel: string;
  newsletterLabel: string;
  onNavClick: () => void;
  onAppsClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onNewsletterClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
}) {
  return (
    <div className="topbar-links flex items-center gap-5">
      {routeLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={link.to === "/apps" ? onAppsClick : onNavClick}
          noUnderline
        >
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
  onAppsClick,
  onNewsletterClick,
  routeLinks,
  includeNoJsControls = true,
}: {
  sourceCodeLabel: string;
  newsletterLabel: string;
  onNavClick: () => void;
  onAppsClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onNewsletterClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
  includeNoJsControls?: boolean;
}) {
  return (
    <div className="topbar-desktop-nav flex items-center">
      <TopbarLinks
        sourceCodeLabel={sourceCodeLabel}
        newsletterLabel={newsletterLabel}
        onNavClick={onNavClick}
        onAppsClick={onAppsClick}
        onNewsletterClick={onNewsletterClick}
        routeLinks={routeLinks}
      />
      {routeLinks.length > 0 ? <div className="h-4 w-px bg-border mx-4" /> : null}
      <div className="topbar-controls flex items-center gap-2">
        <div className="js-only">
          <LanguageSelector />
        </div>
        <div className="js-only">
          <ThemeToggle />
        </div>
        {includeNoJsControls ? (
          <noscript>
            <div className="topbar-nojs-controls nojs-inline-flex items-center gap-2">
              <NoJsLanguageSelector />
              <NoJsThemeToggle />
            </div>
          </noscript>
        ) : null}
      </div>
    </div>
  );
}

function NoJsMobileMenu({
  newsletterLabel,
  routeLinks,
  sourceCodeLabel,
}: {
  newsletterLabel: string;
  routeLinks: Array<{ label: string; to: string }>;
  sourceCodeLabel: string;
}) {
  return (
    <details className="nojs-mobile-menu">
      <summary className="nojs-mobile-summary flex h-9 w-9 list-none cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menu</span>
        <span className="relative h-5 w-5">
          <span className="absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[17px] h-0.5 w-5 rounded-full bg-current" />
        </span>
      </summary>

      <div className="nojs-mobile-panel px-4 py-6">
        <nav className="flex flex-col gap-1">
          {routeLinks.map((link) => (
            <a key={link.to} href={link.to} className={navLinkClassName}>
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/bitsocialnet"
            target="_blank"
            rel="noopener noreferrer"
            className={`${navLinkClassName} capitalize`}
          >
            {sourceCodeLabel}
          </a>
          <a href="/#mailing-list" className={navLinkClassName}>
            {newsletterLabel}
          </a>
        </nav>

        <div className="mt-2 flex flex-col gap-3 border-t border-border/30 pt-4">
          <div>
            <NoJsThemeToggle mobile />
          </div>
          <div>
            <NoJsLanguageSelector mobile />
          </div>
        </div>
      </div>
    </details>
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
  const menuContainerRef = useRef<HTMLElement>(null);
  const topbarContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const desktopNavMeasureRef = useRef<HTMLDivElement>(null);
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

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
        closeMobileMenu();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (menuContainerRef.current?.contains(e.target as Node)) {
        return;
      }

      const eventTarget =
        e.target instanceof Element
          ? e.target
          : e.target instanceof Node
            ? e.target.parentElement
            : null;
      if (eventTarget?.closest(`[${MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE}]`)) {
        return;
      }

      e.preventDefault();
      closeMobileMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [closeMobileMenu, usesCompactNavigation, isMobileMenuOpen]);

  const handleNavClick = () => {
    closeMobileMenu();
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

  const handleAppsClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    handleNavClick();
    goRouteScrollTop(location.pathname, "/apps", navigate);
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
        ref={menuContainerRef}
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
                onAppsClick={handleAppsClick}
                onNewsletterClick={handleNewsletterClick}
                routeLinks={routeLinks}
                includeNoJsControls={false}
              />
            </div>

            <div ref={topbarContentRef} className="flex items-center justify-between">
              <Link
                ref={logoRef}
                to="/"
                onClick={handleLogoClick}
                className="inline-flex items-center gap-1 group transition-colors"
              >
                <img
                  src="/logo-small.png"
                  width={32}
                  height={32}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 transition-[filter] group-hover:brightness-110"
                />
                <span className="text-xl font-display font-regular text-muted-foreground group-hover:text-foreground transition-colors">
                  Bitsocial
                </span>
              </Link>

              {usesCompactNavigation ? (
                <div className="flex items-center gap-2">
                  <HamburgerButton isOpen={isMobileMenuOpen} onClick={handleMenuToggle} />
                </div>
              ) : (
                <DesktopNavigation
                  sourceCodeLabel={sourceCodeLabel}
                  newsletterLabel={newsletterLabel}
                  onNavClick={handleNavClick}
                  onAppsClick={handleAppsClick}
                  onNewsletterClick={handleNewsletterClick}
                  routeLinks={routeLinks}
                />
              )}

              <noscript>
                <NoJsMobileMenu
                  newsletterLabel={newsletterLabel}
                  routeLinks={routeLinks}
                  sourceCodeLabel={sourceCodeLabel}
                />
              </noscript>
            </div>
          </div>
          <MobileMenu
            isOpen={usesCompactNavigation && isMobileMenuOpen}
            onExitComplete={() => setIsMenuExpanded(false)}
          >
            <div className="flex flex-col gap-1">
              {routeLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={link.to === "/apps" ? handleAppsClick : handleNavClick}
                  noUnderline
                >
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
                <LanguageSelector
                  mobile
                  mobileMenuInteractionGuardAttribute={MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE}
                />
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
