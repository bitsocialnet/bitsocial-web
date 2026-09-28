import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DOCS_LINKS, STATS_LINKS, isDocsPath, isStatsPath } from "@/lib/docs-links";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { FAQ_HASH, goToHomeSectionHash } from "@/lib/home-section-nav";
import { cn } from "@/lib/utils";
import { goHomeScrollTop, goRouteScrollTop } from "@/lib/home-nav";
import { NoJsThemeToggle, ThemeToggle } from "./theme-toggle";
import HamburgerButton from "./hamburger-button";
import LanguageSelector, { NoJsLanguageSelector } from "./language-selector";
import MobileMenu from "./mobile-menu";

// Every topbar control is an explicit 44px flex-centred box on every pointer type. Relying on a
// coarse-pointer minimum size instead grew the block links on touch devices without
// re-centring their labels, so the bar looked different on an iPad than on a laptop.
const navLinkClassName =
  "text-muted-foreground hover:text-foreground transition-colors relative group flex min-h-11 items-center px-2 text-lg md:text-base font-display leading-none";
const desktopNavLinkClassName = "h-11 min-w-11 justify-center";
const compactNavigationTriggerBufferPx = 160;
const MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE = "data-mobile-menu-interaction-guard";
const APPS_DIRECTORY_HREF = "/projects?category=apps";

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
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onClick}
        >
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
  faqLabel,
  onNavClick,
  onAppsClick,
  onFaqClick,
  routeLinks,
}: {
  faqLabel: string;
  onNavClick: () => void;
  onAppsClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onFaqClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
}) {
  return (
    <div className="topbar-links flex items-center gap-5 whitespace-nowrap">
      {routeLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={link.to === APPS_DIRECTORY_HREF ? onAppsClick : onNavClick}
          className={desktopNavLinkClassName}
          noUnderline
        >
          {link.label}
        </NavLink>
      ))}
      <NavLink
        to={`/${FAQ_HASH}`}
        onClick={onFaqClick}
        className={desktopNavLinkClassName}
        noUnderline
      >
        {faqLabel}
      </NavLink>
    </div>
  );
}

function DesktopNavigation({
  faqLabel,
  onNavClick,
  onAppsClick,
  onFaqClick,
  routeLinks,
  includeNoJsControls = true,
}: {
  faqLabel: string;
  onNavClick: () => void;
  onAppsClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onFaqClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  routeLinks: Array<{ label: string; to: string }>;
  includeNoJsControls?: boolean;
}) {
  return (
    <div className="topbar-desktop-nav flex h-11 items-center">
      <TopbarLinks
        faqLabel={faqLabel}
        onNavClick={onNavClick}
        onAppsClick={onAppsClick}
        onFaqClick={onFaqClick}
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
  routeLinks,
  faqLabel,
}: {
  routeLinks: Array<{ label: string; to: string }>;
  faqLabel: string;
}) {
  return (
    <details className="nojs-mobile-menu">
      <summary className="nojs-mobile-summary flex h-11 w-11 list-none cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menu</span>
        <span className="relative h-5 w-5">
          <span className="absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[17px] h-0.5 w-5 rounded-full bg-current" />
        </span>
      </summary>

      <div className="nojs-mobile-panel px-4 py-6">
        <nav className="flex flex-col gap-1">
          {routeLinks.map((link) => {
            const opensInNewTab = isDocsPath(link.to) || isStatsPath(link.to);

            return (
              <a
                key={link.to}
                href={link.to}
                className={navLinkClassName}
                {...(opensInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            );
          })}
          <a href={`/${FAQ_HASH}`} className={navLinkClassName}>
            {faqLabel}
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
    goRouteScrollTop(location.pathname, APPS_DIRECTORY_HREF, navigate);
  };

  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goToHomeSectionHash(location.pathname, location.hash, FAQ_HASH, navigate, handleNavClick);
  };

  const appsLabel = t("nav.apps");
  const blogLabel = t("nav.blog");
  const docsLabel = t("nav.docs");
  const statsLabel = t("nav.status");
  const faqLabel = t("nav.faq");
  const routeLinks = [
    { label: appsLabel, to: APPS_DIRECTORY_HREF },
    { label: blogLabel, to: "/blog" },
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
        // Fixed elements resolve against the viewport, which widens when a dialog's scroll
        // lock hides the scrollbar. Pulling the right anchor in by the removed scrollbar
        // width keeps the bar aligned with the page instead of drifting with the viewport.
        className="topbar-position fixed z-50 mx-auto max-w-7xl"
      >
        <div
          className={cn(
            "relative overflow-hidden topbar-frosted",
            isMenuExpanded ? "rounded-[2rem]" : "rounded-full",
          )}
        >
          <div className="relative px-4 md:px-5 py-2">
            <div
              ref={desktopNavMeasureRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
            >
              <DesktopNavigation
                faqLabel={faqLabel}
                onNavClick={handleNavClick}
                onAppsClick={handleAppsClick}
                onFaqClick={handleFaqClick}
                routeLinks={routeLinks}
                includeNoJsControls={false}
              />
            </div>

            <div ref={topbarContentRef} className="flex h-11 items-center justify-between">
              <Link
                ref={logoRef}
                to="/"
                onClick={handleLogoClick}
                className="group inline-flex h-11 items-center gap-1 transition-colors"
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
                <div className="flex h-11 items-center gap-2">
                  <HamburgerButton isOpen={isMobileMenuOpen} onClick={handleMenuToggle} />
                </div>
              ) : (
                <DesktopNavigation
                  faqLabel={faqLabel}
                  onNavClick={handleNavClick}
                  onAppsClick={handleAppsClick}
                  onFaqClick={handleFaqClick}
                  routeLinks={routeLinks}
                />
              )}

              <noscript>
                <NoJsMobileMenu routeLinks={routeLinks} faqLabel={faqLabel} />
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
                  onClick={link.to === APPS_DIRECTORY_HREF ? handleAppsClick : handleNavClick}
                  noUnderline
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to={`/${FAQ_HASH}`} onClick={handleFaqClick} noUnderline>
                {faqLabel}
              </NavLink>
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
